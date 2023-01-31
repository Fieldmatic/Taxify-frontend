import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chat } from '../../../model/chat.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';
import { Message } from '../../../model/message.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import * as CustomerSupportActions from '../../../store/customer-support.actions';
import { StompService } from '../../../../stomp.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('leftFlyIn', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)',
        }),
        animate(350),
      ]),
      transition('* => void', [
        animate(
          200,
          style({
            opacity: 0,
            transform: 'translateX(100px)',
          })
        ),
      ]),
    ]),
    trigger('rightFlyIn', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(100px)',
        }),
        animate(350),
      ]),
      transition('* => void', [
        animate(
          200,
          style({
            opacity: 0,
            transform: 'translateX(-100px)',
          })
        ),
      ]),
    ]),
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: Chat;
  messages: Message[] = [];
  loggedInUserEmail: string;
  loggedInUserRole: string;
  chatSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private stompService: StompService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  get interlocutor() {
    if (this.chat) {
      for (let message of this.chat.messages) {
        if (message.sender.email !== this.loggedInUserEmail) {
          return message.sender;
        }
        if (
          !message.receiver ||
          message.receiver.email !== this.loggedInUserEmail
        ) {
          return message.receiver;
        }
      }
    }
    return null;
  }

  get unseenMessagesIds() {
    let imageIds: string[] = [];
    for (let message of this.messages) {
      if (
        message.status === 'DELIVERED' ||
        (message.status === 'SENT' && this.interlocutor)
      ) {
        imageIds.push(message.id);
      }
    }
    return imageIds;
  }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe((authState) => {
      this.loggedInUserEmail = authState.user?.email;
      this.loggedInUserRole = authState.user?.role;
    });
    this.chatSubscription = this.store
      .select('customerSupport')
      .subscribe((customerSupportState) => {
        const id = this.route.snapshot.paramMap.get('id');
        if (id !== 'new') {
          this.chat = customerSupportState.chats[+id];
          this.messages = Array.from(this.chat.messages).reverse();
        } else if (customerSupportState.chats.length > 0) {
          for (let chat of customerSupportState.chats) {
            for (let message of chat.messages) {
              if (message.receiver === null) {
                this.router.navigate([
                  '/customerSupport',
                  'chat',
                  customerSupportState.chats.indexOf(chat),
                ]);
                break;
              }
            }
          }
        }
        if (this.unseenMessagesIds.length > 0) {
          this.store.dispatch(
            new CustomerSupportActions.SeenMessages(this.unseenMessagesIds)
          );
        }
      });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.store.select('customerSupport').pipe(
          take(1),
          map((customerSupportState) => {
            this.chat =
              customerSupportState.chats[
                +this.route.snapshot.paramMap.get('id')
              ];
            this.messages = Array.from(this.chat.messages).reverse();
          })
        );
      }
    });
    this.subscribeOnWebSocket();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
  }

  subscribeOnWebSocket() {
    const stompClient = this.stompService.connect();
    stompClient.connect({}, () => {
      stompClient.subscribe(
        '/topic/message/' + this.loggedInUserEmail,
        (response): any => {
          this.store.dispatch(
            new CustomerSupportActions.GetChatWithInterlocutor({
              interlocutorEmail: response.body,
              id: +this.route.snapshot.paramMap.get('id'),
            })
          );
        }
      );
    });
  }
}
