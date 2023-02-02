import { Component, Inject, NgZone, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { APP_SERVICE_CONFIG } from '../../../appConfig/appconfig.service';
import { AppConfig } from '../../../appConfig/appconfig.interface';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as AuthActions from '../../store/auth.actions';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  error: string = null;

  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      }),
    });
  }

  public onSubmit(formDirective: FormGroupDirective) {
    this.store.dispatch(
      new AuthActions.SendForgotPasswordResetLink({
        email: this.forgotPasswordForm.getRawValue()['email'],
      })
    );
  }
}
