import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chat } from '../../../model/chat.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { Subscription } from 'rxjs';
import { StompService } from '../../../../stomp.service';

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
      this.role = authState.user?.role;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
  }
}
