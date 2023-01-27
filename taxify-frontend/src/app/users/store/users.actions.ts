import { Action } from '@ngrx/store';
import { User } from '../../shared/model/user.model';
import { PaymentMethod } from '../../shared/model/payment-method.model';

export const GET_LOGGED_USER = '[Users] Get logged user';
export const SET_LOGGED_USER = '[Users] Set logged user';
export const GETTING_LOGGED_USER_FAILED = '[Users] Failed to get logged user';
export const GET_LOGGED_USER_PROFILE_PICTURE =
  "[Users] Get logged user's profile picture";
export const SET_LOGGED_USER_PROFILE_PICTURE =
  "[Users] Set logged user's profile picture";
export const UPLOAD_LOGGED_USER_PROFILE_PICTURE =
  "[Users] Upload logged user's profile picture";
export const UPLOAD_LOGGED_USER_PROFILE_PICTURE_SUCCESS =
  "[Users] Upload logged user's profile picture successful";
export const SAVE_LOGGED_USER_CHANGES = '[Users] Save logged user changes';
export const SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE =
  '[Users] Save logged user profile picture change';
export const SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE_SUCCESS =
  '[Users] Save logged user profile picture change successful';
export const SAVE_LOGGED_USER_PASSWORD_CHANGE =
  '[Users] Save logged user password change';
export const SAVE_LOGGED_USER_PASSWORD_CHANGE_SUCCESS =
  '[Users] Save logged user password change successful';
export const GET_LOGGED_PASSENGER_PAYMENT_METHODS =
  "[Users] Get logged passenger's payment methods";
export const ADD_LOGGED_PASSENGER_PAYMENT_METHOD =
  "[Users] Add logged passenger's payment method";
export const ADD_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS =
  "[Users] Added logged passenger's payment method successfully";
export const REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD =
  "[Users] Remove logged passenger's payment method";
export const REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS =
  "[Users] Removed logged passenger's payment method successfully";
export const SET_LOGGED_PASSENGER_PAYMENT_METHODS =
  "[Users] Set logged passenger's payment methods";

export class GetLoggedUser implements Action {
  readonly type = GET_LOGGED_USER;
}

export class SetLoggedUser implements Action {
  readonly type = SET_LOGGED_USER;

  constructor(public payload: User) {}
}

export class GetLoggedUserProfilePicture implements Action {
  readonly type = GET_LOGGED_USER_PROFILE_PICTURE;
}

export class SetLoggedUserProfilePicture implements Action {
  readonly type = SET_LOGGED_USER_PROFILE_PICTURE;

  constructor(public payload: Blob) {}
}

export class GettingLoggedUserFailed implements Action {
  readonly type = GETTING_LOGGED_USER_FAILED;

  constructor(public payload: any) {}
}

export class UploadLoggedUserProfilePicture implements Action {
  readonly type = UPLOAD_LOGGED_USER_PROFILE_PICTURE;

  constructor(public payload: Blob) {}
}

export class UploadLoggedUserProfilePictureSuccess implements Action {
  readonly type = UPLOAD_LOGGED_USER_PROFILE_PICTURE_SUCCESS;

  constructor(public payload: string) {}
}

export class SaveLoggedUserChanges implements Action {
  readonly type = SAVE_LOGGED_USER_CHANGES;

  constructor(
    public payload: {
      name: string;
      surname: string;
      phoneNumber: string;
      city: string;
      profilePicture: Blob;
    }
  ) {}
}

export class SaveLoggedUserProfilePictureChange implements Action {
  readonly type = SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE;

  constructor(public payload: string) {}
}

export class SaveLoggedUserProfilePictureChangeSuccess implements Action {
  readonly type = SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE_SUCCESS;
}

export class SaveLoggedUserPasswordChange implements Action {
  readonly type = SAVE_LOGGED_USER_PASSWORD_CHANGE;

  constructor(public payload: string) {}
}

export class SaveLoggedUserPasswordChangeSuccess implements Action {
  readonly type = SAVE_LOGGED_USER_PASSWORD_CHANGE_SUCCESS;
}

export class GetLoggedPassengerPaymentMethods implements Action {
  readonly type = GET_LOGGED_PASSENGER_PAYMENT_METHODS;
}

export class AddLoggedPassengerPaymentMethod implements Action {
  readonly type = ADD_LOGGED_PASSENGER_PAYMENT_METHOD;

  constructor(
    public payload: {
      cvc: string;
      expMonth: number;
      expYear: number;
      number: string;
    }
  ) {}
}

export class AddLoggedPassengerPaymentMethodSuccess implements Action {
  readonly type = ADD_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS;
}

export class RemoveLoggedPassengerPaymentMethod implements Action {
  readonly type = REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD;

  constructor(public payload: string) {}
}

export class RemoveLoggedPassengerPaymentMethodSuccess implements Action {
  readonly type = REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS;
}

export class SetLoggedPassengerPaymentMethods implements Action {
  readonly type = SET_LOGGED_PASSENGER_PAYMENT_METHODS;

  constructor(public payload: PaymentMethod[]) {}
}

export type UsersActions =
  | GetLoggedUser
  | SetLoggedUser
  | GetLoggedUserProfilePicture
  | SetLoggedUserProfilePicture
  | GettingLoggedUserFailed
  | UploadLoggedUserProfilePicture
  | UploadLoggedUserProfilePictureSuccess
  | SaveLoggedUserChanges
  | SaveLoggedUserProfilePictureChange
  | SaveLoggedUserProfilePictureChangeSuccess
  | SaveLoggedUserPasswordChange
  | SaveLoggedUserPasswordChangeSuccess
  | GetLoggedPassengerPaymentMethods
  | AddLoggedPassengerPaymentMethod
  | AddLoggedPassengerPaymentMethodSuccess
  | RemoveLoggedPassengerPaymentMethod
  | RemoveLoggedPassengerPaymentMethodSuccess
  | SetLoggedPassengerPaymentMethods;
