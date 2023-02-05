import * as ReportsActions from './reports.actions';
import { ReportData } from '../model/report-data.model';

export interface State {
  loading: boolean;
  reportData: ReportData;
}

const initialState: State = {
  loading: false,
  reportData: null,
};

export function reportsReducer(
  state = initialState,
  action: ReportsActions.ReportsActions
) {
  switch (action.type) {
    case ReportsActions.GET_REPORT_DATA_FOR_PERIOD:
      return {
        ...state,
        loading: true,
      };
    case ReportsActions.SET_REPORT_DATA:
      return {
        ...state,
        loading: false,
        reportData: action.payload,
      };
    case ReportsActions.GETTING_REPORT_DATA_FAILED:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
