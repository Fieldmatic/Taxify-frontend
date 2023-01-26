import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMapInfoComponent } from './driver-map-info.component';

describe('DriverMapInfoComponent', () => {
  let component: DriverMapInfoComponent;
  let fixture: ComponentFixture<DriverMapInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverMapInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverMapInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
