import { ActionReducerMap } from '@ngrx/store';
import * as fromMaps from '../maps/store/maps.reducer';
import * as fromDrivers from '../drivers/store/drivers.reducer';
import * as fromAuth from '../../auth/store/auth.reducer';

export interface AppState {
  auth: fromAuth.State;
  maps: fromMaps.State;
  drivers: fromDrivers.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  maps: fromMaps.mapsReducer,
  drivers: fromDrivers.driversReducer
}

