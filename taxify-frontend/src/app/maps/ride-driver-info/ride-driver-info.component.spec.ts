import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideDriverInfoComponent } from './ride-driver-info.component';

describe('RideDriverInfoComponent', () => {
  let component: RideDriverInfoComponent;
  let fixture: ComponentFixture<RideDriverInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideDriverInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideDriverInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
