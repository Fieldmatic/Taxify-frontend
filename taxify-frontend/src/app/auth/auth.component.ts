import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { FacebookUserResponse } from '../model/login/facebook-user-response';
import { AppConfig } from '../appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from '../appConfig/appconfig.service';
import { CompleteSocialSignupDialog } from './components/complete-social-signup-dialog/complete-social-signup-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FacebookSignupRequest } from '../model/login/facebook-signup-request';
import { GoogleSignUpRequest } from '../model/login/google-signup-request';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;

  isLoginMode: boolean;

  error: string = null;
  callback = null;
  constructor(
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private render: Renderer2,
    private socialSignUpDialogRef: MatDialog,
    private ngZone: NgZone
  ) {
    router.events.subscribe(() => {
      const loginButton = document.getElementById('loginBtn');
      if (this.isLoginMode) this.render.addClass(loginButton, 'red');
      else this.render.removeClass(loginButton, 'red');
    });
  }

  ngOnInit(): void {
    this.initGoogleSignIn();
    this.initFacebookSignIn();
    this.loginForm = this.fb.group({
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
                  this.authService.login(userResponse.email, userResponse.id);
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

  onSwitchMode() {
    if (this.isLoginMode) this.router.navigateByUrl('/login/signup');
    else this.router.navigateByUrl('/login/login');
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    let authObs: Observable<any>;

    if (this.isLoginMode) {
      authObs = this.authService.logIn(
        this.loginForm.getRawValue()['email'],
        this.loginForm.getRawValue()['password']
      );
      this.router.navigate(['/']);
    } else {
      //register
      authObs = this.authService.signUp(this.loginForm.value);
    }
    authObs.subscribe({
      next: (resData) => {
        console.log(resData);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.error = errorResponse.error.message;
      },
    });
    //this.router.navigate(['/']);
    this.loginForm.reset();
  }
}
