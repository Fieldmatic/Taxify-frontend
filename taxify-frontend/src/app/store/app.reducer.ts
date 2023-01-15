import { ActionReducerMap } from '@ngrx/store';
import * as fromMaps from '../maps/store/maps.reducer';
import * as fromDrivers from '../drivers/store/drivers.reducer';
import * as fromUsers from '../users/store/users.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
  auth: fromAuth.State;
  maps: fromMaps.State;
  users: fromUsers.State;
  drivers: fromDrivers.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  maps: fromMaps.mapsReducer,
  users: fromUsers.usersReducer,
  drivers: fromDrivers.driversReducer,
};
