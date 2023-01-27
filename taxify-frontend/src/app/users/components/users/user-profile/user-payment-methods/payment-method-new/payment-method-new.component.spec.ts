import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodNewComponent } from './payment-method-new.component';

describe('PaymentMethodNewComponent', () => {
  let component: PaymentMethodNewComponent;
  let fixture: ComponentFixture<PaymentMethodNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMethodNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
