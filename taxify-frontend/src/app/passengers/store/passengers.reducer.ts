import { Notification } from '../model/notification';
import { RideHistoryResponse } from '../model/rideHistoryResponse';
import * as PassengerActions from '../store/passengers.actions';

export interface State {
  notifications: Notification[];
  error: string;
  rideHistory: RideHistoryResponse[]
}

const initialState: State = {
  notifications: [],
  error: null,
  rideHistory:[]
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
        rideHistory: action.payload.rides
      }
    default:
      return state;
  }
}
