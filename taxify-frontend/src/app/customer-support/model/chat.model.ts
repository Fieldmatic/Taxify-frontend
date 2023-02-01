import { Message } from './message.model';

export class Chat {
  constructor(public continuable: boolean, public messages: Message[]) {}
}
