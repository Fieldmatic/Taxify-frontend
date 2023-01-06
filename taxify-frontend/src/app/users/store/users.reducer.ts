import { User } from '../../shared/user.model';
import * as UsersActions from './users.actions';

export interface State {
  loggedUser: User;
  error: number;
  loading: boolean;
}

const initialState: State = {
  loggedUser: null,
  error: null,
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
        error: null,
        loading: false,
      };
    case UsersActions.GETTING_LOGGED_USER_FAILED:
      return {
        ...state,
        error: action.payload,
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
    default:
      return state;
  }
}
