import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DirectivesModule } from './../directives/directives.module';
import { NgModule } from '@angular/core';
import { ActiveDriversMapComponent } from './active-drivers-map/active-drivers-map.component';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SelectedDriverInfoComponent } from './active-drivers-map/selected-driver-info/selected-driver-info.component';
import { PassengerMapFormComponent } from './passenger-map-form/passenger-map-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MapsService } from './maps.service';
import { FilterDriversComponent } from './passenger-map-form/filter-drivers/filter-drivers/filter-drivers.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LinkUsersDialogComponent } from './passenger-map-form/filter-drivers/link-users-dialog/link-users-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { DriverMapInfoComponent } from './driver-map/driver-map-info/driver-map-info.component';
import { DriveRejectionReasonDialogComponent } from './driver-map/drive-rejection-reason-dialog/drive-rejection-reason-dialog/drive-rejection-reason-dialog.component';
import { RideDriverInfoComponent } from './ride-driver-info/ride-driver-info.component';
import { PaymentMethodSelectionDialogComponent } from './passenger-map-form/filter-drivers/payment-method-selection-dialog/payment-method-selection-dialog.component';
import { UsersModule } from '../users/users.module';

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
    DirectivesModule,
    UsersModule,
  ],
  declarations: [
    MapsComponent,
    ActiveDriversMapComponent,
    SelectedDriverInfoComponent,
    PassengerMapFormComponent,
    FilterDriversComponent,
    LinkUsersDialogComponent,
    DriverMapInfoComponent,
    DriveRejectionReasonDialogComponent,
    RideDriverInfoComponent,
    PaymentMethodSelectionDialogComponent,
  ],
  providers: [MapsService],
})
export class MapsModule {}
