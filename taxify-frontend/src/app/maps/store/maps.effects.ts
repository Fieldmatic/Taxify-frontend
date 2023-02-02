import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { APP_SERVICE_CONFIG } from '../../appConfig/appconfig.service';
import { AppConfig } from '../../appConfig/appconfig.interface';
import * as MapsActions from './maps.actions';
import { map, mergeMap, switchMap } from 'rxjs';
import { Location } from '../model/location';
import { GeoJSONFeatureCollection } from 'ol/format/GeoJSON';
import { Driver } from '../../shared/model/driver.model';
import { Route } from '../model/route';
import * as DriverActions from '../../drivers/store/drivers.actions';
import { DriverState } from 'src/app/drivers/model/driverState';
import { PassengerState } from '../model/passengerState';

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
                    feature.properties['summary']['distance'],
                    feature.properties['summary']['duration'],
                    feature.geometry['coordinates']
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
        let route = searchForRideData.payload.route.map((coordinates) => ({
          longitude: coordinates[0],
          latitude: coordinates[1],
          isStop: false,
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
              paymentMethodId: searchForRideData.payload.paymentMethodId,
            }
          )
          .pipe(
            map((driver: Driver) => {
              return new MapsActions.SetRideDriver({
                driver: driver,
                passengerState: PassengerState.WAITING_FOR_DRIVER_TO_ARRIVE,
              });
            })
          );
      })
    )
  );

  startRide = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.START_RIDE_DRIVER),
      switchMap((startRide: MapsActions.StartRideDriver) => {
        return this.http
          .post(
            this.config.apiEndpoint +
              'simulation/through-route/' +
              startRide.payload.assignedRideId,
            {}
          )
          .pipe(
            map(() => {
              return new MapsActions.FinishRide({
                assignedRideId: startRide.payload.assignedRideId,
              });
            })
          );
      })
    )
  );

  finishRide = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.FINISH_RIDE_DRIVER),
      switchMap((finishRide: MapsActions.FinishRide) => {
        return this.http
          .put(
            this.config.apiEndpoint +
              'driver/finishRide/' +
              finishRide.payload.assignedRideId,
            {}
          )
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

  rideStarted = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.RIDE_STARTED_PASSENGER),
      map(() => {
        return new MapsActions.SetPassengerState(PassengerState.RIDING);
      })
    )
  );

  rideFinish = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.RIDE_FINISH_PASSENGER),
      map(() => {
        return new MapsActions.SetPassengerState(PassengerState.FORM_FILL);
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
          .post<Driver>(this.config.apiEndpoint + 'simulation/to-client', {})
          .pipe(
            map(() => {
              return new DriverActions.GetDriverAssignedRide();
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
