import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
var routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
    { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
    // { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
    // { path: 'list', loadChildren: './list/list.module#ListPageModule', canActivate: [AuthGuard] },
    // { path: 'feed', loadChildren: './feed/feed.module#FeedPageModule', canActivate: [AuthGuard] },
    // { path: 'friends', loadChildren: './friends/friends.module#FriendsPageModule', canActivate: [AuthGuard] },
    { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule', canActivate: [AuthGuard] },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map