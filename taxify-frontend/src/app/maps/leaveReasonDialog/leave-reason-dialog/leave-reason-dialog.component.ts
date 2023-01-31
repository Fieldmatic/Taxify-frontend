import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-reason-dialog',
  templateUrl: './leave-reason-dialog.component.html',
  styleUrls: ['./leave-reason-dialog.component.scss'],
})
export class LeaveReasonDialogComponent {
  reason: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LeaveReasonDialogComponent>
  ) {}

  closeDialogOnNo() {
    this.dialogRef.close();
  }
}
