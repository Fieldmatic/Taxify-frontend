import { EmailActivationComponent } from './auth/email-activation/email-activation.component';
import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login/:authMode', component: AuthComponent },
  { path: 'account-email/confirm/:token', component: EmailActivationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
