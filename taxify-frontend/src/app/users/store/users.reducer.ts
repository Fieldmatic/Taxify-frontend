import { User } from '../../shared/model/user.model';
import * as UsersActions from './users.actions';
import { PaymentMethod } from '../../shared/model/payment-method.model';

export interface State {
  loggedUser: User;
  loggedUserProfilePicture: Blob;
  loggedUserPaymentMethods: PaymentMethod[];
  loading: boolean;
}

const initialState: State = {
  loggedUser: null,
  loggedUserProfilePicture: null,
  loggedUserPaymentMethods: [],
  loading: true,
};

export function usersReducer(
  state = initialState,
  action: UsersActions.UsersActions
) {
  switch (action.type) {
    case UsersActions.SET_LOGGED_USER:
      return {
        ...state,
        loggedUser: action.payload,
      };
    case UsersActions.GETTING_LOGGED_USER_FAILED:
      return {
        ...state,
        loading: false,
      };
    case UsersActions.SAVE_LOGGED_USER_CHANGES:
      return {
        ...state,
        loading: true,
      };
    case UsersActions.GET_LOGGED_USER:
      return {
        ...state,
        loading: true,
      };
    case UsersActions.SET_LOGGED_USER_PROFILE_PICTURE:
      return {
        ...state,
        loggedUserProfilePicture: action.payload,
        loading: false,
      };
    case UsersActions.SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UsersActions.SAVE_LOGGED_USER_PASSWORD_CHANGE:
      return {
        ...state,
        loading: true,
      };
    case UsersActions.SAVE_LOGGED_USER_PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UsersActions.GET_LOGGED_PASSENGER_PAYMENT_METHODS:
      return {
        ...state,
        loading: true,
      };
    case UsersActions.SET_LOGGED_PASSENGER_PAYMENT_METHODS:
      return {
        ...state,
        loggedUserPaymentMethods: action.payload,
        loading: false,
      };
    case UsersActions.ADD_LOGGED_PASSENGER_PAYMENT_METHOD:
      return {
        ...state,
        loading: true,
      };
    case UsersActions.REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
