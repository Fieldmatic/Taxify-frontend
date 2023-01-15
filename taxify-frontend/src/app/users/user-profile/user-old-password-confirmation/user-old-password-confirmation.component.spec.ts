import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOldPasswordConfirmationComponent } from './user-old-password-confirmation.component';

describe('UserOldPasswordConfirmationComponent', () => {
  let component: UserOldPasswordConfirmationComponent;
  let fixture: ComponentFixture<UserOldPasswordConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOldPasswordConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOldPasswordConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
