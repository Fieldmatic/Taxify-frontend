import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth/auth.service';
import { APP_SERVICE_CONFIG } from '../../appConfig/appconfig.service';
import { AppConfig } from '../../appConfig/appconfig.interface';
import * as MapsActions from './maps.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Location } from '../model/location';
import { GeoJSON, GeoJsonObject } from 'geojson';
import {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  GeoJSONObject,
} from 'ol/format/GeoJSON';
import { Driver } from '../../shared/driver.model';
import {
  LOAD_AVAILABLE_ROUTES_FOR_TWO_POINTS,
  SetAvailableRoutesCoordinates,
} from './maps.actions';
import { Route } from '../model/route';
import * as DriverActions from '../../drivers/store/drivers.actions';
import { DriverState } from 'src/app/drivers/model/driverState';
import { RideStatus } from '../model/rideStatus';
import { RideRouteResponse } from '../model/rideRouteResponse';
import { MapsService } from '../maps.service';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class MapsEffects {
  loadAvailableRoutesForTwoPoints = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.LOAD_AVAILABLE_ROUTES_FOR_TWO_POINTS),
      mergeMap(
        (
          loadAvailableRoutesForTwoPoints: MapsActions.LoadAvailableRoutesForTwoPoints
        ) => {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
              '5b3ce3597851110001cf6248b39bab9bc5c8470d9a7d66dd54e43ee5',
            skip: 'true',
          });
          const requestOptions = { headers: headers };
          return this.http
            .post(
              'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
              {
                coordinates:
                  loadAvailableRoutesForTwoPoints.payload.coordinates,
                alternative_routes: { target_count: 3, weight_factor: 2 },
              },
              requestOptions
            )
            .pipe(
              map((data: GeoJSONFeatureCollection) => {
                let availableRoutes: Route[] = data.features.map((feature) => {
                  return new Route(
                    feature.geometry['coordinates'].map((coordinates) => {
                      return [coordinates[0], coordinates[1], false];
                    }),
                    feature.properties['summary']['distance'],
                    feature.properties['summary']['duration']
                  );
                });
                return new MapsActions.SetAvailableRoutesCoordinates({
                  id: loadAvailableRoutesForTwoPoints.payload.destinationId,
                  routes: availableRoutes,
                });
              })
            );
        }
      )
    )
  );

  loadTimeFromDriverToClient = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.LOAD_TIME_FROM_DRIVER_TO_CLIENT),
      mergeMap(
        (
          loadTimeFromDriverToClient: MapsActions.LoadTimeFromDriverToClient
        ) => {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
              '5b3ce3597851110001cf6248b39bab9bc5c8470d9a7d66dd54e43ee5',
            skip: 'true',
          });
          const requestOptions = { headers: headers };
          return this.http
            .post(
              'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
              {
                coordinates: loadTimeFromDriverToClient.payload.coordinates,
              },
              requestOptions
            )
            .pipe(
              map((data: GeoJSONFeatureCollection) => {
                let numberOfPoints: number =
                  data.features[0]['geometry']['coordinates'].length;
                return new MapsActions.SetTimeLeft({
                  timeLeft: numberOfPoints,
                });
              })
            );
        }
      )
    )
  );

  loadPickupLocationAutocompleteResults = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.LOAD_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS),
      switchMap(
        (
          loadLocationAutocompleteResults: MapsActions.LoadPickupLocationAutocompleteResults
        ) => {
          let params = {
            text: loadLocationAutocompleteResults.payload.value,
            format: 'json',
            apiKey: 'b66a7896d2774c2ba544b47fe1c270ce',
            lang: 'en',
            filter: 'countrycode:rs',
          };
          return this.http
            .get('https://api.geoapify.com/v1/geocode/autocomplete', {
              params: params,
              headers: { skip: 'true' },
            })
            .pipe(
              map((data) => {
                let locationAddresses: Location[] = data['results'].map(
                  (locationObject) => {
                    return {
                      address: locationObject.formatted,
                      latitude: locationObject.lat,
                      longitude: locationObject.lon,
                    };
                  }
                );
                return new MapsActions.SetPickupLocationAutocompleteResults(
                  locationAddresses
                );
              })
            );
        }
      )
    )
  );

  searchForDriver = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.SEARCH_FOR_DRIVER),
      switchMap((searchForRideData: MapsActions.SearchForDriver) => {
        let route = searchForRideData.payload.route.map((data) => ({
          longitude: data[0],
          latitude: data[1],
          stop: data[2],
        }));
        return this.http
          .post<Driver>(
            this.config.apiEndpoint + 'driver/suitableDriverForRide',
            {
              clientLocation: searchForRideData.payload.clientLocation,
              routeRequest: { waypoints: route },
              vehicleTypes: searchForRideData.payload.vehicleTypes,
              petFriendly: searchForRideData.payload.petFriendly,
              babyFriendly: searchForRideData.payload.babyFriendly,
              passengers: {
                senderEmail: searchForRideData.payload.sender,
                recipientsEmails: searchForRideData.payload.linkedUsers,
              },
            }
          )
          .pipe(
            map((driver: Driver) => {
              return new MapsActions.SetRideDriver({
                driver: driver,
                rideStatus: RideStatus.WAITING_FOR_DRIVER_TO_ARRIVE,
              });
            })
          );
      })
    )
  );

  loadActiveRoute = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.LOAD_ACTIVE_ROUTE),
      switchMap((loadActiveRoute: MapsActions.LoadActiveRoute) => {
        return this.http
          .get<RideRouteResponse>(
            this.config.apiEndpoint + 'ride/assignedRideRoute'
          )
          .pipe(
            map((rideRouteResponse: RideRouteResponse) => {
              if (!rideRouteResponse) return { type: 'DUMMY' };
              else
                return new MapsActions.SetActiveRideAndDriver({
                  rideRouteInfo: rideRouteResponse,
                });
            })
          );
      })
    )
  );

  startRide = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MapsActions.START_RIDE_DRIVER),
        switchMap(() => {
          return this.http.post(
            this.config.apiEndpoint + 'simulation/through-route',
            {}
          );
        })
      ),
    { dispatch: false }
  );

  finishRide = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.FINISH_RIDE_DRIVER),
      switchMap(() => {
        return this.http
          .put(this.config.apiEndpoint + 'driver/finishRide', {})
          .pipe(
            map(() => {
              return new DriverActions.SetDriverState({
                state: DriverState.RIDE_FINISHED,
              });
            })
          );
      })
    )
  );

  rejectRide = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.REJECT_RIDE_DRIVER),
      switchMap((rejectRide: MapsActions.RejectRideDriver) => {
        return this.http
          .put(this.config.apiEndpoint + 'driver/rejectRide', {
            rejectionReason: rejectRide.payload.rejectReason,
          })
          .pipe(
            map(() => {
              return new DriverActions.SetDriverState({
                state: DriverState.RIDE_REJECTED,
              });
            })
          );
      })
    )
  );

  rideStarted = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.RIDE_STARTED_PASSENGER),
      map(() => {
        return new MapsActions.SetRideStatus(RideStatus.RIDING);
      })
    )
  );

  resetStateAfterRideFinish = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.RESET_STATE_AFTER_RIDE_FINISH),
      map(() => {
        return new MapsActions.SetRideStatus(RideStatus.FORM_FILL);
      })
    )
  );

  loadDestinationAutocompleteResults = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.LOAD_DESTINATION_AUTOCOMPLETE_RESULTS),
      switchMap(
        (
          loadDestinationAutocompleteResults: MapsActions.LoadDestinationAutocompleteResults
        ) => {
          let params = {
            text: loadDestinationAutocompleteResults.payload.value,
            format: 'json',
            apiKey: 'b66a7896d2774c2ba544b47fe1c270ce',
            lang: 'en',
            filter: 'countrycode:rs',
          };
          return this.http
            .get('https://api.geoapify.com/v1/geocode/autocomplete', {
              params: params,
              headers: { skip: 'true' },
            })
            .pipe(
              map((data) => {
                let locationAddresses: Location[] = data['results'].map(
                  (locationObject) => {
                    return {
                      address: locationObject.formatted,
                      latitude: locationObject.lat,
                      longitude: locationObject.lon,
                    };
                  }
                );
                return new MapsActions.SetDestinationAutocompleteResults(
                  locationAddresses
                );
              })
            );
        }
      )
    )
  );

  simulateDriverRideToClient = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapsActions.SIMULATE_DRIVER_RIDE_TO_CLIENT),
      switchMap(() => {
        return this.http
          .post<number>(this.config.apiEndpoint + 'simulation/to-client', {})
          .pipe(
            map((result) => {
              return new MapsActions.SimulateDriverRideToClientEnd({
                simulationResult: result,
              });
            })
          );
      })
    );
  });

  simulateDriverRideToClientEnd = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapsActions.SIMULATE_DRIVER_RIDE_TO_CLIENT_END),
      map((simulationEnd: MapsActions.SimulateDriverRideToClientEnd) => {
        if (simulationEnd.payload.simulationResult === 0) {
          return new DriverActions.NotifyPassengerOfVehicleArrivedToClient();
        } else {
          this.toastr.info(
            'The ride was successfully cancelled.',
            'Notification',
            {
              timeOut: 5000,
              closeButton: true,
              tapToDismiss: true,
              newestOnTop: true,
              positionClass: 'toast-top-center',
            }
          );
          return { type: 'Dummy' };
        }
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private mapService: MapsService,
    private store: Store,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private toastr: ToastrService
  ) {}
}
