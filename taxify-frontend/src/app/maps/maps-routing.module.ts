import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveDriversMapComponent } from './active-drivers-map/active-drivers-map.component';
import { MapsComponent } from './maps.component';

const routes: Routes = [
  {
    path: 'maps',
    component: MapsComponent,
    children: [{ path: '', component: ActiveDriversMapComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsRoutingModule {}
