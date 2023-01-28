import { User } from '../../shared/model/user.model';
import * as UsersActions from './users.actions';
import { PaymentMethod } from '../../shared/model/payment-method.model';

export interface State {
  loggedUser: User;
  loggedUserProfilePicture: Blob;
  loggedUserPaymentMethods: PaymentMethod[];
  users: User[];
  loading: boolean;
}

const initialState: State = {
  loggedUser: null,
  loggedUserProfilePicture: null,
  loggedUserPaymentMethods: [],
  users: [],
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
    case UsersActions.GET_ALL_USERS:
      return {
        ...state,
        loading: true,
      };
    case UsersActions.GETTING_ALL_USERS_FAILED:
      return {
        ...state,
        loading: false,
      };
    case UsersActions.SET_ALL_USERS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case UsersActions.TOGGLE_USER_IS_BLOCKED_SUCCESS:
      const changedUser = action.payload;
      let users = [...state.users];
      const indexOfChangedUser = users.indexOf(
        users.find((user) => user.id === changedUser.id)
      );
      users[indexOfChangedUser] = changedUser;
      return {
        ...state,
        users,
      };
    default:
      return state;
  }
}
