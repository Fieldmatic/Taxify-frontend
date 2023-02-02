import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPassengerDetailsComponent } from './view-passenger-details.component';

describe('ViewPassengerDetails', () => {
  let component: ViewPassengerDetailsComponent;
  let fixture: ComponentFixture<ViewPassengerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPassengerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPassengerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
