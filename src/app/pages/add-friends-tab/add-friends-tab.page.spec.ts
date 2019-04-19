import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendsTabPage } from './add-friends-tab.page';

describe('AddFriendsTabPage', () => {
  let component: AddFriendsTabPage;
  let fixture: ComponentFixture<AddFriendsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFriendsTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
