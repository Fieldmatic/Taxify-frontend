import { Notification } from './../model/notification';
import * as PassengerActions from '../store/passengers.actions';

export interface State {
  notifications: Notification[];
  error: string;
}

const initialState: State = {
  notifications: [],
  error: null,
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
    default:
      return state;
  }
}
