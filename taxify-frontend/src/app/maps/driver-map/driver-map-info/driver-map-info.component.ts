import { DriveRejectionReasonDialogComponent } from './../drive-rejection-reason-dialog/drive-rejection-reason-dialog/drive-rejection-reason-dialog.component';
import { GetDriverRemainingWorkTime } from './../../../drivers/store/drivers.actions';
import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { map, min } from 'rxjs';
import * as DriversActions from 'src/app/drivers/store/drivers.actions';
import { Driver } from 'src/app/shared/driver.model';
import { LongDateFormatKey } from 'moment';
import { StompService } from 'src/app/stomp.service';
import { state } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-driver-map-info',
  templateUrl: './driver-map-info.component.html',
  styleUrls: ['./driver-map-info.component.scss'],
})
export class DriverMapInfoComponent implements OnInit {
  driver: Driver;
  driverRemainingWorkTime = { hours: 8, minutes: 0 };

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user: LoggedInUser) => {
        if (user) {
          this.store.dispatch(
            new DriversActions.GetDriverInfo({ email: user.email })
          );
        }

        this.store.select('drivers').subscribe((driverState) => {
          this.driver = driverState.driver;
          this.getRemainingTime();
          this.checkIfTimeIsUp(user?.email, this.driver?.active);
        });

        //socket
        this.subscribeToWebSocket(user?.email);
      });
  }

  private getRemainingTime() {
    let hours = this.driver?.remainingWorkTime / 60;
    let roundHours = Math.floor(hours);
    let minutes = Math.round((hours - roundHours) * 60);
    this.driverRemainingWorkTime = {
      hours: roundHours,
      minutes: minutes,
    };
  }

  public changeDriverStatus() {
    this.store.dispatch(
      new DriversActions.ChangeDriverStatus({
        email: this.driver.email,
        active: this.driver.active,
      })
    );
  }

  subscribeToWebSocket(email: string) {
    this.stompService.subscribe('/topic/driver', (): any => {
      if (email) {
        this.store.dispatch(
          new DriversActions.GetDriverRemainingWorkTime({ email: email })
        );
      }
    });
  }

  checkIfTimeIsUp(email: string, active: boolean) {
    if (
      this.driverRemainingWorkTime.hours === 0 &&
      this.driverRemainingWorkTime.minutes === 0 &&
      active
    ) {
      this.store.dispatch(
        new DriversActions.ChangeDriverStatus({ email: email, active: active })
      );
    }
  }

  leaveDriveRejectionReason() {
    const dialogRef = this.dialog.open(DriveRejectionReasonDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((rejectionReason) => {
      console.log(rejectionReason);
    });
  }
}
