import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Vehicle } from '../../shared/vehicle.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as fromApp from '../../store/app.reducer';
import * as VehiclesActions from '../store/vehicles.actions';

@Injectable()
export class VehiclesEffects {
  valuesChanged = createEffect(() => {
    return this.actions$.pipe(
      ofType(VehiclesActions.VEHICLES_CHANGED, VehiclesActions.MAP_LOAD_END),
      map(() => {
        return new VehiclesActions.FetchActiveRecipesInArea();
      })
    );
  });

  fetchActiveVehiclesInArea = createEffect(() => {
    return this.actions$.pipe(
      ofType(VehiclesActions.FETCH_ACTIVE_VEHICLES_IN_AREA),
      withLatestFrom(this.store.select('vehicles')),
      switchMap(([actionData, vehiclesState]) => {
        const mapData = vehiclesState.mapData;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('minLongitude', mapData.minLng);
        queryParams = queryParams.append('maxLongitude', mapData.maxLng);
        queryParams = queryParams.append('minLatitude', mapData.minLat);
        queryParams = queryParams.append('maxLatitude', mapData.maxLat);
        return this.http
          .get<Vehicle[]>('http://localhost:8080/api/vehicle/allInArea', {
            params: queryParams,
          })
          .pipe(
            map((vehicles) => {
              return new VehiclesActions.SetVehicles(
                vehicles.map((vehicle) => {
                  return {
                    ...vehicle,
                    location: [
                      vehicle.location['longitude'],
                      vehicle.location['latitude'],
                    ],
                  };
                })
              );
            }),
            catchError((errorResponse) => {
              return of(
                new VehiclesActions.FetchVehiclesFailed(errorResponse.status)
              );
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
