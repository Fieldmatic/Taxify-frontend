import { NgModule } from '@angular/core';
import { UsersComponent } from './components/users/users.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { UserDataEditComponent } from './components/users/user-profile/user-data-edit/user-data-edit.component';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserRideHistoryComponent } from './components/users/user-profile/user-ride-history/user-ride-history.component';
import { UserPaymentMethodsComponent } from './components/users/user-profile/user-payment-methods/user-payment-methods.component';
import { UserPasswordChangeComponent } from './components/users/user-profile/user-password-change/user-password-change.component';
import { UserOldPasswordConfirmationComponent } from './components/users/user-profile/user-old-password-confirmation/user-old-password-confirmation.component';
import { ReauthGuard } from './reauth.guard';
import { UserFavouriteRoutesComponent } from './components/users/user-profile/user-favourite-routes/user-favourite-routes.component';
import { NoPaymentMethodsComponent } from './components/users/user-profile/user-payment-methods/no-payment-methods/no-payment-methods.component';
import { PaymentMethodCardComponent } from './components/users/user-profile/user-payment-methods/payment-method-card/payment-method-card.component';
import { PaymentMethodNewComponent } from './components/users/user-profile/user-payment-methods/payment-method-new/payment-method-new.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserProfileComponent,
    UserDataEditComponent,
    UserRideHistoryComponent,
    UserPaymentMethodsComponent,
    UserPasswordChangeComponent,
    UserOldPasswordConfirmationComponent,
    UserFavouriteRoutesComponent,
    NoPaymentMethodsComponent,
    PaymentMethodCardComponent,
    PaymentMethodNewComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    UsersRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    MatTooltipModule,
  ],
  providers: [ReauthGuard],
})
export class UsersModule {}
