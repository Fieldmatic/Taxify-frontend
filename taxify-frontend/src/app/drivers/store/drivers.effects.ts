import { GetDriverInfo } from './drivers.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Driver } from '../../shared/driver.model';
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

  getDriverInfo = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriversActions.GET_DRIVER_INFO),
      switchMap((getDriverInfoAction: DriversActions.GetDriverInfo) => {
        return this.http
          .get<Driver>(
            'http://localhost:8080/api/driver/get/' +
              getDriverInfoAction.payload.email
          )
          .pipe(
            map((driver) => {
              return new DriversActions.SetDriver(driver);
            }),
            catchError(() => {
              return of();
            })
          );
      })
    );
  });

  getDriverRemainingWorkTime = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriversActions.GET_DRIVER_REMAINING_WORK_TIME),
      switchMap(
        (getRemainingTime: DriversActions.GetDriverRemainingWorkTime) => {
          return this.http
            .get<number>(
              'http://localhost:8080/api/driver/remainingWorkTime/' +
                getRemainingTime.payload.email
            )
            .pipe(
              map((time: number) => {
                return new DriversActions.SetDriverRemainingWorkTime({
                  remainingTime: time,
                });
              }),
              catchError(() => {
                return of();
              })
            );
        }
      )
    );
  });

  changeDriverStatus = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriversActions.CHANGE_DRIVER_STATUS),
      switchMap((changeDriverStatus: DriversActions.ChangeDriverStatus) => {
        let action = 'goOnline';
        if (changeDriverStatus.payload.active) {
          action = 'goOffline';
        }
        return this.http
          .put<Driver>(
            'http://localhost:8080/api/driver/' +
              action +
              '/' +
              changeDriverStatus.payload.email,
            {}
          )
          .pipe(
            map((driver) => {
              return new DriversActions.SetDriver(driver);
            }),
            catchError(() => {
              return of();
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
