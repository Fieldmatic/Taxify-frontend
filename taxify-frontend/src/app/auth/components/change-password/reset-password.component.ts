import { Component, Inject } from '@angular/core';
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
import { CustomValidators } from '../../validators/custom-validators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  error: string = null;
  authToken: string;
  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authToken = this.activatedRoute.snapshot.paramMap.get('token');
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$'
            ),
          ],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      {
        validator: CustomValidators.MatchValidator(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  public onSubmit(formDirective: FormGroupDirective) {
    if (!this.resetPasswordForm.valid) {
      return;
    }
    console.log('gg');
    this.store.dispatch(
      new AuthActions.ResetPassword({
        newPassword: this.resetPasswordForm.getRawValue()['password'],
        newPasswordConfirmation:
          this.resetPasswordForm.getRawValue()['confirmPassword'],
        authToken: this.authToken,
      })
    );
  }
}
