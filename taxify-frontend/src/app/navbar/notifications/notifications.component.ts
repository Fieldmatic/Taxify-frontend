import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Notification } from 'src/app/shared/model/notification';
import * as fromApp from '../../store/app.reducer';
import * as PassengerActions from '../../passengers/store/passengers.actions';
import * as CustomerSupportActions from '../../customer-support/store/customer-support.actions';
import { PaymentMethodSelectionDialogComponent } from '../../maps/passenger-map-form/filter-drivers/payment-method-selection-dialog/payment-method-selection-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  @Input() role: string;
  notifications: Notification[] = [];
  numberOfPaymentMethods: number = 0;
  paymentMethodId: string;
  unreadNotifications: number = 0;

  constructor(
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.store
      .select('passengers')
      .pipe(map((passengerState) => passengerState.notifications))
      .subscribe((notifications) => {
        this.notifications = notifications;
        this.getNumberOfUnreadNotifications();
      });
    this.store
      .select('customerSupport')
      .pipe(map((customerSupportState) => customerSupportState.notifications))
      .subscribe((notifications) => {
        this.notifications = notifications;
        this.getNumberOfUnreadNotifications();
      });
    this.store.select('users').subscribe((usersState) => {
      this.numberOfPaymentMethods = usersState.loggedUserPaymentMethods.length;
    });
  }

  getNotificationTime(notification: Notification) {
    var seconds =
      (new Date().getTime() - new Date(notification.arrivalTime).getTime()) /
      1000;
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days + ' day(s)';
    } else if (hours > 0) {
      return hours + ' hour(s)';
    }
    return mins + ' minute(s)';
  }

  getNotificationMessage(notification: Notification) {
    switch (notification.type) {
      case 'USER_STATUS_CHANGE':
        return (
          "Your status has been changed by our admin with explanation: '" +
          notification.userStatusChangeReason +
          "'"
        );
      case 'ADDED_TO_THE_RIDE':
        return 'has invited you to the ride';
      case 'RIDE_ACCEPTED':
        return 'Your ride has been accepted.';
      case 'VEHICLE_ARRIVED':
        return 'Vehicle has arrived at your destination.';
      case 'RIDE_STARTED':
        return 'Your ride has started.';
      case 'RIDE_FINISHED':
        return 'You have arrived at your destination.';
      case 'CUSTOMER_SUPPORT_REQUIRED':
        return 'I need help!';
      default:
        return 'Your ride has been scheduled';
    }
  }

  showNotifications() {
    switch (this.role) {
      case 'ADMIN':
        this.store.dispatch(new CustomerSupportActions.GetAdminNotifications());
        break;
      default:
        this.store.dispatch(
          new PassengerActions.GetPassengerNotifications({
            markNotificationsAsRead: true,
          })
        );
        break;
    }
  }

  getNumberOfUnreadNotifications() {
    this.unreadNotifications = 0;
    this.notifications.forEach((notification) => {
      if (!notification.read) this.unreadNotifications += 1;
    });
  }

  answerOnAddingToTheRide(notification: Notification, answer: string) {
    if (this.numberOfPaymentMethods > 0 && answer !== 'reject') {
      const dialogRef = this.dialog.open(
        PaymentMethodSelectionDialogComponent,
        {
          disableClose: true,
          data: this.paymentMethodId,
        }
      );

      dialogRef.beforeClosed().subscribe((result) => {
        this.store.dispatch(
          new PassengerActions.AnswerOnAddingToTheRide({
            notificationId: notification.id,
            paymentMethodId: result,
            answer: answer,
          })
        );
      });
    } else if (answer === 'reject') {
      this.store.dispatch(
        new PassengerActions.AnswerOnAddingToTheRide({
          notificationId: notification.id,
          paymentMethodId: null,
          answer: answer,
        })
      );
    } else {
      this.toastr.warning(
        'You have no payment methods added, go and add one first!'
      );
    }
  }
}
