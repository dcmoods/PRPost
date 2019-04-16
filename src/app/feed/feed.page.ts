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
  image: string;

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

      this.getPosts();
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
}
