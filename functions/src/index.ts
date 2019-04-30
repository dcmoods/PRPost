import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const env = functions.config();
const corsHandler = cors({origin: true});

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

  exports.updateIndexedUser = functions.firestore
    .document('users/{userId}')
    .onUpdate((snap, context) => {
        const data = snap.after.data();
        const objectId = snap.before.id;
        
        return index.saveObject({
            objectID: objectId,
            ...data
        });
    });

exports.unindexUser = functions.firestore
    .document('users/{userId}')
    .onDelete((snap, context) => {
        const objectId = snap.id;

        return index.deleteObject(objectId);
    });


function sendNotification(ownerId: string, type: string) {
  console.log(ownerId, type);
  // return new Promise((resolve, reject) =>{
  //   resolve("It worked!");
  //   reject("error");
  // })
  return new Promise((resolve, reject) => {
    let query = admin.firestore().collection("users").doc(ownerId);
    
    
    query.get().then((doc) => {
      const docData: any = doc.data();
      if(doc.exists && docData.token) {
        if(type == 'newComment') {
          admin.messaging().sendToDevice(docData.token, {
            data: {
              title: "A new comment was made on your post.",
              sound: "default",
              body: "Tap to view"
            }
          }).then((sent) => {
            resolve(sent);
          }).catch((err) => {
            reject(err);
          });
          
        } else if (type == "newLike") {
          admin.messaging().sendToDevice(docData.token, {
            data: {
              title: "Someone liked your post.",
              sound: "default",
              body: "Tap to view"
            }
          }).then((sent) => {
            resolve(sent);
          }).catch((err) => {
            reject(err);
          });
        } else {
          reject("not found");
        }
      } else {
        reject("not found");
      }
    }).catch((err) => {
      reject(err);
    });
    resolve("success");
  });

}

export const updateLikesCount = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    console.log(request.body);
    let body: any;
    if (typeof (request.body) === 'string') {
      body = JSON.parse(request.body);
    } else {
      body = request.body;
    }
    const postId = body.postId;
    const userId: string = body.userId;
    const action = body.action; // 'like' or 'unlike'

    admin.firestore().collection('posts').doc(postId).get()
      .then((data: any) => {
        let likesCount: number = data.data().likesCount || 0;
        let likes: any = data.data().likes || [];
        console.log(likes);

        let updateData:any = {};

        if(action == "like"){
            updateData["likesCount"] = ++likesCount;
            updateData[`likes.${userId}`] = true;
        } else {
            updateData["likesCount"] = --likesCount;
            updateData[`likes.${userId}`] = false;
        }
        admin.firestore().collection('posts').doc(postId).update(updateData)
          .then(async () => {

            if(action == 'like') {
              await sendNotification(data.data().owner, "newLike")
              .then(() => {
                response.status(200).send('Done');
              })
                .catch((error) => {
                response.status(500).send(error.message);
              });
            }

            response.status(200).send('Done');
          })
          .catch((error) => {
            response.status(500).send(error.message);
          })
      })
      .catch((error) => {
        response.status(500).send(error.message);
      });
    });
})

export const updateCommentsCount = functions.firestore.document("comments/{commentId}").onCreate(async (event) => {
  const data: any = event.data();

  const postId = data.post;

  const doc = await admin.firestore().collection("posts").doc(postId).get();

  if(doc.exists){
    const docData: any = doc.data();
    let commentsCount: number = docData.commentsCount || 0;
    commentsCount++;

    await admin.firestore().collection("posts").doc(postId).update({
      "commentsCount": commentsCount
    });

    return await sendNotification(docData.owner, "newComment");
  } else {
    return false;
  }

})

export const updatePostFollowers = functions.firestore.document("posts/{postId}").onCreate(async (event, context) => {
  const data: any = event.data();
  console.log(context);
  const postId = context.params.postId;
  const userId: string = data.owner;

  const doc = await admin.firestore().collection("users").doc(userId).get();

  if (doc.exists) {
    const docData: any = doc.data();
    let followers: string[] = docData.followers || [];

    await admin.firestore().collection("posts").doc(postId).update({
      "followers": followers
    });

    return true;
  } else {
    return false;
  }
})

export const updateFollowersOnPosts = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {

    let body: any;
    if (typeof (request.body) === 'string') {
      body = JSON.parse(request.body);
    } else {
      body = request.body;
    }

    const postOwner = body.postOwner;
    const userId: string = body.userId;
    const action = body.action; // 'follow' or 'unfollow'

    let query = admin.firestore().collection('posts')
      .where('owner', '==', postOwner);

      query.get().then((docs) => {
        docs.forEach((doc) => {
          let updateData:any = {};
          console.log(doc);

          if(action == "follow"){
            updateData['followers'] = admin.firestore.FieldValue.arrayUnion(userId);
          } else {
            updateData['followers'] = admin.firestore.FieldValue.arrayRemove(userId);
          }
          admin.firestore().collection('posts').doc(doc.id).update(updateData)
          .then(() => {
            console.log("Done");
          })
          .catch(error => {
            response.status(500).send(error.message);
          })
        });

        response.status(200).send('Done');
      })
      .catch(error => {
        response.status(500).send(error.message);
      });

    });

})