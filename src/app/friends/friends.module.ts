import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';

import { IonicModule } from '@ionic/angular';

import { FriendsPage } from './friends.page';



const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgAisModule,
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
