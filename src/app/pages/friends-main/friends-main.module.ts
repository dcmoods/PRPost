import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendsMainPage } from './friends-main.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: FriendsMainPage,
    children: [
      {
        path: 'view',
        loadChildren: '../view-friends-tab/view-friends-tab.module#ViewFriendsTabPageModule'
      },
      {
        path: 'add',
        loadChildren: '../add-friends-tab/add-friends-tab.module#AddFriendsTabPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/view',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FriendsMainPage]
})
export class FriendsMainPageModule {}
