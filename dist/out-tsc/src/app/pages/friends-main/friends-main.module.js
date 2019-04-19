import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FriendsMainPage } from './friends-main.page';
var routes = [
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
var FriendsMainPageModule = /** @class */ (function () {
    function FriendsMainPageModule() {
    }
    FriendsMainPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [FriendsMainPage]
        })
    ], FriendsMainPageModule);
    return FriendsMainPageModule;
}());
export { FriendsMainPageModule };
//# sourceMappingURL=friends-main.module.js.map