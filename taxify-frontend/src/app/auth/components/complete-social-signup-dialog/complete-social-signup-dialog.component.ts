import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-complete-social-signup-dialog',
  templateUrl: './complete-social-signup-dialog.component.html',
  styleUrls: ['./complete-social-signup-dialog.component.scss'],
})
export class CompleteSocialSignupDialog implements OnInit {
  signUpForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompleteSocialSignupDialog>
  ) {}
  ngOnInit(): void {
    this.dialogRef.updateSize('40%', '30%');
    this.signUpForm = this.fb.group({
      city: new FormControl(''),
      phoneNumber: new FormControl(''),
    });
  }
  submit() {
    this.dialogRef.close({
      city: this.signUpForm.getRawValue()['city'],
      phoneNumber: this.signUpForm.getRawValue()['phoneNumber'],
    });
  }
}
