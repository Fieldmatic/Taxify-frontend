import { Action } from '@ngrx/store';
import { ReportData } from '../model/report-data.model';

export const GET_REPORT_DATA_FOR_PERIOD = '[Reports] Get report data in period';
export const SET_REPORT_DATA = '[Reports] Set report data';
export const GETTING_REPORT_DATA_FAILED =
  '[Reports] Getting report data failed';

export class GetReportDataInPeriod implements Action {
  readonly type = GET_REPORT_DATA_FOR_PERIOD;

  constructor(public payload: { initDate: Date; termDate: Date }) {}
}

export class SetReportData implements Action {
  readonly type = SET_REPORT_DATA;

  constructor(public payload: ReportData) {}
}

export class GettingReportDataFailed implements Action {
  readonly type = GETTING_REPORT_DATA_FAILED;

  constructor(public payload: any) {}
}

export type ReportsActions =
  | GetReportDataInPeriod
  | SetReportData
  | GettingReportDataFailed;
