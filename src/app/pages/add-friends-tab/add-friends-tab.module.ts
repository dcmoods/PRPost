import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';

import { IonicModule } from '@ionic/angular';

import { AddFriendsTabPage } from './add-friends-tab.page';

const routes: Routes = [
  {
    path: '',
    component: AddFriendsTabPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgAisModule
  ],
  declarations: [AddFriendsTabPage]
})
export class AddFriendsTabPageModule {}
