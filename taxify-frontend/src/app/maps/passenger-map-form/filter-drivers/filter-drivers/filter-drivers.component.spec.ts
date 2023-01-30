import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDriversComponent } from './filter-drivers.component';

describe('FilterDriversComponent', () => {
  let component: FilterDriversComponent;
  let fixture: ComponentFixture<FilterDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterDriversComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
