import { MapData } from '../model/mapData.model';
import * as MapUtils from '../mapUtils';
import * as MapsActions from './maps.actions';
import { Driver } from '../../shared/model/driver.model';
import { Location } from '../model/location';

export interface State {
  mapData: MapData;
  pickupLocations: Location[];
  destinations: Location[];
  loading: boolean;
  driver: Driver;
  route: [longitude: number, latitude: number][];
}

const createInitialState = function (): State {
  let mapCenter = [19.839388, 45.247744];
  return {
    mapData: MapUtils.getMapData(MapUtils.creatInitialMap(mapCenter)),
    loading: false,
    driver: null,
    pickupLocations: null,
    destinations: null,
    route: [],
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
        driver: action.payload,
      };
    case MapsActions.POPUP_CLOSE:
      return {
        ...state,
        driver: null,
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
    default:
      return state;
  }
}
