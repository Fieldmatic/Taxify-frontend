import * as AuthActions from './auth.actions';
import { LoggedInUser } from '../model/logged-in-user';

export interface State {
  user: LoggedInUser;
  authError: string;
  loading: boolean;
  authenticationConfirmed: boolean;
  authenticationConfirmError: string;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
  authenticationConfirmed: false,
  authenticationConfirmError: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN_SUCCESS:
      const user = new LoggedInUser(
        action.payload.email,
        action.payload.role,
        action.payload.token,
        action.payload.tokenExpirationDate
      );
      return {
        ...state,
        authError: null,
        user,
        loading: false,
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
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
    default:
      return state;
  }
}
