import { ActionReducerMap } from '@ngrx/store';
import * as fromVehicles from '../vehicles/store/vehicles.reducer';

export interface AppState {
  vehicles: fromVehicles.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  vehicles: fromVehicles.vehiclesReducer,
};
