import { Chat } from '../model/chat.model';
import * as CustomerSupportActions from './customer-support.actions';

export interface State {
  chats: Chat[];
  loading: boolean;
}

const initialState: State = {
  chats: [],
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
    // case CustomerSupportActions.SEND_MESSAGE_SUCCESS:
    //   if (state.chats.length !== 0) {
    //     let chats = [...state.chats];
    //     let id = null;
    //     let chatToUpdate = {
    //       ...chats.filter((chat, index) => {
    //         if (chat.messages[0].sender.id === action.payload.sender.id) {
    //           id = index;
    //         }
    //         return chat.messages[0].sender.id === action.payload.sender.id;
    //       })[0],
    //       messages: [action.payload, ...chats[id].messages],
    //     };
    //     chats[id] = chatToUpdate;
    //     return {
    //       ...state,
    //       chats: chats,
    //     };
    //   }
    //   return state;
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
    default:
      return state;
  }
}
