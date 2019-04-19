import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, router, toastCtrl) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.router = router;
        this.toastCtrl = toastCtrl;
        this.appPages = [
            {
                title: 'Home',
                url: '/home',
                icon: 'home',
            },
            {
                title: 'Posts',
                url: '/feed',
                icon: 'list'
            },
            {
                title: 'Friends',
                url: '/friends',
                icon: 'people'
            }
        ];
        this.initializeApp();
    }
    AppComponent.prototype.ngOnInit = function () {
        // this.router.events.subscribe((event: RouterEvent) => {
        //   if (event instanceof NavigationEnd && event.url === '/login') {
        //     this.menuCtrl.enable(true);
        //   } 
        // });
    };
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    AppComponent.prototype.logout = function () {
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
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            Router,
            ToastController])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map