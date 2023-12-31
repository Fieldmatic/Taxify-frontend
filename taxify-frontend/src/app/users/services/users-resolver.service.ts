import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { User } from '../../shared/model/user.model';
import * as fromApp from '../../store/app.reducer';
import * as UsersActions from '../store/users.actions';

@Injectable({
  providedIn: 'root',
})
export class UsersResolverService implements Resolve<User[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User[]> | Promise<User[]> | User[] {
    return this.store.select('users').pipe(
      take(1),
      map((usersState) => {
        return usersState.users;
      }),
      switchMap((users) => {
        if (users.length === 0) {
          this.store.dispatch(new UsersActions.GetAllUsers());
          return this.actions$.pipe(
            ofType(UsersActions.SET_ALL_USERS),
            take(1)
          );
        } else {
          return of(users);
        }
      })
    );
  }
}
