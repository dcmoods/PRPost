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

exports.unindexUser = functions.firestore
    .document('users/{userId}')
    .onDelete((snap, context) => {
        const objectId = snap.id;

        return index.deleteObject(objectId);
    });


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
          .then(() => {
            response.status(200).send('Done');
          })
          .catch(error => {
            response.status(error.code).send(error.message);
          })
      })
      .catch(error => {
        response.status(error.code).send(error.message);
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

    return true;
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
    console.log(request.body);
    let body: any;
    if (typeof (request.body) === 'string') {
      body = JSON.parse(request.body);
    } else {
      body = request.body;
    }
    const postOwner = body.postOwner;
    const userId: string = body.userId;
    const action = body.action; // 'follow' or 'unfollow'

    admin.firestore().collection('posts')
      .where('owner', '==', postOwner)
      .get()
      .then((docs) => {
        

        docs.foreach((doc) => {
          let updateData:any = {};
          
          if(action == "follow"){
            updateData[`following.${userId}`] = true;
          } else {
            updateData[`following.${userId}`] = false;
          } 
          admin.firestore().collection('posts').doc(doc).update(updateData)
          .then(() => {
            response.status(200).send('Done');
          })
          .catch(error => {
            response.status(error.code).send(error.message);
          })
        })
      })
      .catch(error => {
        response.status(error.code).send(error.message);
      });
    });
})