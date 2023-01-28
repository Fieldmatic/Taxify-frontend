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
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs';
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
        return this.http
          .post<Driver>(
            this.config.apiEndpoint + 'driver/suitableDriverForRide',
            {
              clientLocation: searchForRideData.payload.clientLocation,
              vehicleTypes: searchForRideData.payload.vehicleTypes,
              petFriendly: searchForRideData.payload.petFriendly,
              babyFriendly: searchForRideData.payload.babyFriendly,
            }
          )
          .pipe(
            map((driver: Driver) => {
              console.log(driver);
              return new MapsActions.StartRide({
                driver: driver,
                route: searchForRideData.payload.route,
              });
            })
          );
      })
    )
  );

  startRide = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.START_RIDE),
      switchMap((startRide: MapsActions.StartRide) => {
        let route = startRide.payload.route.map((coordinates) => ({
          longitude: coordinates[0],
          latitude: coordinates[1],
          isStop: false,
        }));
        const body = {
          id: startRide.payload.driver.vehicle.id,
          waypoints: route,
        };
        return this.http
          .post(this.config.apiEndpoint + 'simulation/through-route', body)
          .pipe(
            map((response: boolean) => {
              return new MapsActions.RideFinished();
            })
          );
      })
    )
  );

  rideFinish = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.RIDE_FINISH),
      map(() => {
        return new MapsActions.SetPassengerStateFormFill();
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

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
