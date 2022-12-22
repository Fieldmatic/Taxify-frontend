import { ActionReducerMap } from '@ngrx/store';
import * as fromMaps from '../maps/store/maps.reducer';
import * as fromDrivers from '../drivers/store/drivers.reducer';

export interface AppState {
  maps: fromMaps.State;
  drivers: fromDrivers.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  maps: fromMaps.mapsReducer,
  drivers: fromDrivers.driversReducer,
};
