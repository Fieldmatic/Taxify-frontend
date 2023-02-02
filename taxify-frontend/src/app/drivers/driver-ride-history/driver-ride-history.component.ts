import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { RideHistoryResponse } from 'src/app/passengers/model/rideHistoryResponse';
import * as fromApp from '../../store/app.reducer';
import * as DriverActions from '../store/drivers.actions';
import { ViewRideDetailsComponent } from "../view-ride-details/view-ride-details.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-driver-ride-history',
  templateUrl: './driver-ride-history.component.html',
  styleUrls: ['./driver-ride-history.component.scss']
})
export class DriverRideHistoryComponent implements OnInit {
  rideHistory: RideHistoryResponse[];
  displayedColumns: string[] = ['route','scheduledAt', 'finishedAt', 'price', 'details'];
  dataSource: MatTableDataSource<RideHistoryResponse>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: Store<fromApp.AppState>,  public dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.select((store) => store.drivers.rideHistory).subscribe((ridehistory) =>
      {
      this.rideHistory = ridehistory
      this.dataSource = new MatTableDataSource<RideHistoryResponse>(this.rideHistory);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      });
    this.store.dispatch(new DriverActions.LoadDriverRideHistory())
  }

  openRideDetails(index:number) {
    //this.store.dispatch(new PassengerActions.LoadSelectedRouteDetails({id: this.rideHistory.at(index).id}))
    const dialogRef = this.dialog.open(ViewRideDetailsComponent, {
      disableClose: true,
      data: {
        rideId: this.rideHistory.at(index).id,
        passengers: this.rideHistory.at(index).passengers
      },
    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }

}
