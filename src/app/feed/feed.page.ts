import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { ToastController, LoadingController, ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommentsPage } from '../pages/comments/comments.page';
import { Chance } from 'chance';

export interface Post {
  text: string;
  created: firebase.firestore.FieldValue;
  owner: string;
  owner_name: string;
}

export interface User { 
  userId: string; 
  displayName: string;
  email: string;
  owner: string;
  created: firebase.firestore.FieldValue;
 // followers: firebase.firestore.FieldValue;
}


export interface Friend { id: string, userId: string; }
export interface FriendId extends Friend { id: string; }

export interface PostId extends Post { id: string; }


@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})

export class FeedPage implements OnInit {
  
  private userDoc: AngularFirestoreDocument<User>;
  private friendsCollection: AngularFirestoreCollection<Friend>;
  private followingPostsCollection: AngularFirestoreCollection<Post>;
 
  user: Observable<User>;
  friends: Observable<Friend[]>;
  followingPosts: Observable<PostId[]>

  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string;
  currentFollowers: firebase.firestore.FieldValue;

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private httpClient: HttpClient) { 

      this.userDoc = this.afs.doc<User>("users/" + this.afAuth.auth.currentUser.uid.toString());
      this.user = this.userDoc.valueChanges();

      // this.user.subscribe((data) => {
      //    this.currentFollowers = data.followers;
      // });

      this.friendsCollection = this.userDoc.collection<Friend>('friends');
      this.friends = this.friendsCollection.valueChanges();

      this.followingPostsCollection = this.afs.collection<Post>('posts', 
        ref => ref.where('followers', 'array-contains', this.afAuth.auth.currentUser.uid.toString()).orderBy("created", "asc"));
      //this.followingPosts = this.followingPostsCollection.valueChanges();
      this.followingPosts = this.followingPostsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      this.followingPosts.subscribe((data) => { console.log(data); });
  }

  ngOnInit() {
  }

  // async getPosts(){
  //   this.posts = [];

  //   let loading = await this.loadingCtrl.create({
  //     message: "Loading Feed...",
  //     spinner: 'crescent'
  //   });
  //   await loading.present();

  //   let query = firebase.firestore().collection("posts")
  //     .orderBy("created", "desc")
  //     .limit(this.pageSize);

  //     query.get()
  //     .then((docs) => {

  //       docs.forEach((doc) => {
  //         this.posts.push(doc);
  //       })

  //       loading.dismiss();

  //       this.cursor = this.posts[this.posts.length - 1];

  //       //console.log(this.posts)
  //     }).catch((err) =>{
  //       console.log(err)
  //     })
  // }

  // loadMorePosts(event){
  //   firebase.firestore().collection("posts")
  //     .orderBy("created", "desc")
  //     .startAfter(this.cursor)
  //     .limit(this.pageSize).get()
  //     .then((docs) => {

  //       docs.forEach((doc) => {
  //         this.posts.push(doc);
  //       })
        
  //       console.log(docs)

  //       if(docs.size < this.pageSize){
  //         event.target.disabled = true;
  //         this.infiniteEvent = event;
  //       } else {
  //         event.target.complete();
  //         this.cursor = this.posts[this.posts.length - 1];
  //       }
  //     }).catch((err) =>{
  //       console.log(err)
  //     })
  // }

  // refresh(event){
  //   this.getPosts();
  //   event.complete();
  //   if(this.infiniteEvent){
  //     this.infiniteEvent.enable(true);
  //   }
  // }

  post() {
    if(this.text.length <= 0 ) {
      return;
    }
    
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName,
    }).then(async (doc) => {

      if(this.image) {
        await this.upload(doc.id);
      } 

      this.text = "";
      this.image = undefined;

      let toast = await this.toastCtrl.create({
        message: "Your post has been created.",
        duration: 3000
      });
      
      await toast.present();

    }).catch((err) => {
      console.log(err)
    })
  }

  addPhoto(){
   this.launchCamera();
  }

  launchCamera(){
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imageData) => {
      //console.log(imageData);
      this.image = 'data:image/png;base64,' + imageData;

     }, (err) => {
      // Handle error
      console.log(err);
     });
  }

  upload(name: string){

    return new Promise(async (resolve, reject) => {

      let loading = await this.loadingCtrl.create({
        message: "Uploading image...",
        spinner: "bubbles"
      });

      loading.present();

      let ref = firebase.storage().ref("postImages/" + name);

      let uploadTask = ref.putString(this.image.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot) => {
        console.log(taskSnapshot);
        //let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        //loading.setContent(percentage);

      }, (error) => {
        console.log(error);
      }, () =>{
        console.log("The upload completed.");
  
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          firebase.firestore().collection("posts").doc(name).update({
            image: url
          }).then(() => {
            loading.dismiss();
            resolve();
          }).catch((err) => {
            loading.dismiss();
            reject();
          })
        }).catch((err) => {
          loading.dismiss();
          reject();
        })
      })
    })
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  like(post){
    console.log(post);
    let body = {
      postId: post.id,
      userId: this.afAuth.auth.currentUser.uid,
      action: post.likes && post.likes[this.afAuth.auth.currentUser.uid] == true ? "unlike" : "like"
    };

    this.httpClient.post("https://us-central1-prpost-5d828.cloudfunctions.net/updateLikesCount", JSON.stringify(body), {
      responseType: "text"
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  async comment(post){
    this.actionSheetCtrl.create({
      buttons: [{
          text: "View Comments",
          handler: async () => {
            let modal = await this.modalCtrl.create({
              component: CommentsPage,
              componentProps: {
                "post": post
              }
            });

            modal.present();
          }
        }, {
          text: "New Comment",
          handler: () => {
            this.alertCtrl.create({
              header: "New Comment",
              message: "Type your comment",
              inputs: [{
                name: "comment",
                type: "text"
              }],
              buttons: [{
                text: "Cancel"
              }, {
                text: "Post",
                handler: (data) => {
                  if (data.comment){
                    this.afs.collection("comments").add({
                      text: data.comment,
                      post: post.id,
                      owner: this.afAuth.auth.currentUser.uid,
                      owner_name: this.afAuth.auth.currentUser.displayName,
                      created: firebase.firestore.FieldValue.serverTimestamp()
                    }).then((doc) => {
                      this.toastCtrl.create({
                        message: "Comment was posted successfully!",
                        duration: 3000
                      }).then((toast) => {
                        toast.present();
                      })
                    }).catch((err) => {
                      this.toastCtrl.create({
                        message: err.message,
                        duration: 3000
                      }).then((toast) => {
                        toast.present();
                      })
                    })
                  }
                }
              }]
            }).then((alert) => {
              alert.present();
            })
          }
        }]
    }).then((action) => {
      action.present();
    })
  }

  randomText(){
    const chance = new Chance();
    this.text = chance.sentence();
  }
}
