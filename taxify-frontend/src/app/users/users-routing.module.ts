import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { UsersComponent } from './users.component';
import { UsersResolverService } from './users-resolver.service';

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
      },
      { path: 'profile/edit', component: UserProfileEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
