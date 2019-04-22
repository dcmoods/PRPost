import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
var ViewFriendsTabPage = /** @class */ (function () {
    function ViewFriendsTabPage(afs) {
        this.afs = afs;
        this.currentUsers = [];
        this.UserIds = [];
        this.friendsCollection = afs.collection('users');
        this.friends = this.friendsCollection.valueChanges();
    }
    ViewFriendsTabPage.prototype.ngOnInit = function () {
        this.getUsers();
    };
    ViewFriendsTabPage.prototype.getUsers = function () {
        var _this = this;
        var docRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
        docRef.get()
            .then(function (doc) {
            var UserIds = doc.data().UserIds;
            if (UserIds !== undefined) {
                UserIds.forEach(function (User) {
                    var UserDoc = firebase.firestore().collection("users").doc(User.userId);
                    UserDoc.get()
                        .then(function (doc) {
                        _this.currentUsers.push(doc.data());
                        doc.data().UserIds.forEach(function (doc) {
                            _this.UserIds.push({ userId: User.userId });
                        });
                        console.log(doc.data());
                    });
                });
            }
        });
    };
    ViewFriendsTabPage.prototype.removeUser = function (User) {
        var _this = this;
        var docRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
        docRef.get()
            .then(function (doc) {
            var index = _this.currentUsers.indexOf(User, 0);
            if (index > -1) {
                _this.currentUsers.splice(index, 1);
            }
            var idIndex = _this.UserIds.indexOf(User.userId, 0);
            if (idIndex > -1) {
                _this.UserIds.splice(idIndex, 1);
            }
            docRef.update({ UserIds: _this.UserIds });
        }).catch(function (err) {
            console.log(err);
        });
    };
    ViewFriendsTabPage = tslib_1.__decorate([
        Component({
            selector: 'app-view-friends-tab',
            templateUrl: './view-friends-tab.page.html',
            styleUrls: ['./view-friends-tab.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore])
    ], ViewFriendsTabPage);
    return ViewFriendsTabPage;
}());
export { ViewFriendsTabPage };
//# sourceMappingURL=view-friends-tab.page.js.map