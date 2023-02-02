import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-method-selection-dialog',
  templateUrl: './payment-method-selection-dialog.component.html',
  styleUrls: ['./payment-method-selection-dialog.component.scss'],
})
export class PaymentMethodSelectionDialogComponent implements OnInit {
  selectedPaymentMethodId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<PaymentMethodSelectionDialogComponent>
  ) {}

  ngOnInit(): void {
    this.selectedPaymentMethodId = this.data;
  }

  selectMethod($event: any) {
    this.dialogRef.close($event);
  }
}
