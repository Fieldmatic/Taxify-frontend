import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as authReducer from './auth.reducer';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth/auth.service';
import {
  APP_CONFIG,
  APP_SERVICE_CONFIG,
} from '../../appConfig/appconfig.service';
import { Router, RouterModule } from '@angular/router';
import { NotifierService } from '../../shared/services/notifier.service';
import { provideMockActions } from '@ngrx/effects/testing';
import * as AuthActions from './auth.actions';
import * as UsersActions from '../../users/store/users.actions';
import { LoginResponseData } from '../model/login-response-data';
import { LoggedInUser } from '../model/logged-in-user';
import { Action } from '@ngrx/store';

describe('Auth Effects', () => {
  let actions$: Observable<Action>;
  let authService: AuthService;
  let effects: AuthEffects;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let store: MockStore<{ auth: authReducer.State }>;
  let router: Router;
  let notifierService: NotifierService;
  const initState: authReducer.State = {
    isLoginMode: true,
    user: null,
    loading: false,
    authenticationConfirmed: false,
    userExists: null,
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule],
      providers: [
        AuthEffects,
        NotifierService,
        AuthService,
        {
          provide: APP_SERVICE_CONFIG,
          useValue: APP_CONFIG,
        },
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initState }),
      ],
    });
    effects = TestBed.inject(AuthEffects);
    store = TestBed.inject(MockStore);
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    notifierService = TestBed.inject(NotifierService);
  });

  describe('Login', () => {
    describe('Basic Login', () => {
      it('Login successful', () => {
        const actionPayload = {
          email: 'valid@email.com',
          password: 'password',
        };
        const action = new AuthActions.LoginStart(actionPayload);
        const completion = new AuthActions.LoginSuccess(
          new LoggedInUser('email', 'role', 'token', new Date(1000))
        );
        let notifierServiceSpy = spyOn(
          notifierService,
          'notifySuccess'
        ).and.callFake(() => null);
        let setLogOutTimerSpy = spyOn(
          authService,
          'setLogoutTimer'
        ).and.callFake(() => null);
        let handleAuthSpy = spyOn(
          effects,
          'handleAuthentication'
        ).and.returnValue(completion);
        spyOn(authService, 'postLogin').and.returnValue(
          of(new LoginResponseData('token', 1000, 'role', 'email'))
        );

        actions$ = of(action);

        effects.authLogin.subscribe((value) => {
          expect(value).toEqual(completion);
        });
        expect(handleAuthSpy.calls.count()).toEqual(1);
        expect(notifierServiceSpy.calls.count()).toEqual(1);
        expect(setLogOutTimerSpy.calls.count()).toEqual(1);
      });

      it('Login failed', () => {
        const actionPayload = {
          email: 'valid@email.com',
          password: 'password',
        };
        const action = new AuthActions.LoginStart(actionPayload);
        const completion = new AuthActions.AuthenticateFail('error_message');
        let handleAuthSpy = spyOn(effects, 'handleError').and.returnValue(
          of(completion)
        );
        let notifierServiceSpy = spyOn(
          notifierService,
          'notifyError'
        ).and.callFake(() => null);
        spyOn(authService, 'postLogin').and.returnValue(throwError(''));

        actions$ = of(action);

        effects.authLogin.subscribe((value) => {
          expect(value).toEqual(completion);
        });
        expect(handleAuthSpy.calls.count()).toEqual(1);
        expect(notifierServiceSpy.calls.count()).toEqual(1);
      });
    });

    describe('Auto Login', () => {
      it('Auto login successful', () => {
        const action = new AuthActions.AutoLogin();
        const futureDate = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        );
        const loggedUser = new LoggedInUser(
          'email',
          'role',
          'token',
          futureDate
        );
        const completion = new AuthActions.LoginSuccess(loggedUser);
        let localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(
          JSON.stringify(loggedUser)
        );

        actions$ = of(action);

        effects.autoLogin.subscribe((value) => {
          expect(value).toEqual(completion);
        });
        expect(localStorageSpy.calls.count()).toEqual(1);
      });

      it('Auto login failed because local storage is empty', () => {
        const action = new AuthActions.AutoLogin();
        const completion = { type: 'DUMMY' };
        let localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(
          '{}'
        );

        actions$ = of(action);

        effects.autoLogin.subscribe((value) => {
          expect(value).toEqual(completion);
        });
        expect(localStorageSpy.calls.count()).toEqual(1);
      });

      it('Auto login failed because token expired', () => {
        const action = new AuthActions.AutoLogin();
        const pastDate = new Date(
          new Date().setFullYear(new Date().getFullYear() - 1)
        );
        const loggedUser = new LoggedInUser('email', 'role', 'token', pastDate);
        const completion = { type: 'DUMMY' };
        let localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(
          JSON.stringify(loggedUser)
        );

        actions$ = of(action);

        effects.autoLogin.subscribe((value) => {
          expect(value).toEqual(completion);
        });
        expect(localStorageSpy.calls.count()).toEqual(1);
      });
    });

    it('Successful login should do redirection', () => {
      const actionPayload = new LoggedInUser(
        'email',
        'role',
        'token',
        new Date(1000)
      );
      let routerNavigateSpy = spyOn(router, 'navigate').and.callFake(
        () => null
      );
      const action = new AuthActions.LoginSuccess(actionPayload);

      actions$ = of(action);

      effects.loginRedirect.subscribe(() => {
        expect(routerNavigateSpy.calls.count()).toEqual(1);
        const navigationArgs = routerNavigateSpy.calls.first().args[0][0];
        expect(navigationArgs).toEqual('/');
      });
    });

    it('Successful login should get users data', () => {
      const actionPayload = new LoggedInUser(
        'email',
        'role',
        'token',
        new Date(1000)
      );
      const action = new AuthActions.LoginSuccess(actionPayload);
      const completion = new UsersActions.GetLoggedUser();

      actions$ = of(action);

      effects.loginSuccess.subscribe((value) => {
        expect(value).toEqual(completion);
      });
    });
  });

  describe('Sign Up', () => {
    it('Sign Up successful', () => {
      const actionPayload = {
        email: 'valid@email.com',
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
        city: 'city',
        phoneNumber: 'phoneNumber',
        profilePicture: null,
      };
      const action = new AuthActions.SignupStart(actionPayload);
      const completion = new AuthActions.SignupSuccess();
      let notifierServiceSpy = spyOn(
        notifierService,
        'notifySuccess'
      ).and.callFake(() => null);
      spyOn(authService, 'postSignUp').and.returnValue(
        of({ email: 'valid@email.com', name: 'firstName', surname: 'lastName' })
      );

      actions$ = of(action);

      effects.authSignup.subscribe((value) => {
        expect(value).toEqual(completion);
      });
      expect(notifierServiceSpy.calls.count()).toEqual(1);
    });

    it('Sign Up failed', () => {
      const actionPayload = {
        email: 'valid@email.com',
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
        city: 'city',
        phoneNumber: 'phoneNumber',
        profilePicture: null,
      };
      const action = new AuthActions.SignupStart(actionPayload);
      const completion = new AuthActions.AuthenticateFail('error_message');
      let handleAuthSpy = spyOn(effects, 'handleError').and.returnValue(
        of(completion)
      );
      // let notifierServiceSpy = spyOn(
      //   notifierService,
      //   'notifyError'
      // ).and.callFake(() => null);
      spyOn(authService, 'postSignUp').and.returnValue(throwError(''));

      actions$ = of(action);

      effects.authSignup.subscribe((value) => {
        expect(value).toEqual(completion);
      });
      expect(handleAuthSpy.calls.count()).toEqual(1);
      // expect(notifierServiceSpy.calls.count()).toEqual(1);
    });

    it('Successful sign up should do redirection', () => {
      let routerNavigateSpy = spyOn(router, 'navigate').and.callFake(
        () => null
      );
      const action = new AuthActions.SignupSuccess();

      actions$ = of(action);

      effects.signupSuccess.subscribe(() => {
        expect(routerNavigateSpy.calls.count()).toEqual(1);
        const navigationArgs = routerNavigateSpy.calls.first().args[0][0];
        expect(navigationArgs).toEqual('/auth/login');
      });
    });
  });
});
