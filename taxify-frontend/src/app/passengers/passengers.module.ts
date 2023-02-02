import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PassengerRideHistoryComponent } from './passenger-ride-history/passenger-ride-history.component';
import { ViewRideDetailsComponent } from './view-ride-details/view-ride-details.component';
import { ViewDriverDetailsComponent} from './view-driver-details/view-driver-details.component'
import {PassengersComponent} from './passengers.component'
import {PassengersRoutingModule} from './passengers-routing.module'



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
export class PassengersModule {}
