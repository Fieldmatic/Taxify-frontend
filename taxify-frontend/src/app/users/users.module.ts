import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserDataEditComponent } from './user-profile/user-data-edit/user-data-edit.component';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserRideHistoryComponent } from './user-profile/user-ride-history/user-ride-history.component';
import { UserPaymentMethodsComponent } from './user-profile/user-payment-methods/user-payment-methods.component';
import { UserPasswordChangeComponent } from './user-profile/user-password-change/user-password-change.component';
import { UserOldPasswordConfirmationComponent } from './user-profile/user-old-password-confirmation/user-old-password-confirmation.component';
import { ReauthGuard } from './user-profile/reauth.guard';
import { UserFavouriteRoutesComponent } from './user-profile/user-favourite-routes/user-favourite-routes.component';

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
