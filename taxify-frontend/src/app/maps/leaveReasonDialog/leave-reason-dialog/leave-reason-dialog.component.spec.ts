import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveReasonDialogComponent } from './leave-reason-dialog.component';

describe('LeaveReasonDialogComponent', () => {
  let component: LeaveReasonDialogComponent;
  let fixture: ComponentFixture<LeaveReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveReasonDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
