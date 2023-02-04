import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import {
  APP_CONFIG,
  APP_SERVICE_CONFIG,
} from '../../../appConfig/appconfig.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockActivatedRoute } from './mock-activated-route';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as authReducer from '../../store/auth.reducer';
import * as AuthActions from '../../store/auth.actions';
import { AppState } from '../../../store/app.reducer';

describe('Authentication Component', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let activatedRouteStub: MockActivatedRoute;
  let store: MockStore<{ auth: authReducer.State }>;
  const initState: authReducer.State = {
    isLoginMode: true,
    user: null,
    loading: false,
    authenticationConfirmed: false,
    userExists: null,
  };

  beforeEach(async () => {
    activatedRouteStub = new MockActivatedRoute();
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [
        RouterModule,
        BrowserAnimationsModule,
        SharedModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        HttpClientModule,
        MatGridListModule,
        MatDividerModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: APP_SERVICE_CONFIG,
          useValue: APP_CONFIG,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
        provideMockStore({ initialState: { auth: initState } as AppState }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    component.reloadPage = function () {};
    fixture.detectChanges();
  });

  describe('View', () => {
    it('Should have login title in login mode', () => {
      activatedRouteStub.testParams = {
        authMode: 'login',
      };
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('p')?.textContent).toContain('LOG IN');
    });

    it('Should have signup title in signup mode', () => {
      store.setState({ auth: { ...initState, isLoginMode: false } });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('p')?.textContent).toContain('SIGN UP');
    });

    it('Should load additional fields for signup', () => {
      activatedRouteStub.testParams['authMode'] = 'signup';
      store.setState({ auth: { ...initState, isLoginMode: false } });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelectorAll('input').length).toBe(7);
    });
  });

  describe('Behaviour', () => {
    describe('Login', () => {
      beforeEach(() => {
        activatedRouteStub.testParams = {
          authMode: 'login',
        };
        fixture.detectChanges();
      });

      it('Empty fields', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const submitButton = compiled.querySelector(
          'button[type=submit]'
        ) as HTMLButtonElement;
        const action = new AuthActions.LoginStart({ email: '', password: '' });
        const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

        submitButton.click();

        expect(dispatchSpy).toHaveBeenCalledWith(action);
      });

      it('Filled fields', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const submitButton = compiled.querySelector(
          'button[type=submit]'
        ) as HTMLButtonElement;
        const email = 'test@test.com';
        const password = 'Test123!';
        const emailInput = compiled.querySelector(
          '#loginEmail'
        ) as HTMLInputElement;
        const passwordInput = compiled.querySelector(
          '#loginPassword'
        ) as HTMLInputElement;
        const action = new AuthActions.LoginStart({
          email: email,
          password: password,
        });
        const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

        emailInput.value = email;
        passwordInput.value = password;
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        submitButton.click();

        expect(dispatchSpy).toHaveBeenCalledWith(action);
      });
    });

    describe('Sign Up', () => {
      beforeEach(() => {
        store.setState({ auth: { ...initState, isLoginMode: false } });
      });

      it('Nothing happens for invalid form', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const submitButton = compiled.querySelector(
          'button[type=submit]'
        ) as HTMLButtonElement;
        const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

        submitButton.click();

        expect(dispatchSpy).toHaveBeenCalledTimes(0);
      });

      it('Dispatch Sign Up Action', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const email = 'test@test.com';
        const password = 'Test123!';
        const name = 'Test';
        const surname = 'Test';
        const city = 'Test';
        const phoneNumber = '066430250';

        const emailInput = compiled.querySelector(
          '#loginEmail'
        ) as HTMLInputElement;
        const passwordInput = compiled.querySelector(
          '#loginPassword'
        ) as HTMLInputElement;
        const confirmationPasswordInput = compiled.querySelector(
          '#confirmationPassword'
        ) as HTMLInputElement;
        const nameInput = compiled.querySelector('#name') as HTMLInputElement;
        const surnameInput = compiled.querySelector(
          '#surname'
        ) as HTMLInputElement;
        const cityInput = compiled.querySelector('#city') as HTMLInputElement;
        const phoneNumberInput = compiled.querySelector(
          '#phoneNumber'
        ) as HTMLInputElement;
        const submitButton = compiled.querySelector(
          'button[type=submit]'
        ) as HTMLButtonElement;
        const action = new AuthActions.SignupStart({
          email: email,
          password: password,
          firstName: name,
          lastName: surname,
          city: city,
          phoneNumber: phoneNumber,
          profilePicture: '',
        });

        const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

        emailInput.value = email;
        passwordInput.value = password;
        confirmationPasswordInput.value = password;
        nameInput.value = name;
        surnameInput.value = surname;
        cityInput.value = city;
        phoneNumberInput.value = phoneNumber;
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        confirmationPasswordInput.dispatchEvent(new Event('input'));
        nameInput.dispatchEvent(new Event('input'));
        surnameInput.dispatchEvent(new Event('input'));
        cityInput.dispatchEvent(new Event('input'));
        phoneNumberInput.dispatchEvent(new Event('input'));
        submitButton.click();

        expect(dispatchSpy).toHaveBeenCalledWith(action);
      });
    });
  });
});
