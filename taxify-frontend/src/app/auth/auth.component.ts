import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;

  isLoginMode: boolean;

  error: string = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private render: Renderer2
  ) {
    router.events.subscribe(() => {
      const loginButton = document.getElementById('loginBtn');
      if (this.isLoginMode) this.render.addClass(loginButton, 'red');
      else this.render.removeClass(loginButton, 'red');
    });
  }

  ngOnInit(): void {
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
