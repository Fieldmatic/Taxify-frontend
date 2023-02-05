import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotifierService } from '../../shared/services/notifier.service';
import { APP_SERVICE_CONFIG } from '../../appConfig/appconfig.service';
import { AppConfig } from '../../appConfig/appconfig.interface';
import * as ReportsActions from './reports.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ReportData } from '../model/report-data.model';

@Injectable()
export class ReportsEffects {
  getReportDataInPeriod = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsActions.GET_REPORT_DATA_FOR_PERIOD),
      switchMap((action: ReportsActions.GetReportDataInPeriod) => {
        let params = new HttpParams();
        params = params.append('initDate', action.payload.initDate.getTime());
        params = params.append('termDate', action.payload.initDate.getTime());
        return this.http
          .get<ReportData>(this.config.apiEndpoint + 'ride/report', {
            params: params,
          })
          .pipe(
            map((reportData) => {
              return new ReportsActions.SetReportData(reportData);
            }),
            catchError((errRes) => {
              return of(new ReportsActions.GettingReportDataFailed(errRes));
            })
          );
      })
    );
  });

  notifyError = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsActions.GETTING_REPORT_DATA_FAILED),
      tap((action: ReportsActions.GettingReportDataFailed) => {
        if (action.payload) {
          this.notifierService.notifyError(action.payload);
        }
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private notifierService: NotifierService,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
