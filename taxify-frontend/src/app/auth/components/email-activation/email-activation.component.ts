import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as AuthActions from '../../store/auth.actions';

@Component({
  selector: 'app-email-activation',
  templateUrl: './email-activation.component.html',
  styleUrls: ['./email-activation.component.scss'],
})
export class EmailActivationComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    let token = this.activatedRoute.snapshot.paramMap.get('token');
    this.store.dispatch(new AuthActions.EmailActivation({ token }));
  }
}
