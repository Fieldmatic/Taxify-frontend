import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, min } from 'rxjs';
import * as DriversActions from 'src/app/drivers/store/drivers.actions';
import { Driver } from 'src/app/shared/driver.model';
import { LongDateFormatKey } from 'moment';
import { StompService } from 'src/app/stomp.service';
import { state } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as PassengerActions from '../store/passengers.actions';
import { DriverState } from 'src/app/drivers/model/driverState';

@Component({
  selector: 'app-view-driver-details',
  templateUrl: './view-driver-details.component.html',
  styleUrls: ['./view-driver-details.component.scss'],
})
export class ViewDriverDetailsComponent{
  @Input() driver: Driver

  constructor(private store: Store<fromApp.AppState>) {}


}
