import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../store/app.reducer';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [
    trigger('listTrigger', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)',
        }),
        animate(350),
      ]),
      transition('* => void', [
        animate(
          200,
          style({
            opacity: 0,
            transform: 'translateX(100px)',
          })
        ),
      ]),
    ]),
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  role: string;
  activeRoute: string;
  routeSubscription: Subscription;
  authSubscription: Subscription;

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth').subscribe((authState) => {
      this.role = authState.user.role;
    });
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let url = event.url.split('/');
        this.activeRoute = url.pop();
        if (this.activeRoute === 'edit' || this.activeRoute === 'new') {
          const previousPart = url.pop();
          if (previousPart !== 'profile') {
            this.activeRoute = previousPart;
          }
        } else if(this.activeRoute === "history") {
          //this.activeRoute
        }
      }
    });
    this.activeRoute = this.role === 'PASSENGER' ? 'history' : 'edit';
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
