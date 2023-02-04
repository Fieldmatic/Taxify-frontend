import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as ReportsActions from '../../store/reports.actions';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  });

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.range.valueChanges.subscribe((result) => {
      if (result === 'VALID') {
        this.store.dispatch(
          new ReportsActions.GetReportDataInPeriod({
            initDate: this.range.value.start,
            termDate: this.range.value.end,
          })
        );
      }
    });
  }
}
