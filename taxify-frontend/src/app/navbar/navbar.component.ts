import { LoggedInUser } from './../auth/model/logged-in-user';
import * as AuthActions from '../auth/store/auth.actions';
import * as PassengerActions from './../passengers/store/passengers.actions';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { StompService } from '../stomp.service';
import { ToastrService } from 'ngx-toastr';
import { Notification } from '../passengers/model/notification';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  loggedInUser: LoggedInUser = null;

  constructor(
    private store: Store<fromApp.AppState>,
    private stompService: StompService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !user ? false : true;
        this.loggedInUser = user;
        this.subscribeToWebSocket();
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  subscribeToWebSocket() {
    this.stompService.subscribe(
      '/topic/passenger-notification/' + this.loggedInUser.email,
      () => {
        this.toastr.info(this.stompService.message, 'Notification', {
          disableTimeOut: true,
          closeButton: true,
          tapToDismiss: true,
          newestOnTop: true,
          positionClass: 'toast-top-center',
        });
      }
    );
  }
}
