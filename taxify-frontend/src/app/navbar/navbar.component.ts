import { LoggedInUser } from 'src/app/auth/model/logged-in-user';
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
import { Notification } from '../passengers/model/notification';
import * as MapActions from '../maps/store/maps.actions';
import * as DriversActions from '../drivers/store/drivers.actions'
import { DriverState } from '../drivers/model/driverState';
import { MapsService } from '../maps/maps.service';

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
    private toastr: ToastrService,
    private mapService: MapsService
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
        if (this.isAuthenticated){
        this.mapService.loadActiveRide()
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
        this.store.dispatch(new MapActions.LoadActiveRoute());
        this.store.dispatch(new MapActions.SimulateDriverRideToClient());
      });
    });
  }

  getNotificationMessageFromWebSocket(socketMessage): string {
    switch (socketMessage) {
      case 'ADDED_TO_THE_RIDE':
        return 'You have been added to the ride.';
      case 'RIDE_ACCEPTED':
        this.mapService.loadActiveRide()
        return 'Your ride has been accepted.';
      case 'VEHICLE_ARRIVED':
        return 'Vehicle has arrived on your destination.';
      case 'RIDE_STARTED':
        this.startRideForPassenger()
        return 'Your ride has started.';
      case 'RIDE_FINISHED_PASSENGER':
        this.finishRide()
        return 'You have arrived on destination.'
      case 'RIDE_FINISHED_DRIVER':
        this.finishRide()
        return 'You successfully finished a ride.'
      case 'RIDE_ASSIGNED':
        return 'Ride has been assigned to you.'
      default:
        return 'Your ride has been scheduled.';
    }
  }

  finishRide() {
    this.store.dispatch(new MapActions.RideFinish())
  }

  startRideForPassenger() {
    this.store.dispatch(new MapActions.RideStartedPassenger())
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
