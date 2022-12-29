import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSocialSignupDialog } from './complete-social-signup-dialog.component';

describe('SocialSignUpModalComponent', () => {
  let component: CompleteSocialSignupDialog;
  let fixture: ComponentFixture<CompleteSocialSignupDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteSocialSignupDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteSocialSignupDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
