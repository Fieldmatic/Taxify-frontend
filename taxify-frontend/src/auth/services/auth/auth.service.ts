import * as AuthActions from './../../store/auth.actions';
import { LoggedInUser } from 'src/auth/model/logged-in-user';
import { Router } from '@angular/router';
import { AppConfig } from '../../../app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from '../../../app/appConfig/appconfig.service';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { FacebookSignupRequest } from '../../model/facebook-signup-request';
import { GoogleSignUpRequest } from '../../model/google-signup-request';
import { LoginResponseData } from '../../model/login-response-data';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../app/store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //user = new BehaviorSubject<LoggedInUser>(null);
  private tokenExpirationTimer = null;

  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  logIn(email: string, password: string) {
    return this.http
      .post<LoginResponseData>(this.config.apiEndpoint + 'auth/login', {
        email: email,
        password: password,
      })
      .subscribe((resData) => {
        this.handleAuthentication(
          resData.token,
          resData.expiresIn,
          email,
          resData.role
        );
        this.router.navigateByUrl('/');
      });
  }

  signUp({
    email,
    password,
    repeatPassword,
    firstName,
    lastName,
    city,
    phoneNumber,
    profilePicture,
  }) {
    return this.http.post<{ email: string; name: string; surname: string }>(
      this.config.apiEndpoint + 'passenger/create',
      {
        email: email,
        password: password,
        name: firstName,
        surname: lastName,
        city: city,
        phoneNumber: phoneNumber,
        profilePicture: profilePicture,
      }
    );
  }

  private handleAuthentication(
    token: string,
    expiresIn: number,
    email?: string,
    role?: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new LoggedInUser(email, role, token, expirationDate);
    //this.user.next(user);
    this.store.dispatch(
      new AuthActions.Login({
        email: email,
        role: role,
        token: token,
        tokenExpirationDate: expirationDate,
      })
    );
    this.autoLogout(expiresIn);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    //this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
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

    let expirationDate = new Date(userData._tokenExpirationDate);
    const loadedUser = new LoggedInUser(
      userData.email,
      userData.role,
      userData._token,
      expirationDate
    );
    if (loadedUser.token) {
      //token is valid
      //this.user.next(loadedUser);
      this.store.dispatch(
        new AuthActions.Login({
          email: loadedUser.email,
          role: loadedUser.role,
          token: loadedUser.token,
          tokenExpirationDate: expirationDate,
        })
      );
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
