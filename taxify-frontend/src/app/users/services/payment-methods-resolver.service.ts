import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { PaymentMethod } from '../../shared/model/payment-method.model';
import * as fromApp from '../../store/app.reducer';
import * as UsersActions from '../store/users.actions';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsResolverService implements Resolve<PaymentMethod[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PaymentMethod[]> | Promise<PaymentMethod[]> | PaymentMethod[] {
    return this.store.select('users').pipe(
      take(1),
      map((usersState) => {
        return usersState.loggedUserPaymentMethods;
      }),
      switchMap((paymentMethods) => {
        if (paymentMethods.length === 0) {
          this.store.dispatch(
            new UsersActions.GetLoggedPassengerPaymentMethods()
          );
          return this.actions$.pipe(
            ofType(UsersActions.SET_LOGGED_PASSENGER_PAYMENT_METHODS),
            take(1)
          );
        } else {
          return of(paymentMethods);
        }
      })
    );
  }
}
