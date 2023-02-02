import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDriverDetailsComponent } from './view-driver-details.component';

describe('ViewRideDetailsDriverComponent', () => {
  let component: ViewDriverDetailsComponent;
  let fixture: ComponentFixture<ViewDriverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDriverDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDriverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
