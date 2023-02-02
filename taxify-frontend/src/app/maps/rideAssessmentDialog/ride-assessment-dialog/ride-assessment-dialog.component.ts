import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Rates {
  comment: string;
  driverRating: number;
  vehicleRating: number;
}

@Component({
  selector: 'app-ride-assessment-dialog',
  templateUrl: './ride-assessment-dialog.component.html',
  styleUrls: ['./ride-assessment-dialog.component.scss'],
})
export class RideAssessmentDialogComponent {
  rates: Rates = { comment: '', driverRating: 0, vehicleRating: 0 };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RideAssessmentDialogComponent>
  ) {}

  closeDialogOnNo() {
    this.dialogRef.close();
  }

  rateVehicle(rating: number) {
    this.rates.vehicleRating = rating;
  }

  rateDriver(rating: number) {
    this.rates.driverRating = rating;
  }

  showDriverStars(index: number) {
    if (this.rates.driverRating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  showVehicleStars(index: number) {
    if (this.rates.vehicleRating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  closeDialogOnSave() {
    this.dialogRef.close(this.rates);
  }
}
