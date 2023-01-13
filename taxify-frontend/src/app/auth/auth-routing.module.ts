import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { EmailActivationComponent } from './components/email-activation/email-activation.component';

const routes: Routes = [
  { path: 'auth/:authMode', component: AuthComponent },
  { path: 'account-email/confirm/:token', component: EmailActivationComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
