import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerMapFormComponent } from './passenger-map-form.component';

describe('PassengerMapFormComponent', () => {
  let component: PassengerMapFormComponent;
  let fixture: ComponentFixture<PassengerMapFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassengerMapFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerMapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
