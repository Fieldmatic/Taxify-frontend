import { LoggedInUser } from './LoggedInUser';
import { Router } from '@angular/router';
import { LoginResponseData } from './../model/login/login-response-data';
import { AppConfig } from './../appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from './../appConfig/appconfig.service';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

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

  logIn(email: string, password: string) {
    return this.http
      .post<LoginResponseData>(this.config.apiEndpoint + 'auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            email,
            resData.token,
            resData.expiresIn,
            resData.role
          );
        })
      );
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
    email: string,
    token: string,
    expiresIn: number,
    role: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    const user = new LoggedInUser(email, role, token, expirationDate);
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
      userData.email,
      userData.role,
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
    return throwError(errorResp);
  }
}
