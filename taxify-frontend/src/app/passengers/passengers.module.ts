import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengersRoutingModule } from './passengers-routing.module';
import { PassengersComponent } from './passengers.component';
import { PassengerRideHistoryComponent } from './passenger-ride-history/passenger-ride-history.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PassengersComponent,
    PassengerRideHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PassengersRoutingModule,
  ]
})
export class PassengersModule { }
