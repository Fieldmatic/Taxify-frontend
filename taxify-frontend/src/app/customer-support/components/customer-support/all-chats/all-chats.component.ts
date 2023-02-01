import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chat } from '../../../model/chat.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { Subscription } from 'rxjs';
import { StompService } from '../../../../stomp.service';
import * as CustomerSupportActions from '../../../store/customer-support.actions';
import { CompatClient } from '@stomp/stompjs';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.scss'],
})
export class AllChatsComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  role: string;
  chatSubscription: Subscription;
  authSubscription: Subscription;
  stompClient: CompatClient;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService
  ) {}

  ngOnInit(): void {
    this.chatSubscription = this.store
      .select('customerSupport')
      .subscribe((customerSupportState) => {
        this.chats = customerSupportState.chats;
      });
    this.authSubscription = this.store.select('auth').subscribe((authState) => {
      if (authState.user) {
        this.role = authState.user.role;
        this.subscribeOnWebSocket(authState.user.email);
        if (this.role === 'ADMIN') {
          this.stompClient.connect({}, () => {
            this.stompClient.subscribe(
              '/topic/message/admin',
              (response): any => {
                this.store.dispatch(
                  new CustomerSupportActions.RefreshAllChats()
                );
              }
            );
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
    this.stompClient.disconnect();
  }

  subscribeOnWebSocket(email: string) {
    this.stompClient = this.stompService.connect();
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/message/' + email, (response): any => {
        this.store.dispatch(new CustomerSupportActions.RefreshAllChats());
      });
    });
  }
}
