import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UsersResolverService } from '../users/services/users-resolver.service';
import { PassengerRideHistoryComponent } from './passenger-ride-history/passenger-ride-history.component';
import { PassengersComponent } from './passengers.component';

const routes: Routes = [ {
  path:'passenger',
  component: PassengersComponent,
  children: [
    {
      path:'ride-history',
      component: PassengerRideHistoryComponent,
    }
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengersRoutingModule { }
