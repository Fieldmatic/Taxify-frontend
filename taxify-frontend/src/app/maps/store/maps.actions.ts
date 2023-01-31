import { Action } from '@ngrx/store';
import { MapData } from '../model/mapData.model';
import { Driver } from '../../shared/driver.model';
import { Location } from '../model/location';
import { Map } from 'ol';
import { Route } from '../model/route';
import { RideStatus } from '../model/rideStatus';
import { RideRouteResponse } from '../model/rideRouteResponse';
export const MAP_LOAD_START = '[Maps] Map load started';
export const MAP_LOAD_END = '[Maps] Map load ended';
export const DRIVER_SELECTED = '[Maps] Driver is selected';
export const POPUP_CLOSE = '[Maps] Close driver popup';

export const LOAD_AVAILABLE_ROUTES_FOR_TWO_POINTS =
  '[Maps] Load available routes for two points';
export const SEARCH_FOR_DRIVER = '[Maps] Search for driver';

export const LOAD_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Load pickup location autocomplete results';

export const SET_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Set pickup location autocomplete results';

export const LOAD_DESTINATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Load destination autocomplete results';
export const SET_DESTINATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Set destination autocomplete results';
export const RESET_STATE_AFTER_RIDE_FINISH = '[Maps] Reset state after ride finish';

export const START_RIDE_DRIVER = '[Maps] Start ride driver';
export const SET_RIDE_STATUS = '[Maps] Set ride status';
export const SET_SELECTED_ROUTE_COORDINATES =
  '[Maps] Set selected route coordinates';
export const SET_AVAILABLE_ROUTES_COORDINATES =
  '[Maps] Set available routes coordinates';

export const CLEAR_DESTINATION_AUTOCOMPLETE_RESULTS =
  '[Maps] Clear destination autocomplete results';

export const REMOVE_COORDINATES_FOR_DESTINATION =
  '[Maps] Remove coordinates for destination ';

export const SIMULATE_DRIVER_RIDE_TO_CLIENT =
  '[Maps] Simulate driver ride to client';

export const SET_RIDE_DRIVER = '[Maps] Set ride driver';

export const RIDE_STARTED_PASSENGER = '[Maps] Ride started';
export const LOAD_TIME_FROM_DRIVER_TO_CLIENT =
  '[Maps] Load time from driver to client';
export const SET_TIME_LEFT = '[Maps] Set time left';
export const SUBTRACT_TIME_LEFT = '[Maps] Subtract time left';

export const FINISH_RIDE_DRIVER = '[Maps] Finish ride';
export const LOAD_ACTIVE_ROUTE = '[Maps] Load active route';
export const SET_ACTIVE_RIDE_AND_DRIVER = '[Maps] Set active ride and driver'

export const REJECT_RIDE_DRIVER = '[Maps] Reject ride driver';

export const SIMULATE_DRIVER_RIDE_TO_CLIENT_END =
  '[Maps] End of driver ride to client simulation';

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

export class LoadAvailableRoutesForTwoPoints implements Action {
  readonly type = LOAD_AVAILABLE_ROUTES_FOR_TWO_POINTS;
  constructor(
    public payload: {
      coordinates: [longitude: number, latitude: number][];
      destinationId: string;
    }
  ) {}
}

export class SetSelectedRouteCoordinates implements Action {
  readonly type = SET_SELECTED_ROUTE_COORDINATES;
  constructor(
    public payload: {
      key: string;
      route: Route;
    }
  ) {}
}

export class RemoveCoordinatesForDestination implements Action {
  readonly type = REMOVE_COORDINATES_FOR_DESTINATION;
  constructor(
    public payload: {
      key: string;
    }
  ) {}
}

export class SetAvailableRoutesCoordinates implements Action {
  readonly type = SET_AVAILABLE_ROUTES_COORDINATES;
  constructor(
    public payload: {
      id: string;
      routes: Route[];
    }
  ) {}
}

export class SearchForDriver implements Action {
  readonly type = SEARCH_FOR_DRIVER;

  constructor(
    public payload: {
      clientLocation: Location;
      route: [longitude: number, latitude: number, stop:boolean][];
      locationNames: string[];
      vehicleTypes: string[];
      petFriendly: boolean;
      babyFriendly: boolean;
      sender: string;
      linkedUsers: string[];
    }
  ) {}
}

export class StartRideDriver implements Action {
  readonly type = START_RIDE_DRIVER;

  constructor() {}
}

export class ResetStateAfterRideFinish implements Action {
  readonly type = RESET_STATE_AFTER_RIDE_FINISH;

  constructor() {}
}

export class SetRideStatus implements Action {
  readonly type = SET_RIDE_STATUS;

  constructor(public payload: RideStatus) {}
}

export class ClearDestinationAutocompleteResults implements Action {
  readonly type = CLEAR_DESTINATION_AUTOCOMPLETE_RESULTS;

  constructor() {}
}

export class SimulateDriverRideToClient implements Action {
  readonly type = SIMULATE_DRIVER_RIDE_TO_CLIENT;

  constructor() {}
}

export class SimulateDriverRideToClientEnd implements Action {
  readonly type = SIMULATE_DRIVER_RIDE_TO_CLIENT_END;

  constructor(public payload: { simulationResult: number }) {}
}

export class SetRideDriver implements Action {
  readonly type = SET_RIDE_DRIVER;

  constructor(
    public payload: { driver: Driver; rideStatus: RideStatus }
  ) {}
}

export class RideStartedPassenger implements Action {
  readonly type = RIDE_STARTED_PASSENGER;

  constructor() {}
}

export class FinishRide implements Action {
  readonly type = FINISH_RIDE_DRIVER;

  constructor() {}
}
export class LoadTimeFromDriverToClient implements Action {
  readonly type = LOAD_TIME_FROM_DRIVER_TO_CLIENT;
  constructor(
    public payload: {
      coordinates: [longitude: number, latitude: number][];
    }
  ) {}
}

export class SetTimeLeft implements Action {
  readonly type = SET_TIME_LEFT;
  constructor(public payload: { timeLeft: number }) {}
}

export class SubtractTimeLeft implements Action {
  readonly type = SUBTRACT_TIME_LEFT;
  constructor(public payload: { value: number }) {}
}

export class LoadActiveRoute implements Action{
  readonly type = LOAD_ACTIVE_ROUTE;
  constructor() {}
}

export class SetActiveRideAndDriver implements Action{
  readonly type = SET_ACTIVE_RIDE_AND_DRIVER;
  constructor(public payload: {rideRouteInfo: RideRouteResponse}) {}

}


export class RejectRideDriver implements Action {
  readonly type = REJECT_RIDE_DRIVER;
  constructor(public payload: { rejectReason: string }) {}
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
  | LoadAvailableRoutesForTwoPoints
  | SetSelectedRouteCoordinates
  | SearchForDriver
  | StartRideDriver
  | ResetStateAfterRideFinish
  | SetRideStatus
  | ClearDestinationAutocompleteResults
  | SetAvailableRoutesCoordinates
  | RemoveCoordinatesForDestination
  | SimulateDriverRideToClient
  | SetRideDriver
  | FinishRide
  | LoadTimeFromDriverToClient
  | SetTimeLeft
  | SubtractTimeLeft
  | LoadActiveRoute
  | SetActiveRideAndDriver
  | RejectRideDriver;
