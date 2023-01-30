import { MapData } from '../model/mapData.model';
import * as MapUtils from '../mapUtils';
import * as MapsActions from './maps.actions';
import { Driver } from '../../shared/model/driver.model';
import { Location } from '../model/location';
import { PassengerState } from '../model/passengerState';
import { Route } from '../model/route';

export interface State {
  mapData: MapData;
  pickupLocations: Location[];
  destinations: Location[];
  loading: boolean;
  chosenDriverInfo: Driver;
  rideDriver: Driver;
  selectedRoute: Map<string, Route>;
  availableRoutes: Map<string, Route[]>;
  passengerState: PassengerState;
  timeLeft: number;
}

const createInitialState = function (): State {
  let mapCenter = [19.839388, 45.247744];
  return {
    mapData: MapUtils.getMapData(MapUtils.creatInitialMap(mapCenter)),
    loading: false,
    chosenDriverInfo: null,
    rideDriver: null,
    pickupLocations: null,
    destinations: null,
    selectedRoute: new Map<string, Route>(),
    availableRoutes: new Map<string, Route[]>(),
    passengerState: PassengerState.FORM_FILL,
    timeLeft: null,
  };
};

export function mapsReducer(
  state = createInitialState(),
  action: MapsActions.MapsActions
) {
  switch (action.type) {
    case MapsActions.MAP_LOAD_START:
      return {
        ...state,
        loading: true,
      };
    case MapsActions.MAP_LOAD_END:
      return {
        ...state,
        loading: false,
        mapData: action.payload,
      };
    case MapsActions.DRIVER_SELECTED:
      return {
        ...state,
        chosenDriverInfo: action.payload,
      };
    case MapsActions.POPUP_CLOSE:
      return {
        ...state,
        chosenDriverInfo: null,
      };
    case MapsActions.SET_PICKUP_LOCATION_AUTOCOMPLETE_RESULTS:
      return {
        ...state,
        pickupLocations: action.payload,
      };
    case MapsActions.SET_DESTINATION_AUTOCOMPLETE_RESULTS:
      return {
        ...state,
        destinations: action.payload,
      };
    case MapsActions.SEARCH_FOR_DRIVER:
      return {
        ...state,
        passengerState: PassengerState.SEARCHING_FOR_DRIVER,
      };
    case MapsActions.RIDE_FINISH_PASSENGER: {
      return {
        ...state,
        passengerState: PassengerState.RIDE_FINISH,
        loading: false,
        chosenDriverInfo: null,
        rideDriver: null,
        pickupLocations: null,
        destinations: null,
        availableRoutes: new Map<string, Route[]>(),
        selectedRoute: new Map<string, Route>(),
      };
    }
    case MapsActions.SET_PASSENGER_STATE: {
      return {
        ...state,
        passengerState: action.payload,
      };
    }
    case MapsActions.CLEAR_DESTINATION_AUTOCOMPLETE_RESULTS: {
      return { ...state, destinations: null };
    }
    case MapsActions.SET_AVAILABLE_ROUTES_COORDINATES: {
      let availableRoutes = new Map<string, Route[]>(state.availableRoutes);
      let selectedRoute = new Map<string, Route>(state.selectedRoute);
      if (
        !selectedRoute.has(action.payload.id) ||
        (selectedRoute.has(action.payload.id) &&
          availableRoutes.has(action.payload.id) &&
          availableRoutes.get(action.payload.id)[0].route[0][0] !==
            action.payload.routes[0].route[0][0])
      ) {
        selectedRoute.set(action.payload.id, action.payload.routes[0]);
      }
      availableRoutes.set(action.payload.id, action.payload.routes);
      return {
        ...state,
        availableRoutes: availableRoutes,
        selectedRoute: selectedRoute,
      };
    }
    case MapsActions.SET_SELECTED_ROUTE_COORDINATES: {
      let selectedRoutes = new Map<string, Route>(state.selectedRoute);
      selectedRoutes.set(action.payload.key, action.payload.route);
      return { ...state, selectedRoute: selectedRoutes };
    }
    case MapsActions.REMOVE_COORDINATES_FOR_DESTINATION: {
      let availableRoutes = new Map<string, Route[]>(state.availableRoutes);
      let selectedRoutes = new Map<string, Route>(state.selectedRoute);
      selectedRoutes.delete(action.payload.key);
      availableRoutes.delete(action.payload.key);
      return {
        ...state,
        selectedRoute: selectedRoutes,
        availableRoutes: availableRoutes,
      };
    }
    case MapsActions.SET_RIDE_DRIVER: {
      return {
        ...state,
        rideDriver: action.payload.driver,
        passengerState: action.payload.passengerState,
      };
    }
    case MapsActions.SET_TIME_LEFT: {
      return {
        ...state,
        timeLeft: action.payload.timeLeft,
      };
    }
    case MapsActions.SUBTRACT_TIME_LEFT: {
      let newTimeLeft = state.timeLeft - action.payload.value;
      return {
        ...state,
        timeLeft: newTimeLeft,
      };
    }
    default:
      return state;
  }
}
