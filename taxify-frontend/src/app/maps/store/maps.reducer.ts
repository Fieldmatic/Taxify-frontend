import { MapData } from '../model/mapData.model';
import * as MapUtils from '../mapUtils';
import * as MapsActions from './maps.actions';
import { Driver } from '../../shared/driver.model';
import { Location } from '../model/location';
import { PassengerState } from '../model/passengerState';
import { SET_SELECTED_ROUTE_COORDINATES } from './maps.actions';
import { act } from '@ngrx/effects';

export interface State {
  mapData: MapData;
  pickupLocations: Location[];
  destinations: Location[];
  loading: boolean;
  chosenDriverInfo: Driver;
  rideDriver: Driver;
  selectedRoute: Map<string, [longitude: number, latitude: number][]>;
  availableRoutes: Map<string, [longitude: number, latitude: number][][]>;
  passengerState: PassengerState;
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
    selectedRoute: new Map<string, [longitude: number, latitude: number][]>(),
    availableRoutes: new Map<
      string,
      [longitude: number, latitude: number][][]
    >(),
    passengerState: PassengerState.FORM_FILL,
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
    case MapsActions.START_RIDE:
      return {
        ...state,
        rideDriver: action.payload.driver,
        passengerState: PassengerState.RIDING,
      };
    case MapsActions.RIDE_FINISH: {
      return {
        ...state,
        passengerState: PassengerState.RIDE_FINISH,
        loading: false,
        chosenDriverInfo: null,
        rideDriver: null,
        pickupLocations: null,
        destinations: null,
        availableRoutes: new Map<
          string,
          [longitude: number, latitude: number][][]
        >(),
        selectedRoute: new Map<
          string,
          [longitude: number, latitude: number][]
        >(),
      };
    }
    case MapsActions.SET_PASSENGER_STATE_FORM_FILL: {
      return {
        ...state,
        passengerState: PassengerState.FORM_FILL,
      };
    }
    case MapsActions.CLEAR_DESTINATION_AUTOCOMPLETE_RESULTS: {
      return { ...state, destinations: null };
    }
    case MapsActions.SET_AVAILABLE_ROUTES_COORDINATES: {
      let availableRoutes = new Map<
        string,
        [longitude: number, latitude: number][][]
      >(state.availableRoutes);
      availableRoutes.set(action.payload.id, action.payload.routes);
      return {
        ...state,
        availableRoutes: availableRoutes,
      };
    }
    case MapsActions.SET_SELECTED_ROUTE_COORDINATES: {
      let selectedRoutes = new Map<
        string,
        [longitude: number, latitude: number][]
      >(state.selectedRoute);
      selectedRoutes.set(action.payload.key, action.payload.route);
      return { ...state, selectedRoute: selectedRoutes };
    }
    case MapsActions.REMOVE_COORDINATES_FOR_DESTINATION: {
      let availableRoutes = new Map<
        string,
        [longitude: number, latitude: number][][]
      >(state.availableRoutes);
      let selectedRoutes = new Map<
        string,
        [longitude: number, latitude: number][]
      >(state.selectedRoute);
      selectedRoutes.delete(action.payload.key);
      availableRoutes.delete(action.payload.key);
      return {
        ...state,
        selectedRoute: selectedRoutes,
        availableRoutes: availableRoutes,
      };
    }
    default:
      return state;
  }
}
