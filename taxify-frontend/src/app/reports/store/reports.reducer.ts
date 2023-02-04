import * as ReportsActions from './reports.actions';

export interface State {
  loading: boolean;
  reportData: string;
}

const initialState: State = {
  loading: false,
  reportData: '',
};

export function authReducer(
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
