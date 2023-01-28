import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class StompService {
  constructor() {}

  connect() {
    let socket = new SockJS('http://localhost:8080/api/ws');
    let stompClient = Stomp.over(socket);
    return stompClient;
  }
}
