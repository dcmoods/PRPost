import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'posts',
        loadChildren: '../../feed/feed.module#FeedPageModule'
      },
      {
        path: 'friends',
        loadChildren: '../friends-main/friends-main.module#FriendsMainPageModule'
      },
      { path: 'user-profile', loadChildren: '../user-profile/user-profile.module#UserProfilePageModule' },
      { path: 'post-feed', loadChildren: '../post-feed/post-feed.module#PostFeedPageModule' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
