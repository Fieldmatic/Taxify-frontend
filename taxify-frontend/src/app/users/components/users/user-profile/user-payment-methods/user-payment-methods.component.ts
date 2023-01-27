import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../../../../store/app.reducer';
import { PaymentMethod } from '../../../../../shared/model/payment-method.model';

@Component({
  selector: 'app-user-payment-methods',
  templateUrl: './user-payment-methods.component.html',
  styleUrls: ['./user-payment-methods.component.scss'],
})
export class UserPaymentMethodsComponent implements OnInit, OnDestroy {
  paymentMethods: PaymentMethod[] = [];
  loading: boolean = false;
  usersSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.usersSubscription = this.store
      .select('users')
      .subscribe((usersState) => {
        this.paymentMethods = usersState.loggedUserPaymentMethods;
        this.loading = usersState.loading;
      });
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}
