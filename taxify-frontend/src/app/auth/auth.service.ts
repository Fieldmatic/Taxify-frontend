import { LoggedInUser } from './LoggedInUser';
import { Router } from '@angular/router';
import { LoginResponseData } from './../model/login/login-response-data';
import { AppConfig } from './../appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from './../appConfig/appconfig.service';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { FacebookSignupRequest } from '../model/login/facebook-signup-request';
import { GoogleSignUpRequest } from '../model/login/google-signup-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<LoggedInUser>(null);
  private tokenExpirationTimer = null;

  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponseData>(this.config.apiEndpoint + 'auth/login', {
        email: email,
        password: password,
      })
      .subscribe((resData) => {
        this.handleAuthentication(resData.token, resData.expiresIn);
      });
  }

  private handleAuthentication(token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new LoggedInUser(token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new LoggedInUser(
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      //token is valid
      this.user.next(loadedUser);
      this.autoLogout(
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      );
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorResp: HttpErrorResponse) {
    return throwError(errorResp.message);
  }

  LoginWithGoogle(credentials: string) {
    return this.http
      .post<LoginResponseData>(
        this.config.apiEndpoint + `auth/login-google/${credentials}`,
        {}
      )
      .subscribe((resData) => {
        this.handleAuthentication(resData.token, resData.expiresIn);
      });
  }

  SignUpFacebook(facebookSignupRequest: FacebookSignupRequest) {
    return this.http
      .post<LoginResponseData>(
        this.config.apiEndpoint + `passenger/facebook-signup`,
        facebookSignupRequest
      )
      .subscribe((resData) => {
        this.handleAuthentication(resData.token, resData.expiresIn);
      });
  }

  SignUpGoogle(googleSignUpRequest: GoogleSignUpRequest) {
    return this.http
      .post<LoginResponseData>(
        this.config.apiEndpoint + `passenger/google-signup`,
        googleSignUpRequest
      )
      .subscribe((resData) => {
        this.handleAuthentication(resData.token, resData.expiresIn);
      });
  }
  UserExists(email: string) {
    return this.http.get<Observable<boolean>>(
      this.config.apiEndpoint + `auth/user-exists/${email}`
    );
  }
  UserSignedWithGoogleExists(credentials: string) {
    return this.http.get<Observable<boolean>>(
      this.config.apiEndpoint +
        `auth/user-signed-with-google-exists/${credentials}`
    );
  }
}
