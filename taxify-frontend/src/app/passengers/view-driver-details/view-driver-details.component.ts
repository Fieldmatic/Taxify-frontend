import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, min } from 'rxjs';
import * as DriversActions from 'src/app/drivers/store/drivers.actions';
import { Driver } from 'src/app/shared/model/driver.model';
import { LongDateFormatKey } from 'moment';
import { StompService } from 'src/app/stomp.service';
import { state } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as PassengerActions from '../store/passengers.actions';
import { DriverState } from 'src/app/drivers/model/driverState';
import { RideAssessmentDialogComponent } from 'src/app/maps/rideAssessmentDialog/ride-assessment-dialog/ride-assessment-dialog.component';

@Component({
  selector: 'app-view-driver-details',
  templateUrl: './view-driver-details.component.html',
  styleUrls: ['./view-driver-details.component.scss'],
})
export class ViewDriverDetailsComponent implements OnInit {
  @Input() driver: Driver;
  reviewAvailable: boolean;

  constructor(
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.select('passengers').subscribe((passengerState) => {
      this.reviewAvailable = passengerState.reviewAvailable;
      console.log(this.reviewAvailable);
    });
  }

  openRateDialog() {
    const dialogRef = this.dialog.open(RideAssessmentDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((rates) => {
      if (
        rates != null &&
        (rates.comment !== '' ||
          rates.driverRating !== 0 ||
          rates.vehicleRating !== 0)
      ) {
        console.log(rates);
        this.store.dispatch(
          new PassengerActions.LeaveReviewStart({
            comment: rates.comment,
            driverRating: rates.driverRating,
            vehicleRating: rates.vehicleRating,
          })
        );
      }
    });
  }
}
