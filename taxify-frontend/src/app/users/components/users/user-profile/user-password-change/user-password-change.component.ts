import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../store/app.reducer';
import * as AuthActions from '../../../../../auth/store/auth.actions';
import * as CustomValidators from '../../../../validators/PasswordValidators';
import * as UsersActions from '../../../../store/users.actions';

@Component({
  selector: 'app-user-password-change',
  templateUrl: './user-password-change.component.html',
  styleUrls: ['./user-password-change.component.scss'],
})
export class UserPasswordChangeComponent implements OnInit, OnDestroy {
  passwordChangeForm: FormGroup;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.passwordChangeForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}\[\]:;<>,?~_+\-=|]).{8,32}$/
          ),
          CustomValidators.PasswordValidators.passwordIsNew,
        ]),
        confirmationPassword: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}\[\]:;<>,?~_+\-=|]).{8,32}$/
          ),
        ]),
      },
      {
        validators:
          CustomValidators.PasswordValidators.confirmationPasswordIsSameAsPassword(),
      }
    );
  }

  get password() {
    return this.passwordChangeForm.get('password');
  }

  get confirmationPassword() {
    return this.passwordChangeForm.get('confirmationPassword');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new AuthActions.ReauthenticateFail(null));
  }

  onSubmit() {
    this.store.dispatch(
      new UsersActions.SaveLoggedUserPasswordChange(
        this.passwordChangeForm.value['password']
      )
    );
  }
}
