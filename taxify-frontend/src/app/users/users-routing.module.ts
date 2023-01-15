import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDataEditComponent } from './user-profile/user-data-edit/user-data-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from '../auth/auth.guard';
import { UsersComponent } from './users.component';
import { UsersResolverService } from './users-resolver.service';
import { UserPaymentMethodsComponent } from './user-profile/user-payment-methods/user-payment-methods.component';
import { UserPasswordChangeComponent } from './user-profile/user-password-change/user-password-change.component';
import { UserRideHistoryComponent } from './user-profile/user-ride-history/user-ride-history.component';
import { ReauthGuard } from './user-profile/reauth.guard';
import { UserOldPasswordConfirmationComponent } from './user-profile/user-old-password-confirmation/user-old-password-confirmation.component';
import { UserFavouriteRoutesComponent } from './user-profile/user-favourite-routes/user-favourite-routes.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: UserProfileComponent,
        resolve: [UsersResolverService],
        children: [
          { path: 'edit', component: UserDataEditComponent },
          { path: 'history', component: UserRideHistoryComponent },
          { path: 'paymentMethods', component: UserPaymentMethodsComponent },
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
