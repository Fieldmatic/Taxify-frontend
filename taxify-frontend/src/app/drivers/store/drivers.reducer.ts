import { Driver } from '../../shared/model/driver.model';
import * as DriversActions from './drivers.actions';

export interface State {
  drivers: Driver[];
  error: number;
}

const initialState: State = {
  drivers: [],
  error: null,
};

export function driversReducer(
  state = initialState,
  action: DriversActions.DriversActions
) {
  switch (action.type) {
    case DriversActions.SET_DRIVERS:
      return {
        ...state,
        drivers: action.payload,
        error: null,
      };
    case DriversActions.FETCH_DRIVERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
