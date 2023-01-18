import { MapData } from '../model/mapData.model';
import * as MapUtils from '../mapUtils';
import * as MapsActions from './maps.actions';
import { Driver } from '../../shared/driver.model';
import { Location } from '../model/location';
import { PassengerState } from '../model/passengerState';

export interface State {
  mapData: MapData;
  pickupLocations: Location[];
  destinations: Location[];
  loading: boolean;
  chosenDriverInfo: Driver;
  rideDriver: Driver;
  route: [longitude: number, latitude: number][];
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
    route: [],
    passengerState: PassengerState.FORM_FILL,
  };
};

export function mapsReducer(
  state = createInitialState(),
  action: MapsActions.MapsActions
) {
  switch (action.type) {
    case MapsActions.SET_DIRECTION_COORDINATES:
      return {
        ...state,
        route: action.payload.coordinates,
      };
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
        route: [],
      };
    }
    case MapsActions.SET_PASSENGER_STATE_FORM_FILL: {
      return {
        ...state,
        passengerState: PassengerState.FORM_FILL,
      };
    }
    default:
      return state;
  }
}
