import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';
import { LoggedInUser } from '../model/logged-in-user';
import { LoginResponseData } from '../model/login-response-data';
import { NotifierService } from 'src/app/shared/services/notifier.service';
import * as AuthActions from './auth.actions';
import * as UsersActions from '../../users/store/users.actions';

@Injectable()
export class AuthEffects {
  handleError(errorRes: any) {
    if (errorRes.hasOwnProperty('error')) {
      return of(new AuthActions.AuthenticateFail(errorRes.error.message));
    }
    return of(new AuthActions.AuthenticateFail('An unknown error occurred'));
  }

  handleAuthentication(
    token: string,
    expiresIn: number,
    role?: string,
    email?: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new LoggedInUser(email, role, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.LoginSuccess(user);
  }

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.authService
          .postLogin(authData.payload.email, authData.payload.password)
          .pipe(
            map((resData) => {
              this.authService.setLogoutTimer(resData.expiresIn);
              this.notifierService.notifySuccess('You successfully logged in.');
              return this.handleAuthentication(
                resData.token,
                resData.expiresIn,
                resData.role,
                authData.payload.email
              );
            }),
            catchError((errorResp) => {
              this.notifierService.notifyError(errorResp);
              return this.handleError(errorResp);
            })
          );
      })
    )
  );

  loginRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  signupSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.SIGNUP_SUCCESS),
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signUpAction: AuthActions.SignupStart) => {
        return this.authService
          .postSignUp(
            signUpAction.payload.email,
            signUpAction.payload.password,
            signUpAction.payload.firstName,
            signUpAction.payload.lastName,
            signUpAction.payload.city,
            signUpAction.payload.phoneNumber,
            signUpAction.payload.profilePicture
          )
          .pipe(
            map(() => {
              this.notifierService.notifySuccess(
                'You successfully signed up. Check your email for confirmation link'
              );
              return new AuthActions.SignupSuccess();
            }),
            catchError((errorResp) => {
              return this.handleError(errorResp);
            })
          );
      })
    )
  );

  authLogout = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGOUT_START),
      map(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData.role === 'DRIVER') {
          return new AuthActions.LogoutStartDriver({ email: userData.email });
        }
        return new AuthActions.LogoutEnd();
      })
    )
  );

  driverlogout = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGOUT_START_DRIVER),
      switchMap((driverLogoutAction: AuthActions.LogoutStartDriver) => {
        return this.http
          .put<void>(
            this.config.apiEndpoint +
              'driver/goOffline/' +
              driverLogoutAction.payload.email,
            {}
          )
          .pipe(
            map(() => {
              return new AuthActions.LogoutEnd();
            }),
            catchError((errorResp) => {
              return this.handleError(errorResp);
            })
          );
      })
    )
  );

  authLogoutEnd = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT_END),
        tap(() => {
          localStorage.clear();
          this.authService.clearLogoutTimer();
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY' };
        }

        let expirationDate = new Date(userData._tokenExpirationDate);
        const loadedUser = new LoggedInUser(
          userData.email,
          userData.role,
          userData._token,
          expirationDate
        );
        if (loadedUser.token) {
          this.authService.setLogoutTimer(
            new Date(userData._tokenExpirationDate).getTime() -
              new Date().getTime()
          );
          return new AuthActions.LoginSuccess(loadedUser);
        }
        return { type: 'DUMMY' };
      })
    )
  );

  emailActivation = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.EMAIL_ACTIVATION),
      switchMap((emailActivationAction: AuthActions.EmailActivation) => {
        return this.http
          .put<void>(
            this.config.apiEndpoint +
              'passenger/activateEmail/' +
              emailActivationAction.payload.token,
            {}
          )
          .pipe(
            map(() => {
              return new AuthActions.SignupSuccess();
            }),
            catchError((errorResp) => {
              return this.handleError(errorResp);
            })
          );
      })
    )
  );

  loginWithGoogle = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_WITH_GOOGLE),
      switchMap((loginWithGoogle: AuthActions.LoginWithGoogle) => {
        return this.http
          .post<LoginResponseData>(
            this.config.apiEndpoint +
              `auth/login-google/${loginWithGoogle.credential}`,
            {}
          )
          .pipe(
            map((resData) => {
              this.notifierService.notifySuccess(
                'You successfully logged with google signup.'
              );
              return this.handleAuthentication(
                resData.token,
                resData.expiresIn,
                resData.role,
                resData.email
              );
            })
          );
      })
    )
  );

  googleSignUp = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.GOOGLE_SIGNUP),
      switchMap((googleSignUp: AuthActions.GoogleSignup) => {
        return this.http
          .post<LoginResponseData>(
            this.config.apiEndpoint + `passenger/google-signup`,
            googleSignUp.request
          )
          .pipe(
            map((resData) => {
              this.notifierService.notifySuccess(
                'You successfully signed up with google signup.'
              );
              return this.handleAuthentication(
                resData.token,
                resData.expiresIn,
                resData.role,
                resData.email
              );
            })
          );
      })
    )
  );

  facebookSignUp = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.FACEBOOK_SIGNUP),
      switchMap((facebookSignup: AuthActions.FacebookSignup) => {
        return this.http
          .post<LoginResponseData>(
            this.config.apiEndpoint + `passenger/facebook-signup`,
            facebookSignup.payload.facebookSignUpRequest
          )
          .pipe(
            map((resData) => {
              this.notifierService.notifySuccess(
                'You successfully logged with facebook signup.'
              );

              return this.handleAuthentication(
                resData.token,
                resData.expiresIn,
                resData.role,
                facebookSignup.payload.facebookSignUpRequest.email
              );
            })
          );
      })
    )
  );

  userSignedWithGoogleExists = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.USER_SIGNED_WITH_GOOGLE_EXISTS),
      switchMap(
        (
          userSignedWithGoogleExists: AuthActions.UserSignedWithGoogleExists
        ) => {
          return this.http
            .get<boolean>(
              this.config.apiEndpoint +
                `auth/user-signed-with-google-exists/${userSignedWithGoogleExists.payload.credential}`
            )
            .pipe(
              map((userExists) => {
                return new AuthActions.ChangeUserExistsState({ userExists });
              })
            );
        }
      )
    )
  );

  userExists = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.USER_EXISTS_BY_EMAIL),
      switchMap((userExistsByEmail: AuthActions.UserExistsByEmail) => {
        return this.http
          .get<boolean>(
            this.config.apiEndpoint +
              `auth/user-exists/${userExistsByEmail.payload.email}`
          )
          .pipe(
            map((userExists) => {
              return new AuthActions.ChangeUserExistsState({ userExists });
            })
          );
      })
    )
  );

  loginSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_SUCCESS),
      switchMap(() => {
        return of(new UsersActions.GetLoggedUser());
      })
    );
  });

  reauthenticate = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.REAUTHENTICATE),
      switchMap((reauthenticateData: AuthActions.Reauthenticate) => {
        localStorage.setItem('oldPassword', reauthenticateData.payload);
        return this.http
          .post(
            this.config.apiEndpoint + 'auth/password-confirm',
            {},
            {
              params: new HttpParams().append(
                'oldPassword',
                reauthenticateData.payload
              ),
            }
          )
          .pipe(
            map(() => {
              return new AuthActions.ReauthenticateSuccess();
            }),
            catchError((errorRes) => {
              return of(new AuthActions.ReauthenticateFail(errorRes));
            })
          );
      })
    );
  });

  notifySuccess = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.REAUTHENTICATE_SUCCESS),
        tap((action: AuthActions.AuthActions) => {
          switch (action.type) {
            case AuthActions.REAUTHENTICATE_SUCCESS:
              this.notifierService.notifySuccess(
                'Successfully confirmed identity'
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

  reauthenticateSuccessRedirect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.REAUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['users', 'profile', 'pass']);
        })
      );
    },
    { dispatch: false }
  );

  reauthenticateFail = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.REAUTHENTICATE_FAIL),
        tap((action: AuthActions.ReauthenticateFail) => {
          if (action.payload) {
            this.notifierService.notifyError(action.payload);
          }
          localStorage.removeItem('oldPassword');
        })
      );
    },
    { dispatch: false }
  );

  sendForgotPasswordResetLink = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SEND_FORGOT_PASSWORD_RESET_LINK),
      switchMap(
        (
          sendForgotPasswordResetLink: AuthActions.SendForgotPasswordResetLink
        ) => {
          let queryParams = new HttpParams().append(
            'email',
            sendForgotPasswordResetLink.payload.email
          );
          return this.http
            .get<string>(this.config.apiEndpoint + `password/request-change`, {
              params: queryParams,
            })
            .pipe(
              map((message) => {
                this.notifierService.notifySuccess(message);
                return { type: 'DUMMY' };
              }),
              catchError((errorRes) => {
                this.notifierService.notifyError(errorRes);
                return of();
              })
            );
        }
      )
    )
  );

  resetPassword = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.RESET_PASSWORD),
        switchMap((resetPassword: AuthActions.ResetPassword) => {
          return this.http
            .put<void>(
              this.config.apiEndpoint + `password/change`,
              resetPassword.payload
            )
            .pipe(
              tap(() => {
                this.router.navigate(['auth/login']);
              }),
              catchError((err) => {
                console.error(err);
                return EMPTY;
              })
            );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private notifierService: NotifierService,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
