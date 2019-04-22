import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';
import { IonicModule } from '@ionic/angular';
import { AddFriendsTabPage } from './add-friends-tab.page';
var routes = [
    {
        path: '',
        component: AddFriendsTabPage
    }
];
var AddFriendsTabPageModule = /** @class */ (function () {
    function AddFriendsTabPageModule() {
    }
    AddFriendsTabPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                NgAisModule
            ],
            declarations: [AddFriendsTabPage]
        })
    ], AddFriendsTabPageModule);
    return AddFriendsTabPageModule;
}());
export { AddFriendsTabPageModule };
//# sourceMappingURL=add-friends-tab.module.js.map