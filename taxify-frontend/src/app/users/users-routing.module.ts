import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDataEditComponent } from './components/users/user-profile/user-data-edit/user-data-edit.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { AuthGuard } from '../auth/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { LoggedUserResolverService } from './services/logged-user-resolver.service';
import { UserPaymentMethodsComponent } from './components/users/user-profile/user-payment-methods/user-payment-methods.component';
import { UserPasswordChangeComponent } from './components/users/user-profile/user-password-change/user-password-change.component';
import { UserRideHistoryComponent } from './components/users/user-profile/user-ride-history/user-ride-history.component';
import { ReauthGuard } from './reauth.guard';
import { UserOldPasswordConfirmationComponent } from './components/users/user-profile/user-old-password-confirmation/user-old-password-confirmation.component';
import { UserFavouriteRoutesComponent } from './components/users/user-profile/user-favourite-routes/user-favourite-routes.component';
import { PassengerGuard } from './passenger.guard';
import { PaymentMethodsResolverService } from './services/payment-methods-resolver.service';
import { PaymentMethodNewComponent } from './components/users/user-profile/user-payment-methods/payment-method-new/payment-method-new.component';
import { UsersCrudComponent } from './components/users/users-crud/users-crud.component';
import { AdminGuard } from './admin.guard';
import { UsersResolverService } from './services/users-resolver.service';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: UserProfileComponent,
        resolve: [LoggedUserResolverService],
        children: [
          { path: 'edit', component: UserDataEditComponent },
          { path: 'history', component: UserRideHistoryComponent },
          {
            path: 'paymentMethods',
            pathMatch: 'full',
            canActivate: [PassengerGuard],
            resolve: [PaymentMethodsResolverService],
            component: UserPaymentMethodsComponent,
          },
          {
            path: 'paymentMethods/new',
            canActivate: [PassengerGuard],
            component: PaymentMethodNewComponent,
          },
          {
            path: 'passConfirm',
            component: UserOldPasswordConfirmationComponent,
          },
          {
            path: 'pass',
            pathMatch: 'full',
            canActivate: [ReauthGuard],
            component: UserPasswordChangeComponent,
          },
          { path: 'favouriteRoutes', component: UserFavouriteRoutesComponent },
        ],
      },
      {
        path: 'all',
        component: UsersCrudComponent,
        canActivate: [AdminGuard],
        resolve: [UsersResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
