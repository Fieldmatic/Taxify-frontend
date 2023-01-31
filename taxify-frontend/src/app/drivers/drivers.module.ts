import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriversRoutingModule } from './drivers-routing.module';
import { DriverRideHistoryComponent } from './driver-ride-history/driver-ride-history.component'
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DriverRideHistoryComponent
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    SharedModule
  ]
})
export class DriversModule { }
