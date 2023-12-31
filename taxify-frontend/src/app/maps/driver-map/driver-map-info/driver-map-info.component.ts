import { GetDriverRemainingWorkTime } from './../../../drivers/store/drivers.actions';
import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import { map, Observable, take } from 'rxjs';
import * as DriversActions from 'src/app/drivers/store/drivers.actions';
import { Driver } from 'src/app/shared/model/driver.model';
import { StompService } from 'src/app/stomp.service';
import { MatDialog } from '@angular/material/dialog';
import { DriverState } from '../../../drivers/model/driverState';
import * as MapsActions from '../../store/maps.actions';
import { Ride } from 'src/app/shared/model/ride.model';
import { LeaveReasonDialogComponent } from '../../leaveReasonDialog/leave-reason-dialog/leave-reason-dialog.component';

@Component({
  selector: 'app-driver-map-info',
  templateUrl: './driver-map-info.component.html',
  styleUrls: ['./driver-map-info.component.scss'],
})
export class DriverMapInfoComponent implements OnInit {
  driver: Driver;
  driverRemainingWorkTime = { hours: 8, minutes: 0 };
  driverState$: Observable<DriverState>;
  driverStateEnum: typeof DriverState = DriverState;
  ride$: Observable<Ride>;

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

        this.driverState$ = this.store.select(
          (store) => store.drivers.driverState
        );
        this.ride$ = this.store.select((store) => store.drivers.assignedRide);

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
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/driver', (): any => {
        if (email) {
          this.store.dispatch(
            new DriversActions.GetDriverRemainingWorkTime({ email: email })
          );
        }
      });
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
    const dialogRef = this.dialog.open(LeaveReasonDialogComponent, {
      disableClose: true,
      data: {
        title: 'Drive rejection',
        subtitleQuestion: "What's your reason for rejecting a drive?",
        buttonContent: 'Save reason',
      },
    });

    dialogRef.afterClosed().subscribe((rejectionReason) => {
      if (rejectionReason) {
        this.store.dispatch(
          new MapsActions.RejectRideDriver({ rejectReason: rejectionReason })
        );
        this.store.dispatch(new MapsActions.ResetStateAfterRideFinish());
      }
    });
  }

  handleRide() {
    this.driverState$.pipe(take(1)).subscribe((driverState) => {
      if (driverState === DriverState.ARRIVED_TO_CLIENT) {
        this.store.dispatch(
          new DriversActions.SetDriverState({ state: DriverState.RIDE_START })
        );
        this.store.dispatch(new MapsActions.StartRideDriver());
      } else if (driverState === DriverState.ARRIVED_TO_DESTINATION) {
        this.store.dispatch(new MapsActions.FinishRide());
      }
    });
  }
}
