import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  socket = new SockJS('http://localhost:8080/api/ws');
  stompClient = Stomp.over(this.socket);
  message: string;

  constructor() {
    this.stompClient.debug = function () {};
  }

  subscribe(topic: string, callback: any) {
    const connected: boolean = this.stompClient.connected;
    if (connected) {
      this.subscribeToTopic(topic, callback);
      return;
    }

    this.stompClient.connect({}, () => {
      this.subscribeToTopic(topic, callback);
    });
  }

  private subscribeToTopic(topic: string, callback: any) {
    this.stompClient.subscribe(topic, (message): any => {
      switch (message.body) {
        case 'ADDED_TO_THE_RIDE':
          this.message = 'You have been added to the ride.';
          break;
        case 'RIDE_ACCEPTED':
          this.message = 'Your ride has been accepted.';
          break;
        case 'VEHICLE_ARRIVED':
          this.message = 'Vehicle has arrived on your destination.';
          break;
        default:
          this.message = 'Your ride has been scheduled.';
      }
      callback();
    });
  }
}
