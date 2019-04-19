import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
var PostsService = /** @class */ (function () {
    function PostsService(afs) {
        this.afs = afs;
    }
    // You need to return the doc to get the current cursor.
    PostsService.prototype.getCollection = function (ref, queryFn) {
        return this.afs.collection(ref, queryFn).snapshotChanges().map(function (actions) {
            return actions.map(function (a) {
                var data = a.payload.doc.data();
                var id = a.payload.doc.id;
                var doc = a.payload.doc;
                return tslib_1.__assign({ id: id }, data, { doc: doc });
            });
        });
    };
    // In your first query you subscribe to the collection and save the latest entry
    PostsService.prototype.first = function () {
        var _this = this;
        this._data = new BehaviorSubject([]);
        this.data = this._data.asObservable();
        var postsRef = this.getCollection('posts', function (ref) { return ref
            .orderBy('created', 'desc')
            .limit(6); })
            .subscribe(function (data) {
            _this.latestEntry = data[data.length - 1].doc;
            _this._data.next(data);
            console.log(data);
            console.log(_this.latestEntry);
        });
    };
    PostsService.prototype.next = function () {
        var _this = this;
        var postsRef = this.getCollection('posts', function (ref) { return ref
            .orderBy('created', 'desc')
            // Now you can use the latestEntry to query with startAfter
            .startAfter(_this.latestEntry)
            .limit(6); })
            .subscribe(function (data) {
            if (data.length) {
                // And save it again for more queries
                _this.latestEntry = data[data.length - 1].doc;
                _this._data.next(data);
                console.log(data);
                console.log(_this.latestEntry);
            }
        });
    };
    PostsService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore])
    ], PostsService);
    return PostsService;
}());
export { PostsService };
//# sourceMappingURL=posts.service.js.map