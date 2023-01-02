import { Store } from '@ngrx/store';
import { AuthService } from '../../auth/services/auth/auth.service';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';
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

  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private router: Router,
    private render: Renderer2
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        //!!user
        this.isAuthenticated = !user ? false : true;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.loggedInUser = null;
    this.authService.logout();
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload();
    });
  }
}
