import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengersRoutingModule } from './passengers-routing.module';
import { PassengersComponent } from './passengers.component';
import { PassengerRideHistoryComponent } from './passenger-ride-history/passenger-ride-history.component';
import { SharedModule } from '../shared/shared.module';
import { ViewRideDetailsComponent } from './view-ride-details/view-ride-details.component';
import { ViewDriverDetailsComponent } from './view-driver-details/view-driver-details.component';


@NgModule({
  declarations: [
    PassengersComponent,
    PassengerRideHistoryComponent,
    ViewRideDetailsComponent,
    ViewDriverDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PassengersRoutingModule,
  ]
})
export class PassengersModule { }
