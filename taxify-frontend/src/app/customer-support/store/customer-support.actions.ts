import { Action } from '@ngrx/store';
import { Chat } from '../model/chat.model';
import { Message } from '../model/message.model';

export const GET_ALL_CHATS = '[Customer Support] Get all chats';
export const REFRESH_ALL_CHATS = '[Customer Support] Refresh all chats';
export const REFRESH_ALL_CHATS_SUCCESS =
  '[Customer Support] Refresh all chats successful';
export const SET_ALL_CHATS = '[Customer Support] Set all chats';
export const GET_MESSAGE = '[Customer Support] Get message';
export const SEND_MESSAGE = '[Customer Support] Send text message';
export const SEND_MESSAGE_SUCCESS =
  '[Customer Support] Send text message successful';
export const NOTIFY_ERROR = '[Customer Support] Notify error';
export const SEEN_MESSAGES = '[Customer Support] Seen messages';
export const UPDATE_MESSAGES = '[Customer Support] Update messages';

export class GetAllChats implements Action {
  readonly type = GET_ALL_CHATS;
}

export class RefreshAllChats implements Action {
  readonly type = REFRESH_ALL_CHATS;
}

export class RefreshAllChatsSuccess implements Action {
  readonly type = REFRESH_ALL_CHATS_SUCCESS;

  constructor(public payload: Chat[]) {}
}

export class SetAllChats implements Action {
  readonly type = SET_ALL_CHATS;

  constructor(public payload: Chat[]) {}
}

export class GetMessage implements Action {
  readonly type = GET_MESSAGE;

  constructor(public payload: string) {}
}

export class SendMessage implements Action {
  readonly type = SEND_MESSAGE;

  constructor(public payload: { content: string; receiverEmail: string }) {}
}

export class SendMessageSuccess implements Action {
  readonly type = SEND_MESSAGE_SUCCESS;

  constructor(public payload: Message) {}
}

export class NotifyError implements Action {
  readonly type = NOTIFY_ERROR;

  constructor(public payload: any) {}
}

export class SeenMessages implements Action {
  readonly type = SEEN_MESSAGES;

  constructor(public payload: string[]) {}
}

export class UpdateMessages implements Action {
  readonly type = UPDATE_MESSAGES;

  constructor(public payload: Message[]) {}
}

export type CustomerSupportActions =
  | GetAllChats
  | RefreshAllChats
  | RefreshAllChatsSuccess
  | SetAllChats
  | GetMessage
  | SendMessage
  | SendMessageSuccess
  | NotifyError
  | SeenMessages
  | UpdateMessages;
