import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { User } from '../../shared/user.model';
import { APP_SERVICE_CONFIG } from '../../appConfig/appconfig.service';
import { AppConfig } from '../../appConfig/appconfig.interface';
import * as UsersActions from './users.actions';
import * as fromApp from '../../store/app.reducer';
import { NotifierService } from '../../shared/notifier.service';

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
          UsersActions.SAVE_LOGGED_USER_PASSWORD_CHANGE_SUCCESS
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

  gettingLoggedUserFailed = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UsersActions.GETTING_LOGGED_USER_FAILED),
        tap((action: UsersActions.GettingLoggedUserFailed) => {
          this.notifierService.notifyError(action.payload);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private notifierService: NotifierService
  ) {}
}
