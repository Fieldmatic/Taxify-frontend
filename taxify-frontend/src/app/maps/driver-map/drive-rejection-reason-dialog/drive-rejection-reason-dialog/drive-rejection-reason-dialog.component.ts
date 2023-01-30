import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-drive-rejection-reason-dialog',
  templateUrl: './drive-rejection-reason-dialog.component.html',
  styleUrls: ['./drive-rejection-reason-dialog.component.scss'],
})
export class DriveRejectionReasonDialogComponent {
  rejectionReason: string;

  constructor(
    public dialogRef: MatDialogRef<DriveRejectionReasonDialogComponent>
  ) {}

  closeDialogOnNo() {
    this.dialogRef.close();
  }
}
