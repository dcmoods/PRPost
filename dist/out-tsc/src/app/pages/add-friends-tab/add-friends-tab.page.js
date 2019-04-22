import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '../../../environments/environment';
var AddFriendsTabPage = /** @class */ (function () {
    function AddFriendsTabPage(afAuth, afs) {
        var _this = this;
        this.afAuth = afAuth;
        this.afs = afs;
        this.searchConfig = tslib_1.__assign({}, environment.algolia, { indexName: 'user_search' });
        this.showResults = false;
        this.currentFriends = [];
        // this.friendsCollection = afs.collection<User>('users');
        // this.friends = this.friendsCollection.valueChanges();
        this.userDoc = this.afs.doc("users/" + this.afAuth.auth.currentUser.uid.toString());
        this.user = this.userDoc.valueChanges();
        this.friends = this.userDoc.collection("friends").valueChanges();
        this.user.subscribe(function (data) {
            _this.currentFriends = data.friends;
            console.log(_this.currentFriends);
        });
        this.friends.subscribe(function (data) {
            //this.currentFriends = data.friends;
            console.log(data);
        });
    }
    AddFriendsTabPage.prototype.ngOnInit = function () {
        //this.getFriends();
    };
    AddFriendsTabPage.prototype.searchChanged = function (query) {
        if (query.length) {
            this.showResults = true;
        }
        else {
            this.showResults = false;
        }
    };
    AddFriendsTabPage.prototype.addFriend = function (userId) {
        console.log(userId);
        var user = this.afs.collection("users", function (ref) { return ref.where('userId', '==', userId); });
        //this.userDoc.
        //this.friends = this.
        // let docRef = firebase.firestore().collection("users").doc(this.afAuth.auth.currentUser.uid);
        // docRef.get()
        //   .then((doc) => {
        //     //console.log(doc.data());
        //     let friendIds = doc.data().friendIds;
        //     if(friendIds == undefined){
        //       friendIds = [];
        //     }
        //     this.currentFriends.push(userId);
        //     friendIds.push({ userId: userId });
        //     docRef.update({ friendIds: friendIds });
        //   }).catch((err) =>{
        //     console.log(err);
        //   })
    };
    AddFriendsTabPage.prototype.getFriends = function () {
        var _this = this;
        var docRef = firebase.firestore().collection("users").doc(this.afAuth.auth.currentUser.uid);
        docRef.get()
            .then(function (doc) {
            var friendIds = doc.data().friendIds;
            //console.log(friendIds);
            if (friendIds !== undefined) {
                friendIds.forEach(function (friend) {
                    //console.log(friend.userId);
                    _this.currentFriends.push(friend.userId);
                });
            }
        });
    };
    AddFriendsTabPage = tslib_1.__decorate([
        Component({
            selector: 'app-add-friends-tab',
            templateUrl: './add-friends-tab.page.html',
            styleUrls: ['./add-friends-tab.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireAuth,
            AngularFirestore])
    ], AddFriendsTabPage);
    return AddFriendsTabPage;
}());
export { AddFriendsTabPage };
//# sourceMappingURL=add-friends-tab.page.js.map