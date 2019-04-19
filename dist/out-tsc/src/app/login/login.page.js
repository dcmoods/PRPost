import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
var LoginPage = /** @class */ (function () {
    function LoginPage(afAuth, toastCtrl, router, menuCtrl) {
        this.afAuth = afAuth;
        this.toastCtrl = toastCtrl;
        this.router = router;
        this.menuCtrl = menuCtrl;
        this.email = "";
        this.password = "";
    }
    LoginPage.prototype.ngOnInit = function () {
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
            .then(function (user) {
            console.log(user);
            _this.toastCtrl.create({
                message: "Welcome " + user.user.displayName,
                duration: 3000
            }).then(function (toast) { return toast.present(); });
            _this.router.navigate(['/menu/posts']);
        })
            .catch(function (err) {
            console.log(err);
            _this.toastCtrl.create({
                message: err.message,
                duration: 3000
            }).then(function (toast) { return toast.present(); });
        });
    };
    LoginPage.prototype.gotoSignup = function () {
        this.router.navigateByUrl('/signup');
    };
    LoginPage.prototype.ionViewWillEnter = function () {
        this.menuCtrl.enable(false);
    };
    LoginPage = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.page.html',
            styleUrls: ['./login.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireAuth, ToastController, Router, MenuController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.page.js.map