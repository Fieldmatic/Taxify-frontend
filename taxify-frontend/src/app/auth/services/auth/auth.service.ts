import * as AuthActions from '../../store/auth.actions';
import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import { AppConfig } from '../../../appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from '../../../appConfig/appconfig.service';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacebookSignupRequest } from '../../model/facebook-signup-request';
import { GoogleSignUpRequest } from '../../model/google-signup-request';
import { LoginResponseData } from '../../model/login-response-data';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer = null;

  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  private handleAuthentication(
    token: string,
    expiresIn: number,
    email?: string,
    role?: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new LoggedInUser(email, role, token, expirationDate);
    this.store.dispatch(new AuthActions.LoginSuccess(user));
  }

  postLogin(email: string, password: string) {
    return this.http.post<LoginResponseData>(
      this.config.apiEndpoint + 'auth/login',
      {
        email: email,
        password: password,
      }
    );
  }

  postSignUp(
    email: string,
    password: string,
    name: string,
    surname: string,
    city: string,
    phoneNumber: string,
    profilePicture: string
  ) {
    return this.http.post<{
      email: string;
      name: string;
      surname: string;
    }>(this.config.apiEndpoint + 'passenger/create', {
      email: email,
      password: password,
      name: name,
      surname: surname,
      city: city,
      phoneNumber: phoneNumber,
      profilePicture: profilePicture,
    });
  }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.LogoutStart());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
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
