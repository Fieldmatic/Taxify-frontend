import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth/auth.service';
import { APP_SERVICE_CONFIG } from '../../appConfig/appconfig.service';
import { AppConfig } from '../../appConfig/appconfig.interface';
import * as MapsActions from './maps.actions';
import { catchError, map, switchMap, tap } from 'rxjs';
import { Location } from '../model/location';
import { GeoJSON, GeoJsonObject } from 'geojson';
import {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  GeoJSONObject,
} from 'ol/format/GeoJSON';

@Injectable()
export class MapsEffects {
  loadDirectionCoordinates = createEffect(() =>
    this.actions$.pipe(
      ofType(MapsActions.LOAD_DIRECTION_COORDINATES),
      switchMap(
        (loadDirectionCoordinates: MapsActions.LoadDirectionCoordinates) => {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization:
              '5b3ce3597851110001cf6248e39388eebabc4b62a4c73f8387f68638',
          });
          const requestOptions = { headers: headers };
          return this.http
            .post(
              'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
              {
                coordinates: loadDirectionCoordinates.payload.coordinates,
              },
              requestOptions
            )
            .pipe(
              map((data: GeoJSONFeatureCollection) => {
                return new MapsActions.SetDirectionCoordinates({
                  coordinates: data.features[0].geometry['coordinates'],
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
          };
          return this.http
            .get('https://api.geoapify.com/v1/geocode/autocomplete', {
              params: params,
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
          };
          return this.http
            .get('https://api.geoapify.com/v1/geocode/autocomplete', {
              params: params,
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
