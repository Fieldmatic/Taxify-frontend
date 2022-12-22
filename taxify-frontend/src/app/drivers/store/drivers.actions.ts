import { Action } from '@ngrx/store';
import { Driver } from '../../shared/driver.model';

export const FETCH_ACTIVE_DRIVERS_IN_AREA =
  '[Drivers] Fetch active drivers in area';
export const SET_DRIVERS = '[Drivers] Set drivers';
export const FETCH_DRIVERS_FAIL = '[Drivers] Failed to fetch drivers';

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

export type DriversActions =
  | FetchActiveDriversInArea
  | SetDrivers
  | FetchDriversFailed;
