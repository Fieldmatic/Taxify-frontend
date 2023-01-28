import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogWithNotesComponent } from './confirmation-dialog-with-notes.component';

describe('ConfirmationDialogWithNotesComponent', () => {
  let component: ConfirmationDialogWithNotesComponent;
  let fixture: ComponentFixture<ConfirmationDialogWithNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationDialogWithNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogWithNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
