import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Chance } from 'chance';
var SignupPage = /** @class */ (function () {
    function SignupPage(afAuth, afs, toastCtrl, router, location, alertCtrl) {
        this.afAuth = afAuth;
        this.afs = afs;
        this.toastCtrl = toastCtrl;
        this.router = router;
        this.location = location;
        this.alertCtrl = alertCtrl;
        this.name = "";
        this.email = "";
        this.password = "";
    }
    SignupPage.prototype.ngOnInit = function () {
    };
    SignupPage.prototype.signUp = function () {
        var _this = this;
        this.afAuth.auth
            .createUserWithEmailAndPassword(this.email, this.password)
            .then(function (data) {
            var newUser = data.user;
            newUser.updateProfile({
                displayName: _this.name,
                photoURL: ""
            }).then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var alert, user;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("Profile updated.");
                            return [4 /*yield*/, this.alertCtrl.create({
                                    header: "Account Created",
                                    message: "Your acount has been created successfully.",
                                    buttons: [
                                        {
                                            text: "OK",
                                            handler: function () {
                                                //navigate to the feeds page
                                            }
                                        }
                                    ]
                                })];
                        case 1:
                            alert = _a.sent();
                            alert.present();
                            user = {
                                userId: newUser.uid,
                                email: newUser.email,
                                displayName: newUser.displayName,
                                created: firebase.firestore.FieldValue.serverTimestamp(),
                                owner: newUser.uid,
                            };
                            this.afs.collection('users').doc(user.owner).set(user);
                            return [2 /*return*/];
                    }
                });
            }); }).catch(function (err) {
                console.log(err);
            });
        })
            .catch(function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(err);
                        return [4 /*yield*/, this.toastCtrl.create({
                                message: err.message,
                                duration: 3000
                            })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    SignupPage.prototype.goback = function () {
        this.location.back();
    };
    SignupPage.prototype.addUser = function () {
        var _this = this;
        var chance = new Chance();
        this.afAuth.auth
            .createUserWithEmailAndPassword(chance.email(), '123456')
            .then(function (data) {
            var newUser = data.user;
            newUser.updateProfile({
                displayName: chance.name(),
                photoURL: chance.avatar({ protocol: 'https' })
            }).then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var user;
                return tslib_1.__generator(this, function (_a) {
                    console.log("Profile updated.");
                    user = {
                        userId: newUser.uid,
                        email: newUser.email,
                        displayName: newUser.displayName,
                        created: firebase.firestore.FieldValue.serverTimestamp(),
                        owner: newUser.uid,
                    };
                    this.afs.collection('users').doc(user.owner).set(user);
                    return [2 /*return*/];
                });
            }); }).catch(function (err) {
                console.log(err);
            });
        })
            .catch(function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                console.log(err);
                return [2 /*return*/];
            });
        }); });
    };
    SignupPage = tslib_1.__decorate([
        Component({
            selector: 'app-signup',
            templateUrl: './signup.page.html',
            styleUrls: ['./signup.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireAuth,
            AngularFirestore,
            ToastController,
            Router,
            Location,
            AlertController])
    ], SignupPage);
    return SignupPage;
}());
export { SignupPage };
//# sourceMappingURL=signup.page.js.map