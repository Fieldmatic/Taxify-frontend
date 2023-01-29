import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
import * as AuthActions from '../auth/store/auth.actions';
import * as PassengerActions from './../passengers/store/passengers.actions';
import { Store } from '@ngrx/store';
import {
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
import { Notification } from '../passengers/model/notification';
import * as MapActions from '../maps/store/maps.actions';
import * as DriversActions from '../drivers/store/drivers.actions'
import { DriverState } from '../drivers/model/driverState';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !user ? false : true;

        if (user?.role === 'PASSENGER') {
          this.subscribeOnWebSocketAsPassenger(user.email);
          this.loadPassengerNotifications();
        } else if (user?.role === 'DRIVER') {
          this.subscribeOnWebSocketAsDriver(user.email);
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
        this.store.dispatch(new DriversActions.SetDriverState({state: DriverState.RIDING_TO_CLIENT}))
        this.store.dispatch(new MapActions.SimulateDriverRideToClient());
      });
    });
  }

  getNotificationMessageFromWebSocket(socketMessage): string {
    switch (socketMessage) {
      case 'ADDED_TO_THE_RIDE':
        return 'You have been added to the ride.';
      case 'RIDE_ACCEPTED':
        return 'Your ride has been accepted.';
        break;
      case 'VEHICLE_ARRIVED':
        return 'Vehicle has arrived on your destination.';
      default:
        return 'Your ride has been scheduled.';
    }
  }

  showNotificationToast(message: string) {
    this.toastr.info(message, 'Notification', {
      disableTimeOut: true,
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
