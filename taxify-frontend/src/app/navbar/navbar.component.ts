import { LoggedInUser } from '../auth/model/logged-in-user';
import * as AuthActions from '../auth/store/auth.actions';
import * as PassengerActions from './../passengers/store/passengers.actions';
import { Store } from '@ngrx/store';
import {
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { StompService } from '../stomp.service';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../shared/model/notification';
import * as MapActions from '../maps/store/maps.actions';
import * as DriversActions from '../drivers/store/drivers.actions';
import { DriverState } from '../drivers/model/driverState';
import { MapsService } from '../maps/maps.service';
import { Router } from '@angular/router';
import { NotifierService } from '../shared/services/notifier.service';
import * as CustomerSupportActions from '../customer-support/store/customer-support.actions';
import * as UsersActions from '../users/store/users.actions';
import * as MapsActions from '../maps/store/maps.actions'
import { MatDialog } from '@angular/material/dialog';
import { RideAssessmentDialogComponent } from '../maps/rideAssessmentDialog/ride-assessment-dialog/ride-assessment-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  role: string = null;
  isLoginMode: boolean;
  loggedInUser: LoggedInUser = null;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private toastr: ToastrService,
    private router: Router,
    private notifierService: NotifierService,
    private mapService: MapsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userSub = this.store.select('auth').subscribe((authState) => {
      this.isAuthenticated = Boolean(authState.user);
      this.loggedInUser = authState.user;
      this.isLoginMode = authState.isLoginMode;
      this.role = authState.user?.role;

      if (this.loggedInUser && this.role === 'PASSENGER') {
        this.subscribeOnWebSocketAsPassenger(this.loggedInUser.email);
        this.store.dispatch(
          new UsersActions.GetLoggedPassengerPaymentMethods()
        );
        this.loadPassengerNotifications();
        this.mapService.loadActiveRide();
      } else if (this.loggedInUser && this.role === 'DRIVER') {
        this.subscribeOnWebSocketAsDriver(this.loggedInUser.email);
        this.mapService.loadActiveRide();
      } else if (this.loggedInUser && this.role === 'ADMIN') {
        this.subscribeOnWebSocketAsAdmin();
      }
      if (this.loggedInUser) {
        this.subscribeOnWebSocketForMessages(this.loggedInUser.email);
        this.subscribeOnWebSocketForBlockedStatusChange(
          this.loggedInUser.email
        );
      }
    });
  }

  subscribeOnWebSocketAsPassenger(email: string) {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe(
        '/topic/passenger-notification/' + email,
        (response): any => {
          let message = this.getNotificationMessageFromWebSocket(response.body);
          this.showNotificationToast(message);
          this.loadPassengerNotifications();
        }
      );
    });
  }

  subscribeOnWebSocketAsDriver(email: string) {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/driver/' + email, (response): any => {
        let message = this.getNotificationMessageFromWebSocket(response.body);
        this.showNotificationToast(message);
      });
    });
  }

  subscribeOnWebSocketAsAdmin() {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/admin-required', () => {
        this.store.dispatch(new CustomerSupportActions.GetAdminNotifications());
      });
    });
  }

  subscribeOnWebSocketForMessages(email: string) {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, (response) => {
      stompClient.subscribe('/topic/message/' + email, (response): any => {
        if (response.body !== 'Message changed status') {
          this.notifierService.notifyInfo(
            `You have a new message from ${response.body}. Go check your messages!`
          );
        }
      });
    });
  }

  subscribeOnWebSocketForBlockedStatusChange(email: string) {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, (response) => {
      stompClient.subscribe('/topic/blocked/' + email, (response): any => {
        this.notifierService.notifyInfo(response.body);
        this.loadPassengerNotifications();
      });
    });
  }

  getNotificationMessageFromWebSocket(socketMessage): string {
    switch (socketMessage) {
      case 'ADDED_TO_THE_RIDE':
        return 'You have been added to the ride.';
      case 'RIDE_ACCEPTED':
        this.mapService.loadActiveRide();
        return 'Your ride has been accepted.';
      case 'VEHICLE_ARRIVED':
        return 'Vehicle has arrived on your destination.';
      case 'RIDE_STARTED':
        this.startRideForPassenger();
        return 'Your ride has started.';
      case 'RIDE_FINISHED_PASSENGER':
        this.openDialogForPassengerReview();
        return 'Your ride has finished.';
      case 'RIDE_FINISHED_DRIVER':
        this.resetStateAfterRideFinished();
        return 'You successfully finished a ride.';
      case 'RIDE_ASSIGNED':
        this.store.dispatch(
          new DriversActions.SetDriverState({
            state: DriverState.RIDING_TO_CLIENT,
          })
        );
        this.store.dispatch(new MapActions.LoadActiveRoute());
        this.store.dispatch(new MapActions.SimulateDriverRideToClient());
        return 'Ride has been assigned to you.';
      case 'RIDE_REJECTED':
        this.resetStateAfterRideFinished();
        return 'Your ride has been rejected.';
      case 'ON_DESTINATION_PASSENGER':
        return 'You have arrived on your destination.';
      case 'ON_DESTINATION_DRIVER':
        this.store.dispatch(
          new DriversActions.SetDriverState({
            state: DriverState.ARRIVED_TO_DESTINATION,
          })
        );
        return 'You have arrived on destination.';
      case 'RESERVED_DRIVER':
        return 'We reserved a first free driver for you'
      default:
        return 'Your ride has been scheduled.';
    }
  }

  resetStateAfterRideFinished() {
    this.store.dispatch(new MapActions.ResetStateAfterRideFinish());
  }

  startRideForPassenger() {
    this.store.dispatch(new MapActions.RideStartedPassenger());
  }

  showNotificationToast(message: string) {
    this.toastr.info(message, 'Notification', {
      timeOut: 5000,
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      positionClass: 'toast-top-center',
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.LogoutStart());
  }

  loadPassengerNotifications() {
    this.store.dispatch(
      new PassengerActions.GetPassengerNotifications({
        markNotificationsAsRead: false,
      })
    );
  }

  openDialogForPassengerReview() {
    const dialogRef = this.dialog.open(RideAssessmentDialogComponent, {
      disableClose: true,
      data: {
        title: 'Drive rejection',
        subtitleQuestion: "What's your reason for rejecting a drive?",
        buttonContent: 'Save reason',
      },
    });

    dialogRef.afterClosed().subscribe((rates) => {
      if ( rates != null &&
        (rates.comment !== '' ||
        rates.driverRating !== 0 ||
        rates.vehicleRating !== 0)
      ) {
        this.store.dispatch(
          new PassengerActions.LeaveReviewStart({
            comment: rates.comment,
            driverRating: rates.driverRating,
            vehicleRating: rates.vehicleRating,
          })
        );
      }
      else {
        this.store.dispatch(new MapsActions.ResetStateAfterRideFinish());
      }
    });
  }
}
