import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import * as UsersActions from '../../../../../store/users.actions';

@Component({
  selector: 'app-payment-method-new',
  templateUrl: './payment-method-new.component.html',
  styleUrls: ['./payment-method-new.component.scss'],
})
export class PaymentMethodNewComponent implements OnInit {
  editForm: FormGroup;
  loading: boolean;

  constructor(public dialog: MatDialog) {}

  get number() {
    return this.editForm.get('number');
  }

  get cvc() {
    return this.editForm.get('cvc');
  }

  get expMonth() {
    return this.editForm.get('expMonth');
  }

  get expYear() {
    return this.editForm.get('expYear');
  }

  get currentYear() {
    return new Date().getFullYear() - 2000;
  }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      cvc: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{3}$/),
      ]),
      expMonth: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(12),
      ]),
      expYear: new FormControl(null, [
        Validators.required,
        Validators.min(this.currentYear),
        Validators.max(99),
      ]),
      number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{16}$/),
      ]),
    });
  }

  onSubmit() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: 'fit-content',
      data: {
        title: 'Profile Edit',
        text: 'Do you want to add a new card?',
        action: new UsersActions.AddLoggedPassengerPaymentMethod(
          this.editForm.value
        ),
      },
    });
  }
}
