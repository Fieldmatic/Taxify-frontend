import { Action } from '@ngrx/store';
import { GoogleSignUpRequest } from '../model/google-signup-request';
import { LoggedInUser } from '../model/logged-in-user';
import { FacebookSignupRequest } from '../model/facebook-signup-request';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const SIGNUP_START = '[Auth] Singup Start';
export const SIGNUP_SUCCESS = '[Auth] Singup Success';
export const EMAIL_ACTIVATION = '[Auth] Email Activation';

export const GOOGLE_SIGNUP = '[Auth] Google SignUp';
export const FACEBOOK_SIGNUP = '[Auth] Facebook SignUp';
export const LOGIN_WITH_GOOGLE = '[Auth] Login With Google';
export const USER_SIGNED_WITH_GOOGLE_EXISTS =
  '[Auth] User Signed With Google Exists';
export const CHANGE_USER_EXISTS_STATE = '[Auth] Change User exists';
export const USER_EXISTS_BY_EMAIL = '[Auth] User exists by email';

export const REAUTHENTICATE = '[Users] Reauthenticate';
export const REAUTHENTICATE_SUCCESS =
  '[Users] Authentication confirmed successful';
export const REAUTHENTICATE_FAIL = '[Users] Authentication not confirmed';

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public user: LoggedInUser) {}
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

export class GoogleSignup implements Action {
  readonly type = GOOGLE_SIGNUP;

  constructor(public request: GoogleSignUpRequest) {}
}

export class FacebookSignup implements Action {
  readonly type = FACEBOOK_SIGNUP;
  constructor(
    public payload: { facebookSignUpRequest: FacebookSignupRequest }
  ) {}
}

export class LoginWithGoogle implements Action {
  readonly type = LOGIN_WITH_GOOGLE;
  constructor(public credential: string) {}
}

export class UserSignedWithGoogleExists implements Action {
  readonly type = USER_SIGNED_WITH_GOOGLE_EXISTS;
  constructor(public payload: { credential: string }) {}
}

export class UserExistsByEmail implements Action {
  readonly type = USER_EXISTS_BY_EMAIL;
  constructor(public payload: { email: string }) {}
}

export class ChangeUserExistsState implements Action {
  readonly type = CHANGE_USER_EXISTS_STATE;
  constructor(public payload: { userExists: boolean }) {}
}

export class Reauthenticate implements Action {
  readonly type = REAUTHENTICATE;

  constructor(public payload: string) {}
}

export class ReauthenticateSuccess implements Action {
  readonly type = REAUTHENTICATE_SUCCESS;
}

export class ReauthenticateFail implements Action {
  readonly type = REAUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export type AuthActions =
  | LoginSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | SignupStart
  | SignupSuccess
  | AutoLogin
  | EmailActivation
  | GoogleSignup
  | LoginWithGoogle
  | UserSignedWithGoogleExists
  | ChangeUserExistsState
  | UserExistsByEmail
  | FacebookSignup
  | Reauthenticate
  | ReauthenticateSuccess
  | ReauthenticateFail;
