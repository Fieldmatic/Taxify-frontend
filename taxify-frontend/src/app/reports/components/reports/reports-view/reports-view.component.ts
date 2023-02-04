import { Component, OnInit } from '@angular/core';
import { ChartPoints } from 'ngx-simple-charts/line';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { ReportData } from '../../../model/report-data.model';

@Component({
  selector: 'app-reports-view',
  templateUrl: './reports-view.component.html',
  styleUrls: ['./reports-view.component.scss'],
})
export class ReportsViewComponent implements OnInit {
  rideChartPoints: ChartPoints[];
  kmChartPoints: ChartPoints[];
  moneyChartPoints: ChartPoints[];
  chartData: ReportData;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.select('reports').subscribe((reportsState) => {
      this.chartData = reportsState.reportData;
      let rides: ChartPoints = {
        chartPointList: [],
        name: 'Rides',
        xScaleHeight: 500,
        yScaleWidth: 500,
      };
      reportsState.reportData.numberOfRidesPerDate.forEach((value) => {
        rides.chartPointList.push({ x: value.x, y: Number(value.y) });
      });
      this.rideChartPoints.push(rides);

      let kilometers: ChartPoints = {
        chartPointList: [],
        name: 'Distance in km',
        xScaleHeight: 500,
        yScaleWidth: 500,
      };
      reportsState.reportData.numberOfRidesPerDate.forEach((value) => {
        rides.chartPointList.push({ x: value.x, y: Number(value.y) });
      });

      let money: ChartPoints = {
        chartPointList: [],
        name: 'Money',
        xScaleHeight: 500,
        yScaleWidth: 500,
      };
      reportsState.reportData.numberOfRidesPerDate.forEach((value) => {
        rides.chartPointList.push({ x: value.x, y: Number(value.y) });
      });
    });
  }
}
