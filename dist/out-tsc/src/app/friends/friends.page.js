import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '../../environments/environment';
var FriendsPage = /** @class */ (function () {
    function FriendsPage(loadingCtrl, toastCtrl) {
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.searchConfig = tslib_1.__assign({}, environment.algolia, { indexName: 'user_search' });
        this.showResults = false;
        this.friends = [];
        this.users = [];
        this.search = "";
        this.pageSize = 50;
    }
    FriendsPage.prototype.ngOnInit = function () {
        //this.getFriends();
    };
    FriendsPage.prototype.searchChanged = function (query) {
        if (query.length) {
            this.showResults = true;
        }
        else {
            this.showResults = false;
        }
    };
    FriendsPage.prototype.addFriend = function (userId) {
        console.log(userId);
    };
    FriendsPage.prototype.getUsers = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                query = firebase.firestore().collection("users")
                    .orderBy("displayName")
                    .startAt("displayName")
                    .endAt("displayName" + '\uf8ff')
                    .limit(25);
                query.get()
                    .then(function (docs) {
                    docs.forEach(function (doc) {
                        _this.users.push(doc);
                    });
                    console.log(_this.users);
                }).catch(function (err) {
                    console.log(err);
                });
                return [2 /*return*/];
            });
        });
    };
    FriendsPage.prototype.getFriends = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, query;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.friends = [];
                        return [4 /*yield*/, this.loadingCtrl.create({
                                message: "Loading Friends...",
                                spinner: 'crescent'
                            })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        query = firebase.firestore().collection("users")
                            .where("userId", "==", firebase.auth().currentUser.uid.toString())
                            .orderBy("created", "desc")
                            .limit(this.pageSize);
                        // query.onSnapshot((snapshot) => {
                        //   let changedDocs = snapshot.docChanges();
                        //   changedDocs.forEach((change) => {
                        //     if(change.type == "added"){
                        //     }
                        //     if(change.type == "modified"){
                        //     }
                        //     if(change.type == "removed"){
                        //     }
                        //   })
                        // });
                        query.get()
                            .then(function (docs) {
                            docs.forEach(function (doc) {
                                _this.friends.push(doc);
                            });
                            loading.dismiss();
                            _this.cursor = _this.friends[_this.friends.length - 1];
                            console.log(_this.friends);
                        }).catch(function (err) {
                            console.log(err);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    FriendsPage = tslib_1.__decorate([
        Component({
            selector: 'app-friends',
            templateUrl: './friends.page.html',
            styleUrls: ['./friends.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [LoadingController, ToastController])
    ], FriendsPage);
    return FriendsPage;
}());
export { FriendsPage };
//# sourceMappingURL=friends.page.js.map