import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../store/app.reducer';
import * as AuthActions from '../../../../../auth/store/auth.actions';

@Component({
  selector: 'app-user-old-password-confirmation',
  templateUrl: './user-old-password-confirmation.component.html',
  styleUrls: ['./user-old-password-confirmation.component.scss'],
})
export class UserOldPasswordConfirmationComponent implements OnInit {
  reauthForm: FormGroup;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    const email = JSON.parse(localStorage.getItem('userData')).email;
    this.reauthForm = new FormGroup({
      email: new FormControl(email),
      password: new FormControl('', Validators.required),
    });

    this.reauthForm.controls['email'].disable();
  }

  get password() {
    return this.reauthForm.get('password');
  }

  onSubmit() {
    this.store.dispatch(
      new AuthActions.Reauthenticate(this.reauthForm.value['password'])
    );
  }
}
