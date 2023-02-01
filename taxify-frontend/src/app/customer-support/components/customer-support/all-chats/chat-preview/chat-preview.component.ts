import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Chat } from '../../../../model/chat.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../store/app.reducer';

@Component({
  selector: 'app-chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.scss'],
})
export class ChatPreviewComponent implements OnInit, OnDestroy {
  @Input() chat: Chat;
  loggedUsersEmail: string;
  authSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe((authState) => {
      this.loggedUsersEmail = authState.user?.email;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  get interlocutor() {
    for (let message of this.chat.messages) {
      if (message.sender.email !== this.loggedUsersEmail) {
        return message.sender;
      }
      if (
        !message.receiver ||
        message.receiver.email !== this.loggedUsersEmail
      ) {
        return message.receiver;
      }
    }
    return null;
  }

  get lastMessageSendersEmail() {
    return this.chat.messages[0].sender.email;
  }

  get lastMessageReceiver() {
    return this.chat.messages[0].receiver;
  }

  get lastMessageContent() {
    return this.chat.messages[0].content;
  }

  get lastMessageStatus() {
    return this.chat.messages[0].status;
  }

  get lastMessageCreationDate() {
    return this.chat.messages[0].createdOn;
  }
}
