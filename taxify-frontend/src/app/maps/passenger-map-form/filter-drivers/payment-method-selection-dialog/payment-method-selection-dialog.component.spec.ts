import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodSelectionDialogComponent } from './payment-method-selection-dialog.component';

describe('PaymentMethodSelectionDialogComponent', () => {
  let component: PaymentMethodSelectionDialogComponent;
  let fixture: ComponentFixture<PaymentMethodSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentMethodSelectionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
