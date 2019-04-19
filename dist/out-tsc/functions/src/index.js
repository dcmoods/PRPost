import * as tslib_1 from "tslib";
import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var env = functions.config();
var client = algoliasearch(env.algolia.appid, env.algolia.apikey);
var index = client.initIndex('user_search');
exports.indexUser = functions.firestore
    .document('users/{userId}')
    .onCreate(function (snap, context) {
    var data = snap.data();
    var objectId = snap.id;
    return index.addObject(tslib_1.__assign({ objectId: objectId }, data));
});
exports.unindexUser = functions.firestore
    .document('users/{userId}')
    .onDelete(function (snap, context) {
    var objectId = snap.id;
    return index.deleteObject(objectId);
});
//# sourceMappingURL=index.js.map