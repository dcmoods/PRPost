import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToastController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as moment from 'moment';
import { PostsService } from '../services/posts.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

export interface Post {
  text: string;
  created: firebase.firestore.FieldValue;
  owner: string;
  owner_name: string;
}

export interface PostId extends Post { id: string; }

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})

export class FeedPage implements OnInit {
  

  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;

  constructor(private afAuth: AngularFireAuth, private camera: Camera,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.getPosts();
  }

  async getPosts(){
    this.posts = [];

    let loading = await this.loadingCtrl.create({
      message: "Loading Feed...",
      spinner: 'crescent'
    });
    await loading.present();

    let query = firebase.firestore().collection("posts")
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
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        loading.dismiss();

        this.cursor = this.posts[this.posts.length - 1];

        console.log(this.posts)
      }).catch((err) =>{
        console.log(err)
      })
  }

  loadMorePosts(event){
    firebase.firestore().collection("posts")
      .orderBy("created", "desc")
      .startAfter(this.cursor)
      .limit(this.pageSize).get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })
        
        console.log(docs)

        if(docs.size < this.pageSize){
          event.target.disabled = true;
          this.infiniteEvent = event;
        } else {
          event.target.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }
      }).catch((err) =>{
        console.log(err)
      })
  }

  refresh(event){
    //this.posts = [];

    this.getPosts();
    event.complete();
    if(this.infiniteEvent){
      this.infiniteEvent.enable(true);
    }
  }

  post(){
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then(async (doc) => {
      console.log(doc)
      this.text = "";

      let toast = await this.toastCtrl.create({
        message: "Your post has been created.",
        duration: 3000
      });
      await toast.present();

      this.getPosts();
    }).catch((err) => {
      console.log(err)
    })

  }

  // getPosts() {
  //   // let loading = this.loadingCtrl.create({
  //   //   content: "Loading Feed..."
  //   // });
  //   // loading.present();

  //   this.postCollection = this.afs.collection<Post>("posts",
  //     ref => ref.orderBy("created", "desc").startAfter(this.cursor).limit(this.pageSize));

  //   //this.posts = this.postCollection.valueChanges();
  //   this.posts = this.postCollection.snapshotChanges().pipe(
  //     map(actions => actions.map(a => {
  //       const data = a.payload.doc.data() as Post;
  //       const id = a.payload.doc.id;
  //       return { id, ...data };
  //     }))
  //   );
  //   this.posts.subscribe(result => { this.cursor = result.length; });
  // }

  // loadMorePosts(event) {
  //   this.postService.next();
  //   event.target.complete();
  // }
  // async post() {
  //   this.postCollection.add({
  //     text: this.text,
  //     created: firebase.firestore.FieldValue.serverTimestamp(),
  //     owner: firebase.auth().currentUser.uid,
  //     owner_name: firebase.auth().currentUser.displayName
  //   }).then(async () => {
  //     let toast = await this.toastCtrl.create({
  //       message: "Your post has been created.",
  //       duration: 3000
  //     });
  //     toast.present();
  //   }).catch((err) => {
  //     console.log(err);
  //   })

  // }

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
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log(imageData);
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
      console.log(err);
     });
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }
}
