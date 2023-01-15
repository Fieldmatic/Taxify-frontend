import { Action } from '@ngrx/store';
import { MapData } from '../model/mapData.model';
import { Driver } from '../../shared/driver.model';
import { Location } from '../model/location';
import { Map } from 'ol';
export const MAP_LOAD_START = '[Maps] Map load started';
export const MAP_LOAD_END = '[Maps] Map load ended';
export const DRIVER_SELECTED = '[Maps] Driver is selected';
export const POPUP_CLOSE = '[Maps] Close driver popup';

export const LOAD_DIRECTION_COORDINATES = '[Maps] Load direction coordinates';

export const LOAD_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Load pickup location autocomplete results';

export const SET_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Set pickup location autocomplete results';

export const LOAD_DESTINATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Load destination autocomplete results';
export const SET_DESTINATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Set destination autocomplete results';
export const ADD_MARKER = '[Maps]';
export const SET_DIRECTION_COORDINATES = '[Maps] Set direction coordinates';

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

export class LoadPickupLocationAutocompleteResults implements Action {
  readonly type = LOAD_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS;
  constructor(public payload: { value: string }) {}
}

export class SetPickupLocationAutocompleteResults implements Action {
  readonly type = SET_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS;
  constructor(public payload: Location[]) {}
}

export class LoadDestinationAutocompleteResults implements Action {
  readonly type = LOAD_DESTINATION_AUTOCOMPLETE_RESULTS;
  constructor(public payload: { value: string }) {}
}

export class SetDestinationAutocompleteResults implements Action {
  readonly type = SET_DESTINATION_AUTOCOMPLETE_RESULTS;
  constructor(public payload: Location[]) {}
}

export class PopupClose implements Action {
  readonly type = POPUP_CLOSE;
}

export class LoadDirectionCoordinates implements Action {
  readonly type = LOAD_DIRECTION_COORDINATES;
  constructor(
    public payload: { coordinates: [longitude: number, latitude: number][] }
  ) {}
}

export class SetDirectionCoordinates implements Action {
  readonly type = SET_DIRECTION_COORDINATES;
  constructor(
    public payload: { coordinates: [longitude: number, latitude: number][] }
  ) {}
}

export type MapsActions =
  | MapLoadStart
  | MapLoadEnd
  | DriverSelected
  | PopupClose
  | LoadPickupLocationAutocompleteResults
  | SetPickupLocationAutocompleteResults
  | LoadDestinationAutocompleteResults
  | SetDestinationAutocompleteResults
  | LoadDirectionCoordinates
  | SetDirectionCoordinates;
