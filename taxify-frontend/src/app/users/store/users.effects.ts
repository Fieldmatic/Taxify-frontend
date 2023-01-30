import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as UsersActions from './users.actions';
import * as fromApp from '../../store/app.reducer';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { User } from '../../shared/user.model';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/appConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/appConfig/appconfig.service';

@Injectable()
export class UsersEffects {
  getLoggedUser = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.GET_LOGGED_USER),
      switchMap(() => {
        return this.http.get<User>(this.config.apiEndpoint + 'auth/self').pipe(
          map((user) => {
            return new UsersActions.SetLoggedUser(user);
          }),
          catchError((errorResponse) => {
            return of(
              new UsersActions.GettingLoggedUserFailed(errorResponse.status)
            );
          })
        );
      })
    );
  });

  saveLoggedUserChanges = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.SAVE_LOGGED_USER_CHANGES),
      switchMap(
        (saveLoggedUserChangesAction: UsersActions.SaveLoggedUserChanges) => {
          return this.http
            .put<User>(
              this.config.apiEndpoint + 'auth/self',
              saveLoggedUserChangesAction.payload
            )
            .pipe(
              map((user: User) => {
                return new UsersActions.SetLoggedUser(user);
              })
            );
        }
      )
    );
  });

  profileRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.SET_LOGGED_USER),
        tap(() => this.router.navigate(['/users/profile']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private router: Router,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {}
}
