import { Vehicle } from '../../shared/vehicle.model';
import { Action } from '@ngrx/store';
import { MapData } from '../mapData.model';

export const VEHICLES_CHANGED = '[Vehicles] Vehicles changed';

export const FETCH_ACTIVE_VEHICLES_IN_AREA =
  '[Vehicles] Fetch active vehicles in area';
export const SET_VEHICLES = '[Vehicles] Set vehicles';
export const FETCH_VEHICLES_FAIL = '[Vehicles] Failed to fetch vehicles';

export const MAP_LOAD_START = '[Vehicles] Map load started';
export const MAP_LOAD_END = '[Vehicles] Map load ended';

export class VehiclesChanged implements Action {
  readonly type = VEHICLES_CHANGED;
}

export class FetchActiveRecipesInArea implements Action {
  readonly type = FETCH_ACTIVE_VEHICLES_IN_AREA;
}

export class SetVehicles implements Action {
  readonly type = SET_VEHICLES;

  constructor(public payload: Vehicle[]) {}
}

export class FetchVehiclesFailed implements Action {
  readonly type = FETCH_VEHICLES_FAIL;

  constructor(public payload: number) {}
}

export class MapLoadStart implements Action {
  readonly type = MAP_LOAD_START;
}

export class MapLoadEnd implements Action {
  readonly type = MAP_LOAD_END;

  constructor(public payload: MapData) {}
}

export type VehiclesActions =
  | VehiclesChanged
  | FetchActiveRecipesInArea
  | SetVehicles
  | FetchVehiclesFailed
  | MapLoadStart
  | MapLoadEnd;
