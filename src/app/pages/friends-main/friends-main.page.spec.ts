import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsMainPage } from './friends-main.page';

describe('FriendsMainPage', () => {
  let component: FriendsMainPage;
  let fixture: ComponentFixture<FriendsMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsMainPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
