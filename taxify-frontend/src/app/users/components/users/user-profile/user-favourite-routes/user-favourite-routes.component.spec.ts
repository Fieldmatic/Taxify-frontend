import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavouriteRoutesComponent } from './user-favourite-routes.component';

describe('UserFavouriteRoutesComponent', () => {
  let component: UserFavouriteRoutesComponent;
  let fixture: ComponentFixture<UserFavouriteRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFavouriteRoutesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFavouriteRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
