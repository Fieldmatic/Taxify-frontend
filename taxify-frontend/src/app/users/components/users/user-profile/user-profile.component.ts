import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
export class UserProfileComponent implements OnInit {
  activeRoute: string = 'history';
  routeSubscription: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let url = event.url.split('/');
        this.activeRoute = url.pop();
        if (this.activeRoute === 'edit' || this.activeRoute === 'new') {
          const previousPart = url.pop();
          if (previousPart !== 'profile') {
            this.activeRoute = previousPart;
          }
        }
      }
    });
  }
}
