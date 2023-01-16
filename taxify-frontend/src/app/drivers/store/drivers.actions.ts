import { Action } from '@ngrx/store';
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

export type DriversActions =
  | FetchActiveDriversInArea
  | SetDrivers
  | FetchDriversFailed
  | GetDriverInfo
  | SetDriver
  | GetDriverRemainingWorkTime
  | SetDriverRemainingWorkTime
  | ChangeDriverStatus;
