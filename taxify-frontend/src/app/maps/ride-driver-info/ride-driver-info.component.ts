import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import { Component, OnInit } from '@angular/core';
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
import { LeaveReasonDialogComponent } from '../leaveReasonDialog/leave-reason-dialog/leave-reason-dialog.component';
import * as PassengerActions from '../../passengers/store/passengers.actions';
import { DriverState } from 'src/app/drivers/model/driverState';
import { RideStatus } from '../model/rideStatus';
@Component({
  selector: 'app-ride-driver-info',
  templateUrl: './ride-driver-info.component.html',
  styleUrls: ['./ride-driver-info.component.scss'],
})
export class RideDriverInfoComponent implements OnInit {
  driver$: Observable<Driver>;
  timeLeft$: Observable<number>;
  rideStatus$: Observable<RideStatus>;
  rideStatusEnum: typeof RideStatus = RideStatus;

  constructor(
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.driver$ = this.store.select((store) => store.maps.rideDriver);
    this.timeLeft$ = this.store.select((store) => store.maps.timeLeft);
    this.rideStatus$ = this.store.select(
      (store) => store.maps.rideStatus
    );
  }

  convertTimeLeft(timeLeft: number): string {
    if (timeLeft < 60) return timeLeft.toString() + ' seconds';
    else {
      timeLeft = timeLeft / 60;
      let roundTimeLeft = Math.round(timeLeft);
      return roundTimeLeft.toString() + ' minutes';
    }
  }

  makeComplaint() {
    const dialogRef = this.dialog.open(LeaveReasonDialogComponent, {
      disableClose: true,
      data: {
        title: 'Passenger complaints',
        subtitleQuestion: "What's your complaint?",
        buttonContent: 'Save complaint',
      },
    });
    dialogRef.afterClosed().subscribe((complaint) => {
      if (complaint) {
      this.store.dispatch(
        new PassengerActions.MakeComplaint({ complaint: complaint })
      );
      }
    });
  }
}
