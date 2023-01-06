import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../shared/user.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User;
  usersSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.usersSubscription = this.store
      .select('users')
      .subscribe((usersState) => {
        this.user = usersState.loggedUser;
      });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
