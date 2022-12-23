import { Action } from '@ngrx/store';
import { MapData } from '../mapData.model';
import { Driver } from '../../shared/driver.model';

export const MAP_LOAD_START = '[Maps] Map load started';
export const MAP_LOAD_END = '[Maps] Map load ended';
export const DRIVER_SELECTED = '[Maps] Driver is selected';
export const POPUP_CLOSE = '[Maps] Close driver popup';

export class MapLoadStart implements Action {
  readonly type = MAP_LOAD_START;
}

export class MapLoadEnd implements Action {
  readonly type = MAP_LOAD_END;

  constructor(public payload: MapData) {}
}

export class DriverSelected implements Action {
  readonly type = DRIVER_SELECTED;

  constructor(public payload: Driver) {}
}

export class PopupClose implements Action {
  readonly type = POPUP_CLOSE;
}

export type MapsActions =
  | MapLoadStart
  | MapLoadEnd
  | DriverSelected
  | PopupClose;
