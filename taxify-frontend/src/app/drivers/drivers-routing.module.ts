import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverRideHistoryComponent } from './driver-ride-history/driver-ride-history.component';
import { DriversComponent } from './drivers.component';

const routes: Routes = [ {
  path:'passenger',
  component: DriversComponent,
  children: [
    {
      path:'ride-history',
      component: DriverRideHistoryComponent,
    }
  ]

}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule { }
