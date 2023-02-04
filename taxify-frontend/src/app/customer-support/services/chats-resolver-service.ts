import { Injectable } from '@angular/core';
import { Chat } from '../model/chat.model';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { map, Observable, of, switchMap, take } from 'rxjs';
import * as CustomerSupportActions from '../store/customer-support.actions';

@Injectable({
  providedIn: 'root',
})
export class ChatsResolverService implements Resolve<Chat[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Chat[]> | Promise<Chat[]> | Chat[] {
    return this.store.select('customerSupport').pipe(
      take(1),
      map((customerSupportState) => {
        return customerSupportState.chats;
      }),
      switchMap((chats) => {
        if (chats.length === 0) {
          this.store.dispatch(new CustomerSupportActions.GetAllChats());
          return this.actions$.pipe(
            ofType(CustomerSupportActions.SET_ALL_CHATS),
            take(1)
          );
        } else {
          return of(chats);
        }
      })
    );
  }
}