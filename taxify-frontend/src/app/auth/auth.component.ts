import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;

  isLoginMode = true;
  error: string = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

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
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  signUp() {
    if (this.isLoginMode) {
      this.authService
        .login(
          this.loginForm.getRawValue()['email'],
          this.loginForm.getRawValue()['password']
        )
        .subscribe(
          (resData) => {
            console.log(resData);
          },
          (errorMessage) => {
            console.log(errorMessage);
          }
        );
      this.router.navigate(['/']);
    } else {
      //register
    }
  }
}
