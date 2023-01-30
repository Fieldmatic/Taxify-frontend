import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { APP_SERVICE_CONFIG } from '../../appConfig/appconfig.service';
import { AppConfig } from '../../appConfig/appconfig.interface';
import { NotifierService } from '../../shared/services/notifier.service';
import * as CustomerSupportActions from './customer-support.actions';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Chat } from '../model/chat.model';
import { Message } from '../model/message.model';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class CustomerSupportEffects {
  getAllChats = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        CustomerSupportActions.GET_ALL_CHATS,
        CustomerSupportActions.REFRESH_ALL_CHATS
      ),
      switchMap((action: CustomerSupportActions.CustomerSupportActions) => {
        return this.http
          .get<Chat[]>(this.config.apiEndpoint + 'message/all')
          .pipe(
            map((chats) => {
              switch (action.type) {
                case CustomerSupportActions.REFRESH_ALL_CHATS:
                  return new CustomerSupportActions.RefreshAllChatsSuccess(
                    chats
                  );
                default:
                  return new CustomerSupportActions.SetAllChats(chats);
              }
            }),
            catchError((errorRes) => {
              return of(new CustomerSupportActions.NotifyError(errorRes));
            })
          );
      })
    );
  });

  sendMessage = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomerSupportActions.SEND_MESSAGE),
      switchMap((action: CustomerSupportActions.SendMessage) => {
        return this.http
          .post<Message>(
            this.config.apiEndpoint + 'message/send',
            action.payload
          )
          .pipe(
            map((message) => {
              return new CustomerSupportActions.SendMessageSuccess(message);
            }),
            catchError((errorRes) => {
              return of(new CustomerSupportActions.NotifyError(errorRes));
            })
          );
      })
    );
  });

  refreshChats = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomerSupportActions.SEND_MESSAGE_SUCCESS),
      withLatestFrom(this.store.select('customerSupport')),
      switchMap(([actionData, customerSupportState]) => {
        if (customerSupportState.chats.length === 0) {
          return of(new CustomerSupportActions.RefreshAllChats());
        } else {
          return of();
        }
      })
    );
  });

  refreshAllChatsSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomerSupportActions.REFRESH_ALL_CHATS_SUCCESS),
      map((action: CustomerSupportActions.RefreshAllChatsSuccess) => {
        return new CustomerSupportActions.SetAllChats(action.payload);
      })
    );
  });

  refreshAllChatsSuccessRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerSupportActions.REFRESH_ALL_CHATS_SUCCESS),
        tap(() => {
          this.router.navigate(['/customerSupport', 'chats']);
        })
      ),
    { dispatch: false }
  );

  notifyError = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CustomerSupportActions.NOTIFY_ERROR),
        tap((action: CustomerSupportActions.NotifyError) => {
          this.notifierService.notifyError(action.payload);
        })
      );
    },
    { dispatch: false }
  );

  seenMessages = createEffect(() => {
    return this.actions$.pipe(
      ofType(CustomerSupportActions.SEEN_MESSAGES),
      switchMap((action: CustomerSupportActions.SeenMessages) => {
        return this.http
          .put<Message[]>(this.config.apiEndpoint + 'message/status', {
            messagesIds: action.payload,
            status: 'SEEN',
          })
          .pipe(
            map((messages) => {
              return new CustomerSupportActions.UpdateMessages(messages);
            }),
            catchError((errorRes) => {
              return of(new CustomerSupportActions.NotifyError(errorRes));
            })
          );
      })
    );
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig,
    private notifierService: NotifierService
  ) {}
}
