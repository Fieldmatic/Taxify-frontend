import { Action } from '@ngrx/store';
import { DriverState } from 'src/app/drivers/model/driverState';
import { RideHistoryResponse } from 'src/app/passengers/model/rideHistoryResponse';
import { Ride } from 'src/app/shared/ride.model';
import { Driver } from '../../shared/driver.model';

export const FETCH_ACTIVE_DRIVERS_IN_AREA =
  '[Drivers] Fetch active drivers in area';
export const SET_DRIVERS = '[Drivers] Set drivers';
export const FETCH_DRIVERS_FAIL = '[Drivers] Failed to fetch drivers';
export const GET_DRIVER_INFO = '[Drivers] Get driver info';
export const SET_DRIVER = '[Drivers] Set driver';
export const GET_DRIVER_REMAINING_WORK_TIME =
  '[Drivers] Get driver remaining work time';
export const SET_DRIVER_REMAINING_WORK_TIME =
  '[Drivers] Set driver remaining work time';
export const CHANGE_DRIVER_STATUS = '[Drivers] Change driver status';
export const SET_DRIVER_STATE = '[Drivers] Set Driver State';
export const GET_DRIVER_ASSIGNED_RIDE = '[Drivers] Get driver assigned ride';
export const SET_ASSIGNED_RIDE_TO_DRIVER = '[Drivers] Assign ride to driver';
export const NOTIFY_PASSENGER_VEHICLE_HAS_ARRIVED_TO_CLIENT =
  '[Drivers] Notify passenger that vehicle has arrived to client';
export const NOTIFY_PASSENGER_VEHICLE_HAS_ARRIVED_TO_DESTINATION =
  '[Drivers] Notify passenger that vehicle has arrived to destination';
export const LOAD_DRIVER_RIDE_HISTORY = '[Passenger] Load driver ride history';
export const SET_DRIVER_RIDE_HISTORY = '[Passenger] Set driver ride history';

export class FetchActiveDriversInArea implements Action {
  readonly type = FETCH_ACTIVE_DRIVERS_IN_AREA;
}

export class SetDrivers implements Action {
  readonly type = SET_DRIVERS;

  constructor(public payload: Driver[]) {}
}

export class FetchDriversFailed implements Action {
  readonly type = FETCH_DRIVERS_FAIL;

  constructor(public payload: number) {}
}

export class GetDriverInfo implements Action {
  readonly type = GET_DRIVER_INFO;

  constructor(public payload: { email: string }) {}
}

export class SetDriver implements Action {
  readonly type = SET_DRIVER;

  constructor(public payload: Driver) {}
}

export class GetDriverRemainingWorkTime implements Action {
  readonly type = GET_DRIVER_REMAINING_WORK_TIME;

  constructor(public payload: { email: string }) {}
}

export class SetDriverRemainingWorkTime implements Action {
  readonly type = SET_DRIVER_REMAINING_WORK_TIME;

  constructor(public payload: { remainingTime: number }) {}
}

export class ChangeDriverStatus implements Action {
  readonly type = CHANGE_DRIVER_STATUS;

  constructor(public payload: { email: string; active: boolean }) {}
}

export class SetDriverState implements Action {
  readonly type = SET_DRIVER_STATE;

  constructor(public payload: { state: DriverState }) {}
}

export class GetDriverAssignedRide implements Action {
  readonly type = GET_DRIVER_ASSIGNED_RIDE;
}

export class SetAssignedRideToDriver implements Action {
  readonly type = SET_ASSIGNED_RIDE_TO_DRIVER;
  constructor(public payload: { ride: Ride }) {}
}

export class NotifyPassengerOfVehicleArrivedToClient implements Action {
  readonly type = NOTIFY_PASSENGER_VEHICLE_HAS_ARRIVED_TO_CLIENT;
  constructor() {}
}

export class LoadDriverRideHistory implements Action {
  readonly type = LOAD_DRIVER_RIDE_HISTORY;
  constructor() {}
}

export class SetDriverRideHistory implements Action {
  readonly type = SET_DRIVER_RIDE_HISTORY;
  constructor(public payload: { rides: RideHistoryResponse[] }) {}
}

export type DriversActions =
  | FetchActiveDriversInArea
  | SetDrivers
  | FetchDriversFailed
  | GetDriverInfo
  | SetDriver
  | GetDriverRemainingWorkTime
  | SetDriverRemainingWorkTime
  | ChangeDriverStatus
  | SetDriverState
  | SetAssignedRideToDriver
  | NotifyPassengerOfVehicleArrivedToClient
  | LoadDriverRideHistory
  | SetDriverRideHistory;
