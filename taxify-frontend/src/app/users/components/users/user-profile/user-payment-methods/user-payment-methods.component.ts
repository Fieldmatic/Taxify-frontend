import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../../../../store/app.reducer';
import { PaymentMethod } from '../../../../../shared/model/payment-method.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-payment-methods',
  templateUrl: './user-payment-methods.component.html',
  styleUrls: ['./user-payment-methods.component.scss'],
})
export class UserPaymentMethodsComponent implements OnInit, OnDestroy {
  @Input() selectedPaymentMethodId: string;
  @Output() paymentMethodSelected = new EventEmitter<string>();
  paymentMethods: PaymentMethod[] = [];
  loading: boolean = false;
  usersSubscription: Subscription;
  isPaymentMethodsPage: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent?.url.subscribe((url) => {
      this.isPaymentMethodsPage = url[0].path === 'profile';
    });
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
