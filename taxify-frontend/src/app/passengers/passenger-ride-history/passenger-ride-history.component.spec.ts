import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerRideHistoryComponent } from './passenger-ride-history.component';

describe('PassengerRideHistoryComponent', () => {
  let component: PassengerRideHistoryComponent;
  let fixture: ComponentFixture<PassengerRideHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerRideHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerRideHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
