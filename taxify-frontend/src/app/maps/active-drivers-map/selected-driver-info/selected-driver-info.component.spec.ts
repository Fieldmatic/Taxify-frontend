import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDriverInfoComponent } from './selected-driver-info.component';

describe('SelectedDriverInfoComponent', () => {
  let component: SelectedDriverInfoComponent;
  let fixture: ComponentFixture<SelectedDriverInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedDriverInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedDriverInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
