import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarProfileMenuComponent } from './navbar-profile-menu.component';

describe('NavbarProfileMenuComponent', () => {
  let component: NavbarProfileMenuComponent;
  let fixture: ComponentFixture<NavbarProfileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarProfileMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
