import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgAisModule } from 'angular-instantsearch';
import { IonicModule } from '@ionic/angular';
import { FriendsPage } from './friends.page';
var routes = [
    {
        path: '',
        component: FriendsPage
    }
];
var FriendsPageModule = /** @class */ (function () {
    function FriendsPageModule() {
    }
    FriendsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                NgAisModule,
            ],
            declarations: [FriendsPage]
        })
    ], FriendsPageModule);
    return FriendsPageModule;
}());
export { FriendsPageModule };
//# sourceMappingURL=friends.module.js.map