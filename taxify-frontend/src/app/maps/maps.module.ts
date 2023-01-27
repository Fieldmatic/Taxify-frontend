import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { FilterDriversComponent } from './passenger-map-form/filter-drivers/filter-drivers/filter-drivers.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { LinkUsersDialogComponent } from './passenger-map-form/filter-drivers/link-users-dialog/link-users-dialog.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    FormsModule,
    MapsRoutingModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    MapsComponent,
    ActiveDriversMapComponent,
    SelectedDriverInfoComponent,
    PassengerMapFormComponent,
    FilterDriversComponent,
    LinkUsersDialogComponent,
  ],
  providers: [MapsService],
})
export class MapsModule {}
