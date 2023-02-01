import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkUsersDialogComponent } from './link-users-dialog.component';

describe('LinkUsersDialogComponent', () => {
  let component: LinkUsersDialogComponent;
  let fixture: ComponentFixture<LinkUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkUsersDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
