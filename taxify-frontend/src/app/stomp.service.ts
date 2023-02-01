import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  constructor() {}

  connect() {
    let socket = new SockJS('https://localhost:8080/api/ws');
    let stompClient = Stomp.over(socket);
    stompClient.debug = () => {};
    return stompClient;
  }
}
