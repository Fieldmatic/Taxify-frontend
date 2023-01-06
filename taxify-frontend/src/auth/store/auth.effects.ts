import { AuthService } from 'src/auth/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs';
import { catchError, map, of, switchMap } from 'rxjs';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';
import { LoggedInUser } from '../model/logged-in-user';
import { LoginResponseData } from '../model/login-response-data';
import * as AuthActions from './auth.actions';

const handleError = (errorRes: any) => {
  console.log(errorRes.error);
  if (errorRes.hasOwnProperty('error')) {
    return of(new AuthActions.AuthenticateFail(errorRes.error.message));
  }
  return of(new AuthActions.AuthenticateFail('An unknown error occurred'));
};

@Injectable()
export class AuthEffects {
  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<LoginResponseData>(this.config.apiEndpoint + 'auth/login', {
            email: authData.payload.email,
            password: authData.payload.password,
          })
          .pipe(
            map((resData) => {
              const expirationDate = new Date(
                new Date().getTime() + resData.expiresIn
              );
              const user = new LoggedInUser(
                authData.payload.email,
                resData.role,
                resData.token,
                expirationDate
              );
              localStorage.setItem('userData', JSON.stringify(user));
              this.authService.setLogoutTimer(resData.expiresIn);
              return new AuthActions.LoginSuccess({
                email: authData.payload.email,
                role: resData.role,
                token: resData.token,
                tokenExpirationDate: expirationDate,
              });
            }),
            catchError((errorResp) => {
              return handleError(errorResp);
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

  authSingup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signUpAction: AuthActions.SignupStart) => {
        return this.http
          .post<{
            email: string;
            name: string;
            surname: string;
          }>(this.config.apiEndpoint + 'passenger/create', {
            email: signUpAction.payload.email,
            password: signUpAction.payload.password,
            name: signUpAction.payload.firstName,
            surname: signUpAction.payload.lastName,
            city: signUpAction.payload.city,
            phoneNumber: signUpAction.payload.phoneNumber,
            profilePicture: signUpAction.payload.profilePicture,
          })
          .pipe(
            map(() => {
              return new AuthActions.SignupSuccess();
            }),
            catchError((errorResp) => {
              return handleError(errorResp);
            })
          );
      })
    )
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
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
          return new AuthActions.LoginSuccess({
            email: loadedUser.email,
            role: loadedUser.role,
            token: loadedUser.token,
            tokenExpirationDate: expirationDate,
          });
        }
        return { type: 'DUMMY' };
      })
    )
  );

  emailActivation = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.EMAIL_ACTIVATION),
      switchMap((emailActivationAction: AuthActions.EmailActivation) => {
        console.log('token 2 ', emailActivationAction.payload.token);
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
              return handleError(errorResp);
            })
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
