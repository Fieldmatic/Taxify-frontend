import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { User } from '../../shared/model/user.model';
import { APP_SERVICE_CONFIG } from '../../appConfig/appconfig.service';
import { AppConfig } from '../../appConfig/appconfig.interface';
import * as UsersActions from './users.actions';
import * as fromApp from '../../store/app.reducer';
import { NotifierService } from '../../shared/services/notifier.service';
import { PaymentMethod } from '../../shared/model/payment-method.model';
import { Router } from '@angular/router';

@Injectable()
export class UsersEffects {
  getLoggedUser = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.GET_LOGGED_USER),
      switchMap(() => {
        return this.http.get<User>(this.config.apiEndpoint + 'auth/self').pipe(
          map((user) => {
            return new UsersActions.SetLoggedUser(user);
          }),
          catchError((errorRes) => {
            return of(new UsersActions.GettingLoggedUserFailed(errorRes));
          })
        );
      })
    );
  });

  setLoggedUser = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.SET_LOGGED_USER),
      map(() => {
        return new UsersActions.GetLoggedUserProfilePicture();
      })
    );
  });

  getLoggedUserProfilePicture = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.GET_LOGGED_USER_PROFILE_PICTURE),
      withLatestFrom(this.store.select('users')),
      switchMap(([actionData, usersState]) => {
        const profilePicture = usersState.loggedUser.profilePicture;
        if (!profilePicture) {
          return of(new UsersActions.SetLoggedUserProfilePicture(null));
        } else {
          return this.http
            .get(this.config.apiEndpoint + 'picture/', {
              params: new HttpParams().append('fileName', profilePicture),
              responseType: 'blob',
            })
            .pipe(
              map((image) => {
                return new UsersActions.SetLoggedUserProfilePicture(image);
              }),
              catchError((errorRes) => {
                return of(new UsersActions.GettingLoggedUserFailed(errorRes));
              })
            );
        }
      })
    );
  });

  saveLoggedUserChanges = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.SAVE_LOGGED_USER_CHANGES),
      switchMap(
        (saveLoggedUserChangesAction: UsersActions.SaveLoggedUserChanges) => {
          return this.http
            .put<User>(this.config.apiEndpoint + 'auth/self', {
              name: saveLoggedUserChangesAction.payload.name,
              surname: saveLoggedUserChangesAction.payload.surname,
              city: saveLoggedUserChangesAction.payload.city,
              phoneNumber: saveLoggedUserChangesAction.payload.phoneNumber,
            })
            .pipe(
              map(() => {
                return new UsersActions.UploadLoggedUserProfilePicture(
                  saveLoggedUserChangesAction.payload.profilePicture
                );
              }),
              catchError((errorRes) => {
                return of(new UsersActions.GettingLoggedUserFailed(errorRes));
              })
            );
        }
      )
    );
  });

  uploadLoggedUserProfilePicture = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.UPLOAD_LOGGED_USER_PROFILE_PICTURE),
      switchMap(
        (
          uploadLoggedUserProfilePicture: UsersActions.UploadLoggedUserProfilePicture
        ) => {
          let formData = new FormData();
          formData.append('file', uploadLoggedUserProfilePicture.payload);
          return this.http
            .post(this.config.apiEndpoint + 'picture/', formData, {
              headers: new HttpHeaders().set(
                'Content-Type',
                'text/plain; charset=utf-8'
              ),
              responseType: 'text',
            })
            .pipe(
              map((profilePicture) => {
                return new UsersActions.UploadLoggedUserProfilePictureSuccess(
                  profilePicture
                );
              }),
              catchError((errorRes) => {
                return of(new UsersActions.GettingLoggedUserFailed(errorRes));
              })
            );
        }
      )
    );
  });

  uploadLoggedUserProfilePictureSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.UPLOAD_LOGGED_USER_PROFILE_PICTURE_SUCCESS),
      map((actionData: UsersActions.UploadLoggedUserProfilePictureSuccess) => {
        return new UsersActions.SaveLoggedUserProfilePictureChange(
          actionData.payload
        );
      })
    );
  });

  saveLoggedUserProfilePictureChange = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE),
      switchMap((action: UsersActions.SaveLoggedUserProfilePictureChange) => {
        return this.http
          .put(
            this.config.apiEndpoint + 'auth/self-picture',
            {},
            {
              params: new HttpParams().append('profilePicture', action.payload),
            }
          )
          .pipe(
            map(() => {
              return new UsersActions.SaveLoggedUserProfilePictureChangeSuccess();
            })
          );
      })
    );
  });

  saveLoggedUserProfilePictureChangeSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE_SUCCESS),
      map(() => {
        return new UsersActions.GetLoggedUser();
      })
    );
  });

  notifySuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          UsersActions.SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE_SUCCESS,
          UsersActions.SAVE_LOGGED_USER_PASSWORD_CHANGE_SUCCESS,
          UsersActions.ADD_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS,
          UsersActions.REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS,
          UsersActions.TOGGLE_USER_IS_BLOCKED_SUCCESS
        ),
        tap((action: UsersActions.UsersActions) => {
          switch (action.type) {
            case UsersActions.SAVE_LOGGED_USER_PROFILE_PICTURE_CHANGE_SUCCESS:
              this.notifierService.notifySuccess(
                'Profile picture changed successfully'
              );
              break;
            case UsersActions.SAVE_LOGGED_USER_PASSWORD_CHANGE_SUCCESS:
              this.notifierService.notifySuccess(
                'Password changed successfully'
              );
              break;
            case UsersActions.ADD_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS:
              this.notifierService.notifySuccess(
                'Successfully added a new payment method'
              );
              break;
            case UsersActions.REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS:
              this.notifierService.notifySuccess(
                'Successfully removed a payment method'
              );
              break;
            case UsersActions.TOGGLE_USER_IS_BLOCKED_SUCCESS:
              this.notifierService.notifySuccess(
                "Successfully toggled user's block status"
              );
              break;
            default:
              break;
          }
        })
      );
    },
    { dispatch: false }
  );

  saveLoggedUserPasswordChange = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.SAVE_LOGGED_USER_PASSWORD_CHANGE),
      switchMap((action: UsersActions.SaveLoggedUserPasswordChange) => {
        return this.http
          .put<User>(
            this.config.apiEndpoint + 'auth/self-password',
            {},
            {
              params: new HttpParams().append('newPassword', action.payload),
            }
          )
          .pipe(
            map(() => {
              return new UsersActions.SaveLoggedUserPasswordChangeSuccess();
            }),
            catchError((errorRes) => {
              return of(new UsersActions.GettingLoggedUserFailed(errorRes));
            })
          );
      })
    );
  });

  notifyFail = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          UsersActions.GETTING_LOGGED_USER_FAILED,
          UsersActions.GETTING_ALL_USERS_FAILED,
          UsersActions.TOGGLE_USER_IS_BLOCKED_FAILED
        ),
        tap(
          (
            action:
              | UsersActions.GettingLoggedUserFailed
              | UsersActions.GettingAllUsersFailed
          ) => {
            this.notifierService.notifyError(action.payload);
          }
        )
      );
    },
    { dispatch: false }
  );

  getLoggedPassengerPaymentMethods = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.GET_LOGGED_PASSENGER_PAYMENT_METHODS),
      switchMap(() => {
        return this.http
          .get<PaymentMethod[]>(
            this.config.apiEndpoint + 'auth/self-paymentMethods'
          )
          .pipe(
            map((paymentMethods) => {
              return new UsersActions.SetLoggedPassengerPaymentMethods(
                paymentMethods
              );
            }),
            catchError((errorRes) => {
              return of(new UsersActions.GettingLoggedUserFailed(errorRes));
            })
          );
      })
    );
  });

  addLoggedPassengerPaymentMethod = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.ADD_LOGGED_PASSENGER_PAYMENT_METHOD),
      switchMap((action: UsersActions.AddLoggedPassengerPaymentMethod) => {
        return this.http
          .post(
            this.config.apiEndpoint + 'auth/self-paymentMethods',
            action.payload
          )
          .pipe(
            map(() => {
              return new UsersActions.AddLoggedPassengerPaymentMethodSuccess();
            }),
            catchError((errorRes) => {
              return of(new UsersActions.GettingLoggedUserFailed(errorRes));
            })
          );
      })
    );
  });

  removeLoggedPassengerPaymentMethod = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD),
      switchMap((action: UsersActions.RemoveLoggedPassengerPaymentMethod) => {
        return this.http
          .delete(this.config.apiEndpoint + 'auth/self-paymentMethods', {
            params: new HttpParams().append('paymentMethodId', action.payload),
          })
          .pipe(
            map(() => {
              return new UsersActions.RemoveLoggedPassengerPaymentMethodSuccess();
            }),
            catchError((errorRes) => {
              return of(new UsersActions.GettingLoggedUserFailed(errorRes));
            })
          );
      })
    );
  });

  loggedPassengerPaymentMethodsUpdatedSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        UsersActions.ADD_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS,
        UsersActions.REMOVE_LOGGED_PASSENGER_PAYMENT_METHOD_SUCCESS
      ),
      map(() => {
        return new UsersActions.GetLoggedPassengerPaymentMethods();
      })
    );
  });

  getAllUsers = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.GET_ALL_USERS),
      switchMap(() => {
        return this.http.get<User[]>(this.config.apiEndpoint + 'user/all').pipe(
          map((users) => {
            return new UsersActions.SetAllUsers(users);
          }),
          catchError((errorRes) => {
            return of(new UsersActions.GettingAllUsersFailed(errorRes));
          })
        );
      })
    );
  });

  toggleUserIsBlocked = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.TOGGLE_USER_IS_BLOCKED),
      switchMap((action: UsersActions.ToggleUserIsBlocked) => {
        return this.http
          .put<User>(
            this.config.apiEndpoint + 'user/toggle-blocked',
            action.payload
          )
          .pipe(
            map((user) => {
              return new UsersActions.ToggleUserIsBlockedSuccess(user);
            }),
            catchError((errorRes) => {
              return of(new UsersActions.ToggleUserIsBlockedFailed(errorRes));
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private notifierService: NotifierService,
    private router: Router
  ) {}
}
