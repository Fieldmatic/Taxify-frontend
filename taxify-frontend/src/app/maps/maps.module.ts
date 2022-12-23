import { NgModule } from '@angular/core';
import { ActiveDriversMapComponent } from './active-drivers-map/active-drivers-map.component';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SelectedDriverInfoComponent } from './active-drivers-map/selected-driver-info/selected-driver-info.component';

@NgModule({
  declarations: [MapsComponent, ActiveDriversMapComponent, SelectedDriverInfoComponent],
  imports: [
    RouterModule,
    SharedModule,
    MapsRoutingModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class MapsModule {}
