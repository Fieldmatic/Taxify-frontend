import { ActionReducerMap } from '@ngrx/store';
import { from } from 'rxjs';
import * as fromAuth from '../../auth/store/auth.reducer';

export interface AppState {
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
};
