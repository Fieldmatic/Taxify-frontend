import { MapData } from '../mapData.model';
import * as MapUtils from '../mapUtils';
import * as MapsActions from './maps.actions';

export interface State {
  mapData: MapData;
  loading: boolean;
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
    default:
      return state;
  }
}
