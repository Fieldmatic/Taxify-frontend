import { Component, Input } from '@angular/core';
import { PaymentCard } from '../../../../../../shared/model/payment-method.model';
import { Store } from '@ngrx/store';
import * as UsersActions from '../../../../../store/users.actions';
import * as fromApp from '../../../../../../store/app.reducer';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-payment-method-card',
  templateUrl: './payment-method-card.component.html',
  styleUrls: ['./payment-method-card.component.scss'],
})
export class PaymentMethodCardComponent {
  @Input() card: PaymentCard;
  @Input() index: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private dialog: MatDialog
  ) {}

  brandImage() {
    switch (this.card.brand.toLowerCase()) {
      case 'visa':
        return 'assets/visa.png';
      case 'mastercard':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/256px-Mastercard-logo.svg.png';
      default:
        return '';
    }
  }

  removeCard() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: 'fit-content',
      data: {
        title: 'Payment Method Removal',
        text:
          'Do you want to remove card **** **** **** ' + this.card.last4 + '?',
        action: new UsersActions.RemoveLoggedPassengerPaymentMethod(this.index),
      },
    });
  }
}
