import { LoggedInUser } from '../auth/model/logged-in-user';
import * as AuthActions from '../auth/store/auth.actions';
import * as PassengerActions from './../passengers/store/passengers.actions';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { StompService } from '../stomp.service';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../shared/model/notification';
import * as MapActions from '../maps/store/maps.actions';
import * as DriversActions from '../drivers/store/drivers.actions';
import { DriverState } from '../drivers/model/driverState';
import { NotifierService } from '../shared/services/notifier.service';
import { Router } from '@angular/router';
import * as CustomerSupportActions from '../customer-support/store/customer-support.actions';
import * as UsersActions from '../users/store/users.actions';

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
    private notifierService: NotifierService
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
      } else if (this.loggedInUser && this.role === 'DRIVER') {
        this.subscribeOnWebSocketAsDriver(this.loggedInUser.email);
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
        this.store.dispatch(
          new DriversActions.SetDriverState({
            state: DriverState.RIDING_TO_CLIENT,
          })
        );
        this.store.dispatch(new MapActions.SimulateDriverRideToClient());
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
        return 'Your ride has been accepted.';
      case 'VEHICLE_ARRIVED':
        return 'Vehicle has arrived on your destination.';
      case 'RIDE_STARTED':
        this.startRideForPassenger();
        return 'Your ride has started.';
      case 'RIDE_FINISHED':
        this.finishRideForPassenger();
        return 'You have arrived on destination.';
      default:
        return 'Your ride has been scheduled.';
    }
  }

  finishRideForPassenger() {
    this.store.dispatch(new MapActions.RideFinishedPassenger());
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
}
