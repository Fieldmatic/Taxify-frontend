import { Vehicle } from '../../shared/vehicle.model';
import { MapData } from '../mapData.model';
import * as MapUtils from '../mapUtils';
import * as VehiclesActions from './vehicles.actions';

export interface State {
  mapData: MapData;
  loading: boolean;
  vehicles: Vehicle[];
  error: number;
}

const createInitialState = function (): State {
  let mapCenter = [19.83706, 45.25185];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      mapCenter = [longitude, latitude];
    });
  }

  return {
    mapData: MapUtils.getMapData(MapUtils.creatInitialMap(mapCenter)),
    loading: false,
    vehicles: [],
    error: null,
  };
};

export function vehiclesReducer(
  state = createInitialState(),
  action: VehiclesActions.VehiclesActions
) {
  switch (action.type) {
    case VehiclesActions.SET_VEHICLES:
      return {
        ...state,
        error: null,
        vehicles: [...action.payload],
      };
    case VehiclesActions.FETCH_VEHICLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case VehiclesActions.MAP_LOAD_START:
      return {
        ...state,
        loading: true,
      };
    case VehiclesActions.MAP_LOAD_END:
      return {
        ...state,
        loading: false,
        mapData: action.payload,
      };
    default:
      return state;
  }
}
