import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducer';

export const getAuthSelector = createFeatureSelector<State>('auth');
export const getUserExistsSelector = createSelector(
  getAuthSelector,
  (state: State) => state.userExists
);
