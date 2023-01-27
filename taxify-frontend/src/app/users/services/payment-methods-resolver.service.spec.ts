import { TestBed } from '@angular/core/testing';

import { PaymentMethodsResolverService } from './payment-methods-resolver.service';

describe('PaymentMethodsResolverService', () => {
  let service: PaymentMethodsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentMethodsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
