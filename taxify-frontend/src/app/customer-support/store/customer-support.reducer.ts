import { Chat } from '../model/chat.model';
import * as CustomerSupportActions from './customer-support.actions';
import { Notification } from '../../shared/model/notification';

export interface State {
  chats: Chat[];
  notifications: Notification[];
  loading: boolean;
}

const initialState: State = {
  chats: [],
  notifications: [],
  loading: true,
};

export function customerSupportReducer(
  state = initialState,
  action: CustomerSupportActions.CustomerSupportActions
) {
  switch (action.type) {
    case CustomerSupportActions.GET_ALL_CHATS:
      return {
        ...state,
        loading: true,
      };
    case CustomerSupportActions.SET_ALL_CHATS:
      return {
        ...state,
        chats: action.payload,
        loading: false,
      };
    case CustomerSupportActions.UPDATE_MESSAGES:
      let chats = [...state.chats];
      for (let message of action.payload) {
        let chatId = null;
        let messageId = null;
        let chatToUpdate = {
          ...chats.filter((chat, index) => {
            const filteredMessages = chat.messages.filter((m, index) => {
              if (m.id === message.id) {
                messageId = index;
                return true;
              }
              return false;
            });
            if (filteredMessages.length > 0) {
              chatId = index;
              return true;
            }
            return false;
          })[0],
          messages: [...chats[chatId].messages],
        };
        const updatedMessages = chatToUpdate.messages;
        updatedMessages[messageId] = message;
        chatToUpdate['messages'] = updatedMessages;
        chats[chatId] = chatToUpdate;
      }
      return {
        ...state,
        chats,
      };
    case CustomerSupportActions.SET_CHAT_WITH_INTERLOCUTOR:
      let allChats = [...state.chats];
      allChats[action.payload.id] = action.payload.chat;
      return {
        ...state,
        chats: allChats,
      };
    case CustomerSupportActions.SET_ADMIN_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
}
