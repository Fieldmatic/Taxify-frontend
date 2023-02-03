import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../store/app.reducer';

@Component({
  selector: 'app-user-ride-history',
  templateUrl: './user-ride-history.component.html',
  styleUrls: ['./user-ride-history.component.scss']
})
export class UserRideHistoryComponent implements OnInit {
  role: string;
  authSubscription: Subscription;

  constructor( private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe((authState) => {
      this.role = authState.user.role;
    });
  }


}
