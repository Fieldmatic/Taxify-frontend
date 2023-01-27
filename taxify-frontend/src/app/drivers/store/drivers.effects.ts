import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Driver } from '../../shared/model/driver.model';
import * as fromApp from '../../store/app.reducer';
import * as DriversActions from '../store/drivers.actions';
import * as MapsActions from '../../maps/store/maps.actions';

@Injectable()
export class DriversEffects {
  fetchActiveDriversInArea = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriversActions.FETCH_ACTIVE_DRIVERS_IN_AREA),
      withLatestFrom(this.store.select('maps')),
      switchMap(([actionData, mapsState]) => {
        const mapData = mapsState.mapData;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('minLongitude', mapData.minLng);
        queryParams = queryParams.append('maxLongitude', mapData.maxLng);
        queryParams = queryParams.append('minLatitude', mapData.minLat);
        queryParams = queryParams.append('maxLatitude', mapData.maxLat);
        return this.http
          .get<Driver[]>('http://localhost:8080/api/driver/allActiveInArea', {
            params: queryParams,
          })
          .pipe(
            map((drivers) => {
              return new DriversActions.SetDrivers(
                drivers.map((driver) => {
                  let vehicle = { ...driver.vehicle };
                  vehicle.location = [
                    vehicle.location['longitude'],
                    vehicle.location['latitude'],
                  ];
                  return {
                    ...driver,
                    vehicle,
                  };
                })
              );
            }),
            catchError((errorResponse) => {
              return of(
                new DriversActions.FetchDriversFailed(errorResponse.status)
              );
            })
          );
      })
    );
  });

  updateDrivers = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapsActions.MAP_LOAD_END),
      map(() => {
        return new DriversActions.FetchActiveDriversInArea();
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
