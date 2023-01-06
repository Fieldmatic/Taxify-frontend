import { Action } from '@ngrx/store';
import { User } from '../../shared/user.model';

export const GET_LOGGED_USER = '[Users] Get logged user';
export const SET_LOGGED_USER = '[Users] Set logged user';
export const GETTING_LOGGED_USER_FAILED = '[Users] Failed to get logged user';
export const SAVE_LOGGED_USER_CHANGES = '[Users] Save logged user changes';

export class GetLoggedUser implements Action {
  readonly type = GET_LOGGED_USER;
}

export class SetLoggedUser implements Action {
  readonly type = SET_LOGGED_USER;

  constructor(public payload: User) {}
}

export class GettingLoggedUserFailed implements Action {
  readonly type = GETTING_LOGGED_USER_FAILED;

  constructor(public payload: number) {}
}

export class SaveLoggedUserChanges implements Action {
  readonly type = SAVE_LOGGED_USER_CHANGES;

  constructor(
    public payload: {
      name: string;
      surname: string;
      phoneNumber: string;
      city: string;
    }
  ) {}
}

export type UsersActions =
  | GetLoggedUser
  | SetLoggedUser
  | GettingLoggedUserFailed
  | SaveLoggedUserChanges;
