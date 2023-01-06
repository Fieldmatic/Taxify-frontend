import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const SIGNUP_START = '[Auth] Singup Start';
export const SIGNUP_SUCCESS = '[Auth] Singup Success';
export const EMAIL_ACTIVATION = '[Auth] Email Activation';

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(
    public payload: {
      email: string;
      role: string;
      token: string;
      tokenExpirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(
    public payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      city: string;
      phoneNumber: string;
      profilePicture: string;
    }
  ) {}
}

export class SignupSuccess implements Action {
  readonly type = SIGNUP_SUCCESS;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class EmailActivation implements Action {
  readonly type = EMAIL_ACTIVATION;

  constructor(public payload: { token: string }) {}
}

export type AuthActions =
  | LoginSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | SignupSuccess
  | AutoLogin
  | EmailActivation;
