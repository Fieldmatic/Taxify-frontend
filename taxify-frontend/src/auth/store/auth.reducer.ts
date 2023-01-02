import * as AuthActions from './auth.actions';
import { LoggedInUser } from '../model/logged-in-user';

export interface State {
  user: LoggedInUser;
}

const initialState = {
  user: null,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const user = new LoggedInUser(
        action.payload.email,
        action.payload.role,
        action.payload.token,
        action.payload.tokenExpirationDate
      );
      return {
        ...state,
        user,
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
