import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  // { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  // { path: 'list', loadChildren: './list/list.module#ListPageModule', canActivate: [AuthGuard] },
  // { path: 'feed', loadChildren: './feed/feed.module#FeedPageModule', canActivate: [AuthGuard] },
  // { path: 'friends', loadChildren: './friends/friends.module#FriendsPageModule', canActivate: [AuthGuard] },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule', canActivate: [AuthGuard] },
  { path: 'comments', loadChildren: './pages/comments/comments.module#CommentsPageModule' },
  

  
  //{ path: 'friends-main', loadChildren: './pages/friends-main/friends-main.module#FriendsMainPageModule' },
  //{ path: 'add-friends-tab', loadChildren: './pages/add-friends-tab/add-friends-tab.module#AddFriendsTabPageModule' },
  //{ path: 'view-friends-tab', loadChildren: './pages/view-friends-tab/view-friends-tab.module#ViewFriendsTabPageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
