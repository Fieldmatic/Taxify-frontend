import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPaymentMethodsComponent } from './no-payment-methods.component';

describe('NoPaymentMethodsComponent', () => {
  let component: NoPaymentMethodsComponent;
  let fixture: ComponentFixture<NoPaymentMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoPaymentMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
