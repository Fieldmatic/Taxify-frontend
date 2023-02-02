import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as PassengerActions from '../store/passengers.actions'
import { RideHistoryResponse } from '../../shared/model/rideHistoryResponse';
import { ViewRideDetailsComponent } from '../view-ride-details/view-ride-details.component';

@Component({
  selector: 'app-passenger-ride-history',
  templateUrl: './passenger-ride-history.component.html',
  styleUrls: ['./passenger-ride-history.component.scss']
})
export class PassengerRideHistoryComponent implements OnInit {
  rideHistory: RideHistoryResponse[];
  displayedColumns: string[] = ['route','scheduledAt', 'finishedAt', 'price', 'details'];
  dataSource: MatTableDataSource<RideHistoryResponse>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: Store<fromApp.AppState>,  public dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.select((store) => store.passengers.rideHistory).subscribe((ridehistory) =>
      {
      this.rideHistory = ridehistory
      this.dataSource = new MatTableDataSource<RideHistoryResponse>(this.rideHistory);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      });
    this.store.dispatch(new PassengerActions.LoadPassengerRideHistory())
  }

  openRideDetails(index:number) {
    this.store.dispatch(new PassengerActions.LoadSelectedRouteDetails({id: this.rideHistory.at(index).id}))
    const dialogRef = this.dialog.open(ViewRideDetailsComponent, {
      disableClose: true,
      data: {
        rideId: this.rideHistory.at(index).id,
        locationNames: this.rideHistory.at(index).fullLocationNames
      },
    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }

}
