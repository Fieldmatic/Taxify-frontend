import { ActionReducerMap } from '@ngrx/store';
import * as fromMaps from '../maps/store/maps.reducer';
import * as fromDrivers from '../drivers/store/drivers.reducer';
import * as fromUsers from '../users/store/users.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromCustomerSupport from '../customer-support/store/customer-support.reducer';
import * as fromPassengers from '../passengers/store/passengers.reducer';

export interface AppState {
  auth: fromAuth.State;
  maps: fromMaps.State;
  users: fromUsers.State;
  drivers: fromDrivers.State;
  customerSupport: fromCustomerSupport.State;
  passengers: fromPassengers.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  maps: fromMaps.mapsReducer,
  users: fromUsers.usersReducer,
  drivers: fromDrivers.driversReducer,
  customerSupport: fromCustomerSupport.customerSupportReducer,
  passengers: fromPassengers.passengersReducer,
};
