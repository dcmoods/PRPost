import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewFriendsTabPage } from './view-friends-tab.page';
var routes = [
    {
        path: '',
        component: ViewFriendsTabPage
    }
];
var ViewFriendsTabPageModule = /** @class */ (function () {
    function ViewFriendsTabPageModule() {
    }
    ViewFriendsTabPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ViewFriendsTabPage]
        })
    ], ViewFriendsTabPageModule);
    return ViewFriendsTabPageModule;
}());
export { ViewFriendsTabPageModule };
//# sourceMappingURL=view-friends-tab.module.js.map