import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from '../../app/auth/auth-routing.module';
import { AuthComponent } from '../components/auth/auth.component';
import { CompleteSocialSignupDialog } from '../components/complete-social-signup-dialog/complete-social-signup-dialog.component';
import { EmailActivationComponent } from '../components/email-activation/email-activation.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AuthComponent,
    EmailActivationComponent,
    CompleteSocialSignupDialog,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatGridListModule,
    MatDividerModule,
    MatDialogModule,
  ],
})
export class AuthModule {}
