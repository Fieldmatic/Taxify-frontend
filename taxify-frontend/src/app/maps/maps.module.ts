import { DirectivesModule } from './../directives/directives.module';
import { NgModule } from '@angular/core';
import { ActiveDriversMapComponent } from './active-drivers-map/active-drivers-map.component';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SelectedDriverInfoComponent } from './active-drivers-map/selected-driver-info/selected-driver-info.component';
import { PassengerMapFormComponent } from './passenger-map-form/passenger-map-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MapsService } from './maps.service';
import { DriverMapInfoComponent } from './driver-map/driver-map-info/driver-map-info.component';

@NgModule({
  declarations: [
    MapsComponent,
    ActiveDriversMapComponent,
    SelectedDriverInfoComponent,
    PassengerMapFormComponent,
    DriverMapInfoComponent,
  ],
  imports: [
    RouterModule,
    SharedModule,
    DirectivesModule,
    MapsRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  providers: [MapsService],
})
export class MapsModule {}
