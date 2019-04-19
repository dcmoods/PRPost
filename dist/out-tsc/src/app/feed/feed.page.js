import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as moment from 'moment';
import { Camera } from '@ionic-native/camera/ngx';
var FeedPage = /** @class */ (function () {
    function FeedPage(afAuth, camera, loadingCtrl, toastCtrl) {
        this.afAuth = afAuth;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.text = "";
        this.posts = [];
        this.pageSize = 10;
    }
    FeedPage.prototype.ngOnInit = function () {
        this.getPosts();
    };
    FeedPage.prototype.getPosts = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, query;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.posts = [];
                        return [4 /*yield*/, this.loadingCtrl.create({
                                message: "Loading Feed...",
                                spinner: 'crescent'
                            })];
                    case 1:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _a.sent();
                        query = firebase.firestore().collection("posts")
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
                                _this.posts.push(doc);
                            });
                            loading.dismiss();
                            _this.cursor = _this.posts[_this.posts.length - 1];
                            console.log(_this.posts);
                        }).catch(function (err) {
                            console.log(err);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    FeedPage.prototype.loadMorePosts = function (event) {
        var _this = this;
        firebase.firestore().collection("posts")
            .orderBy("created", "desc")
            .startAfter(this.cursor)
            .limit(this.pageSize).get()
            .then(function (docs) {
            docs.forEach(function (doc) {
                _this.posts.push(doc);
            });
            console.log(docs);
            if (docs.size < _this.pageSize) {
                event.target.disabled = true;
                _this.infiniteEvent = event;
            }
            else {
                event.target.complete();
                _this.cursor = _this.posts[_this.posts.length - 1];
            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    FeedPage.prototype.refresh = function (event) {
        this.getPosts();
        event.complete();
        if (this.infiniteEvent) {
            this.infiniteEvent.enable(true);
        }
    };
    FeedPage.prototype.post = function () {
        var _this = this;
        firebase.firestore().collection("posts").add({
            text: this.text,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            owner: firebase.auth().currentUser.uid,
            owner_name: firebase.auth().currentUser.displayName
        }).then(function (doc) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.image) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.upload(doc.id)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.text = "";
                        this.image = undefined;
                        return [4 /*yield*/, this.toastCtrl.create({
                                message: "Your post has been created.",
                                duration: 3000
                            })];
                    case 3:
                        toast = _a.sent();
                        return [4 /*yield*/, toast.present()];
                    case 4:
                        _a.sent();
                        this.getPosts();
                        return [2 /*return*/];
                }
            });
        }); }).catch(function (err) {
            console.log(err);
        });
    };
    FeedPage.prototype.addPhoto = function () {
        this.launchCamera();
    };
    FeedPage.prototype.launchCamera = function () {
        var _this = this;
        var options = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            targetHeight: 512,
            targetWidth: 512,
            allowEdit: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            //console.log(imageData);
            _this.image = 'data:image/png;base64,' + imageData;
        }, function (err) {
            // Handle error
            console.log(err);
        });
    };
    FeedPage.prototype.upload = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var loading, ref, uploadTask;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadingCtrl.create({
                            message: "Uploading image...",
                            spinner: "bubbles"
                        })];
                    case 1:
                        loading = _a.sent();
                        loading.present();
                        ref = firebase.storage().ref("postImages/" + name);
                        uploadTask = ref.putString(this.image.split(',')[1], "base64");
                        uploadTask.on("state_changed", function (taskSnapshot) {
                            console.log(taskSnapshot);
                            //let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
                            //loading.setContent(percentage);
                        }, function (error) {
                            console.log(error);
                        }, function () {
                            console.log("The upload completed.");
                            uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                                firebase.firestore().collection("posts").doc(name).update({
                                    image: url
                                }).then(function () {
                                    loading.dismiss();
                                    resolve();
                                }).catch(function (err) {
                                    loading.dismiss();
                                    reject();
                                });
                            }).catch(function (err) {
                                loading.dismiss();
                                reject();
                            });
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    FeedPage.prototype.ago = function (time) {
        var difference = moment(time).diff(moment());
        return moment.duration(difference).humanize();
    };
    FeedPage = tslib_1.__decorate([
        Component({
            selector: 'app-feed',
            templateUrl: './feed.page.html',
            styleUrls: ['./feed.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireAuth, Camera,
            LoadingController, ToastController])
    ], FeedPage);
    return FeedPage;
}());
export { FeedPage };
//# sourceMappingURL=feed.page.js.map