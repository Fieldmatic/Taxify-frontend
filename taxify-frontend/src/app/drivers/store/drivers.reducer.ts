import { Driver } from '../../shared/model/driver.model';
import { DriverState } from 'src/app/drivers/model/driverState';
import { RideHistoryResponse } from 'src/app/passengers/model/rideHistoryResponse';
import { Ride } from 'src/app/shared/ride.model';
import * as DriversActions from './drivers.actions';

export interface State {
  drivers: Driver[];
  error: number;
  driver: Driver;
  driverState: DriverState;
  assignedRide: Ride;
  rideHistory: RideHistoryResponse[]
}

const initialState: State = {
  drivers: [],
  error: null,
  driver: null,
  driverState: DriverState.PENDING,
  assignedRide: null,
  rideHistory: []
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
        driverState: action.payload.state,
      };
    case DriversActions.SET_ASSIGNED_RIDE_TO_DRIVER:
      return {
        ...state,
        assignedRide: action.payload.ride,
      };
    case DriversActions.SET_DRIVER_RIDE_HISTORY:
      return {
        ...state,
        rideHistory: action.payload.rides
      }
    default:
      return state;
  }
}
