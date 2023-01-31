import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chat } from '../../../model/chat.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { Subscription } from 'rxjs';
import { StompService } from '../../../../stomp.service';
import * as CustomerSupportActions from '../../../store/customer-support.actions';

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
        // if (this.role === 'ADMIN') {
        //   this.subscribeAdmin();
        // }
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
  }

  subscribeOnWebSocket(email: string) {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/message/' + email, (response): any => {
        this.store.dispatch(new CustomerSupportActions.RefreshAllChats());
      });
    });
  }

  subscribeAdmin() {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/message/admin', (response): any => {
        this.store.dispatch(new CustomerSupportActions.RefreshAllChats());
      });
    });
  }
}
