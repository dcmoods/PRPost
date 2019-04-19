import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const env = functions.config();

const client = algoliasearch(env.algolia.appid, env.algolia.apikey);

const index = client.initIndex('user_search');

exports.indexUser = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
        const data = snap.data();
        const objectId = snap.id;

        return index.addObject({
            objectId,
            ...data
        });
    });

exports.unindexUser = functions.firestore
    .document('users/{userId}')
    .onDelete((snap, context) => {
        const objectId = snap.id;

        return index.deleteObject(objectId);
    });