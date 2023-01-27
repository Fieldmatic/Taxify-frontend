import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveRejectionReasonDialogComponent } from './drive-rejection-reason-dialog.component';

describe('DriveRejectionReasonDialogComponent', () => {
  let component: DriveRejectionReasonDialogComponent;
  let fixture: ComponentFixture<DriveRejectionReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriveRejectionReasonDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveRejectionReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
