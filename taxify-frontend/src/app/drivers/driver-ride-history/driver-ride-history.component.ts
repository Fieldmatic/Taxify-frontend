import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { RideHistoryResponse } from 'src/app/passengers/model/rideHistoryResponse';
import * as fromApp from '../../store/app.reducer';
import * as DriverActions from '../store/drivers.actions';

@Component({
  selector: 'app-driver-ride-history',
  templateUrl: './driver-ride-history.component.html',
  styleUrls: ['./driver-ride-history.component.scss']
})
export class DriverRideHistoryComponent implements OnInit {
  rideHistory: RideHistoryResponse[];
  displayedColumns: string[] = ['index','route','scheduledAt', 'finishedAt', 'price'];
  dataSource: MatTableDataSource<RideHistoryResponse>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select((store) => store.passengers.rideHistory).subscribe((ridehistory) => 
      {
      this.rideHistory = ridehistory
      console.log(ridehistory)
      this.dataSource = new MatTableDataSource<RideHistoryResponse>(this.rideHistory);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      });
    this.store.dispatch(new DriverActions.LoadDriverRideHistory())
  }

}
