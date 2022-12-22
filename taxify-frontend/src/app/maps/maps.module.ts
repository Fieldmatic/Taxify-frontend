import { NgModule } from '@angular/core';
import { ActiveDriversMapComponent } from './active-drivers-map/active-drivers-map.component';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MapsComponent, ActiveDriversMapComponent],
  imports: [RouterModule, SharedModule, MapsRoutingModule],
})
export class MapsModule {}
