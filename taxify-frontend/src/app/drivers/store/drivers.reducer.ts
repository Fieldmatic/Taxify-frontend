import { DriverState } from 'src/app/drivers/model/driverState';
import { Ride } from 'src/app/shared/ride.model';
import { Driver } from '../../shared/driver.model';
import * as DriversActions from './drivers.actions';

export interface State {
  drivers: Driver[];
  error: number;
  driver: Driver;
  driverState: DriverState;
  assignedRide: Ride;
}

const initialState: State = {
  drivers: [],
  error: null,
  driver: null,
  driverState: DriverState.PENDING,
  assignedRide: null
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
    case DriversActions.SET_DRIVER:
      return {
        ...state,
        driver: action.payload,
        error: null,
      };
    case DriversActions.SET_DRIVER_REMAINING_WORK_TIME:
      return {
        ...state,
        error: null,
        driver: {
          ...state.driver,
          remainingWorkTime: action.payload.remainingTime,
        },
      };
    case DriversActions.SET_DRIVER_STATE:
      return {
        ...state,
        driverState: action.payload.state
      }
    case DriversActions.SET_ASSIGNED_RIDE_TO_DRIVER:
      return {
        ...state,
        assignedRide: action.payload.ride,
        driverState: action.payload.state
      }
    default:
      return state;
  }
}
