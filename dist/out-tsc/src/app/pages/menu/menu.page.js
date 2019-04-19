import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, MenuController } from '@ionic/angular';
import * as firebase from 'firebase';
var MenuPage = /** @class */ (function () {
    function MenuPage(router, toastCtrl, menuCtrl) {
        var _this = this;
        this.router = router;
        this.toastCtrl = toastCtrl;
        this.menuCtrl = menuCtrl;
        this.selectedPath = '';
        this.pages = [
            {
                title: 'Posts',
                url: '/menu/posts'
            },
            {
                title: 'Friends',
                url: '/menu/friends'
            }
        ];
        this.router.events.subscribe(function (event) {
            if (event && event.url) {
                _this.selectedPath = event.url;
            }
        });
    }
    MenuPage.prototype.ionViewWillEnter = function () {
        this.menuCtrl.enable(true);
    };
    MenuPage.prototype.ngOnInit = function () {
    };
    MenuPage.prototype.logout = function () {
        var _this = this;
        firebase.auth().signOut().then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastCtrl.create({
                            message: "You have been logged out.",
                            duration: 3000
                        })];
                    case 1:
                        toast = _a.sent();
                        return [4 /*yield*/, toast.present()];
                    case 2:
                        _a.sent();
                        this.router.navigate(["/login"]);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    MenuPage = tslib_1.__decorate([
        Component({
            selector: 'app-menu',
            templateUrl: './menu.page.html',
            styleUrls: ['./menu.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router, ToastController, MenuController])
    ], MenuPage);
    return MenuPage;
}());
export { MenuPage };
//# sourceMappingURL=menu.page.js.map