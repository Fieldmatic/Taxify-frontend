import * as AuthActions from './auth.actions';
import { LoggedInUser } from '../model/logged-in-user';

export interface State {
  isLoginMode: boolean;
  user: LoggedInUser;
  loading: boolean;
  authenticationConfirmed: boolean;
  userExists: boolean;
}

const initialState: State = {
  isLoginMode: true,
  user: null,
  loading: false,
  authenticationConfirmed: false,
  userExists: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.CHANGE_AUTH_MODE:
      return {
        ...state,
        isLoginMode: action.payload,
      };
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        loading: false,
      };
    case AuthActions.LOGOUT_END:
      return {
        ...state,
        user: null,
      };
    case AuthActions.LOGIN_START:
      return {
        ...state,
        loading: true,
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        loading: false,
      };
    case AuthActions.REAUTHENTICATE_SUCCESS:
      return {
        ...state,
        authenticationConfirmed: true,
      };
    case AuthActions.REAUTHENTICATE_FAIL:
      return {
        ...state,
        authenticationConfirmed: false,
      };
    case AuthActions.CHANGE_USER_EXISTS_STATE:
      return {
        ...state,
        userExists: action.payload.userExists,
      };
    default:
      return state;
  }
}
