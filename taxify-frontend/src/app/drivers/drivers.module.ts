import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriverRideHistoryComponent } from './driver-ride-history/driver-ride-history.component'
import { SharedModule } from '../shared/shared.module';
import { ViewPassengerDetailsComponent } from "./view-passenger-details/view-passenger-details.component";
import { ViewRideDetailsComponent } from "./view-ride-details/view-ride-details.component";


@NgModule({
  declarations: [
    DriverRideHistoryComponent,
    ViewPassengerDetailsComponent,
    ViewRideDetailsComponent
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    SharedModule
  ],
  exports:[DriverRideHistoryComponent]
})
export class DriversModule { }
