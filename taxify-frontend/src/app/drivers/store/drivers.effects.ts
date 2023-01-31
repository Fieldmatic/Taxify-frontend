import { GetDriverInfo } from './drivers.actions';
import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Driver } from '../../shared/driver.model';
import * as fromApp from '../../store/app.reducer';
import * as DriversActions from '../store/drivers.actions';
import * as MapsActions from '../../maps/store/maps.actions';
import { Ride } from 'src/app/shared/ride.model';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';
import { DriverState } from '../model/driverState';

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
          .get<Driver[]>(this.config.apiEndpoint + 'driver/allActiveInArea', {
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
            this.config.apiEndpoint +
              'driver/get/' +
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
              this.config.apiEndpoint +
                'driver/remainingWorkTime/' +
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
            this.config.apiEndpoint +
              'driver/' +
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

  notifyOfArrivedVehicle = createEffect(() => {
    return this.actions$.pipe(
      ofType(DriversActions.NOTIFY_PASSENGER_VEHICLE_HAS_ARRIVED),
      switchMap(() => {
        return this.http
          .put<void>(
            this.config.apiEndpoint + 'notification/vehicleArrived',
            {}
          )
          .pipe(
            map(() => {
              return new DriversActions.SetDriverState({
                state: DriverState.ARRIVED_TO_CLIENT,
              });
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
