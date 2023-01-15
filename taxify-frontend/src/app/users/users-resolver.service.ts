import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { User } from '../shared/user.model';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as UsersActions from './store/users.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class UsersResolverService implements Resolve<User> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> | Promise<User> | User {
    return this.store.select('users').pipe(
      take(1),
      map((usersState) => {
        return usersState.loggedUser;
      }),
      switchMap((loggedUser) => {
        if (!loggedUser) {
          this.store.dispatch(new UsersActions.GetLoggedUser());
          return this.actions$.pipe(
            ofType(UsersActions.SET_LOGGED_USER_PROFILE_PICTURE),
            take(1)
          );
        } else {
          return of(loggedUser);
        }
      })
    );
  }
}
