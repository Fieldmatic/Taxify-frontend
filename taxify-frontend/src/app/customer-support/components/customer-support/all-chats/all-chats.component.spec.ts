import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllChatsComponent } from './all-chats.component';

describe('AllChatsComponent', () => {
  let component: AllChatsComponent;
  let fixture: ComponentFixture<AllChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllChatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
