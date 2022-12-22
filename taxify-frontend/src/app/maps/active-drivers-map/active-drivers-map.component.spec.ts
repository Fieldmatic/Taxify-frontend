import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDriversMapComponent } from './active-drivers-map.component';

describe('ActiveDriversMapComponent', () => {
  let component: ActiveDriversMapComponent;
  let fixture: ComponentFixture<ActiveDriversMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveDriversMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveDriversMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
