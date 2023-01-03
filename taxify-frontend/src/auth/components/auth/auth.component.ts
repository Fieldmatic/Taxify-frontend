import * as AuthActions from './../../store/auth.actions';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { MatDialog } from '@angular/material/dialog';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';
import { CompleteSocialSignupDialog } from '../complete-social-signup-dialog/complete-social-signup-dialog.component';
import { FacebookSignupRequest } from '../../model/facebook-signup-request';
import { FacebookUserResponse } from '../../model/facebook-user-response';
import { GoogleSignUpRequest } from '../../model/google-signup-request';
import * as fromApp from '../../../app/store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {
  private storeSub: Subscription;
  authForm!: FormGroup;
  isLoginMode: boolean;
  error: string = null;

  callback = null;
  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private render: Renderer2,
    private socialSignUpDialogRef: MatDialog,
    private ngZone: NgZone
  ) {}

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  ngOnInit(): void {
    this.initGoogleSignIn();
    this.initFacebookSignIn();
    this.authForm = this.fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
      repeatPassword: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      city: new FormControl(''),
      phoneNumber: new FormControl(''),
      profilePicture: new FormControl(''),
    });

    this.activatedRoute.params.subscribe((params) => {
      let authMode = params['authMode'];
      if (authMode === 'login') {
        this.isLoginMode = true;
      } else if (authMode === 'signup') {
        this.isLoginMode = false;
      }
    });

    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.error = authState.authError;
    });

    this.authForm.reset();
  }

  onSwitchMode() {
    this.authForm.reset();
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.router.navigateByUrl('/auth/login');
      this.render.addClass(
        document.getElementById('loginBtn'),
        'markedLoginBtn'
      );
    } else {
      this.router.navigateByUrl('/auth/signup');
      this.render.removeClass(
        document.getElementById('loginBtn'),
        'markedLoginBtn'
      );
    }
  }

  private initFacebookSignIn() {
    //@ts-ignore
    window.fbAsyncInit = function () {
      //@ts-ignore
      FB.init({
        appId: '671022998029381',
        cookie: true,
        xfbml: true,
        version: 'v15.0',
      });
      //@ts-ignore
      FB.getLoginStatus();
    };
  }

  ngAfterViewInit(): void {
    //@ts-ignore
    window.onFacebookSignIn = () => {
      this.continueWithFacebook();
    };
    if (this.isLoginMode)
      this.render.addClass(
        document.getElementById('loginBtn'),
        'markedLoginBtn'
      );
  }

  public completeFacebookSignup(userData: FacebookUserResponse): void {
    this.ngZone.run(() => {
      let dialogReference = this.socialSignUpDialogRef.open(
        CompleteSocialSignupDialog
      );
      dialogReference.afterClosed().subscribe((result) => {
        this.authService.SignUpFacebook(
          new FacebookSignupRequest(userData, result.city, result.phoneNumber)
        );
      });
    });
  }

  private initGoogleSignIn(): void {
    //@ts-ignore
    window.onGoogleLibraryLoad = () => {
      //@ts-ignore
      google.accounts.id.initialize({
        client_id: this.config.googleClientId,
        callback: this.continueWithGoogle.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      //@ts-ignore
      google.accounts.id.renderButton(document.getElementById('googleSignIn'), {
        theme: 'filled_black',
        size: 'medium',
        text: 'continue_with',
        locale: 'en-US',
      });
      //@ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  public continueWithFacebook() {
    //@ts-ignore
    FB.login(
      (response: any) => {
        let userId: string = response.authResponse.userID;
        //@ts-ignore
        FB.api(
          `/${userId}`,
          { fields: ['email', 'first_name', 'last_name'] },
          (userResponse: FacebookUserResponse) => {
            this.authService
              .UserExists(userResponse.email)
              .subscribe((userExists) => {
                if (userExists) {
                  //this.authService.logIn(userResponse.email, userResponse.id);
                } else {
                  this.completeFacebookSignup(userResponse);
                }
              });
          }
        );
      },
      { scope: 'public_profile,email' }
    );
  }

  private async continueWithGoogle(response: CredentialResponse) {
    this.authService
      .UserSignedWithGoogleExists(response.credential)
      .subscribe((userExists) => {
        if (userExists) {
          try {
            this.authService.LoginWithGoogle(response.credential);
          } catch (e) {
            alert('User with this email already has an local account');
          }
        } else {
          this.completeGoogleSignUp(response.credential);
        }
      });
  }

  completeGoogleSignUp(credentials: string): void {
    this.ngZone.run(() => {
      let dialogReference = this.socialSignUpDialogRef.open(
        CompleteSocialSignupDialog
      );
      dialogReference.afterClosed().subscribe((result) => {
        this.authService.SignUpGoogle(
          new GoogleSignUpRequest(credentials, result.city, result.phoneNumber)
        );
      });
    });
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({
          email: this.authForm.getRawValue()['email'],
          password: this.authForm.getRawValue()['password'],
        })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({
          email: this.authForm.getRawValue()['email'],
          password: this.authForm.getRawValue()['password'],
          firstName: this.authForm.getRawValue()['firstName'],
          lastName: this.authForm.getRawValue()['lastName'],
          city: this.authForm.getRawValue()['city'],
          phoneNumber: this.authForm.getRawValue()['phoneNumber'],
          profilePicture: this.authForm.getRawValue()['profilePicture'],
        })
      );
    }
  }
}
