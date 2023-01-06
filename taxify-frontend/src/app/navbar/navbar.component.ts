import * as AuthActions from './../../auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  loggedInUser: string = null;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !user ? false : true;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
    // this.router.navigate(['/auth/login']).then(() => {
    //   window.location.reload();
    // });
  }
}
