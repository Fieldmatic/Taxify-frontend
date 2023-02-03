import { Route } from '../../maps/model/route'
import { Driver } from 'src/app/shared/model/driver.model';
import { Notification } from 'src/app/shared/model/notification';
import { RideHistoryResponse} from '../../shared/model/rideHistoryResponse'
import * as PassengerActions from '../store/passengers.actions';

export interface State {
  notifications: Notification[];
  error: string;
  rideHistory: RideHistoryResponse[];
  rideDetailsMapLoading: boolean;
  rideDetailsDriver: Driver;
  rideDetailsRoute: Map<string, Route>;
  distance: number;
}

const initialState: State = {
  notifications: [],
  error: null,
  rideHistory:[],
  rideDetailsMapLoading: false,
  rideDetailsDriver: null,
  rideDetailsRoute: new Map<string, Route>(),
  distance: null
};

export function passengersReducer(
  state = initialState,
  action: PassengerActions.PassengerActions
) {
  switch (action.type) {
    case PassengerActions.SET_PASSENGER_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        error: null,
      };
    case PassengerActions.SET_PASSENGER_NOTIFICATION:
      let notification = state.notifications.find(
        (item) => item.id === action.payload.id
      );
      let index = state.notifications.indexOf(notification);
      const notificationsCopy = [];
      state.notifications.forEach((notif) =>
        notificationsCopy.push(Object.assign({}, notif))
      );
      notificationsCopy[index] = action.payload;
      return {
        ...state,
        notifications: notificationsCopy,
        error: null,
      };
    case PassengerActions.SET_PASSENGER_RIDE_HISTORY:
      return {
        ...state,
        rideHistory: action.payload.rides,
      }
    case PassengerActions.SET_SELECTED_ROUTE_DETAILS:
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
        distance: action.payload.rideRouteInfo.distance
      };
    default:
      return state;
  }
}
