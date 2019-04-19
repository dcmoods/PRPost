import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFriendsTabPage } from './view-friends-tab.page';

describe('ViewFriendsTabPage', () => {
  let component: ViewFriendsTabPage;
  let fixture: ComponentFixture<ViewFriendsTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFriendsTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFriendsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
