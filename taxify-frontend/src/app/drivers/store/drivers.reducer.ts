import { Driver } from '../../shared/model/driver.model';
import { DriverState } from 'src/app/drivers/model/driverState';

import * as DriversActions from './drivers.actions';
import { Ride } from 'src/app/shared/model/ride.model';
import { RideHistoryResponse } from 'src/app/shared/model/rideHistoryResponse';
import { Route } from 'src/app/maps/model/route';

export interface State {
  drivers: Driver[];
  error: number;
  driver: Driver;
  driverState: DriverState;
  assignedRide: Ride;
  rideHistory: RideHistoryResponse[]
  rideDetailsMapLoading: boolean;
  rideDetailsDriver: Driver;
  rideDetailsRoute: Map<string, Route>;
}

const initialState: State = {
  drivers: [],
  error: null,
  driver: null,
  driverState: DriverState.PENDING,
  assignedRide: null,
  rideHistory: [],
  rideDetailsMapLoading: false,
  rideDetailsDriver: null,
  rideDetailsRoute: new Map<string, Route>(),
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
    case DriversActions.SET_SELECTED_ROUTE_DETAILS:
      let route: Map<string, Route> = new Map<string, Route>();
      for (let key in action.payload.rideRouteInfo.route) {
        let routeArray : [longitude: number, latitude: number, stop: boolean][] = []
        for (let index in action.payload.rideRouteInfo.route[key]) {
          routeArray.push([action.payload.rideRouteInfo.route[key][index]['longitude'],action.payload.rideRouteInfo.route[key][index]['latitude'], action.payload.rideRouteInfo.route[key][index]['stop']])
        }
        route.set(key,new Route(routeArray))
      }  
      return {
        ...state,
        rideDetailsDriver: action.payload.rideRouteInfo.driver,
        rideDetailsRoute: route,
      };
    default:
      return state;
  }
}
