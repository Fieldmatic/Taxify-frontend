import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideAssessmentDialogComponent } from './ride-assessment-dialog.component';

describe('RideAssessmentDialogComponent', () => {
  let component: RideAssessmentDialogComponent;
  let fixture: ComponentFixture<RideAssessmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideAssessmentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
