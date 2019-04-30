import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';
import { Chance } from 'chance';
import { Firebase } from '@ionic-native/firebase/ngx';
import { CommentsPage } from '../comments/comments.page';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.page.html',
  styleUrls: ['./post-feed.page.scss'],
})
export class PostFeedPage implements OnInit {
  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string;

  constructor(
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private httpClient: HttpClient,
    private firebaseCordova: Firebase) { }

  ngOnInit() {
    this.getPosts();

    this.firebaseCordova.getToken().then((token) => {
      console.log(token)

      this.updateToken(token, firebase.auth().currentUser.uid);

    }).catch((err) => {
      console.log(err)
    })
  }

  updateToken(token: string, uid: string){

    firebase.firestore().collection("users").doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
      merge: true
    }).then(() => {
      console.log("token saved to cloud firestore");
    }).catch(err => {
      console.log(err);
    })

  }

  async getPosts() {

    this.posts = [];

    let loading = await this.loadingCtrl.create({
      message: "Loading Posts...",
      spinner: 'crescent'
    });

    loading.present();

    let query = firebase.firestore().collection("posts")
      .where("followers", "array-contains", firebase.auth().currentUser.uid)
      .orderBy("created", "desc").limit(this.pageSize);

    query.onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
        }

        if (change.type == "modified") {
          for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == change.doc.id) {
              this.posts[i] = change.doc;
            }
          }
        }

        if (change.type == "removed") {
          // TODO
        }
      })
    })

    query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        loading.dismiss();

        this.cursor = this.posts[this.posts.length - 1];

        console.log(this.posts)

      }).catch((err) => {
        console.log(err)
      })
  }

  loadMorePosts(event) {

    firebase.firestore().collection("posts")
      .where("followers", "array-contains", firebase.auth().currentUser.uid)
      .orderBy("created", "desc").startAfter(this.cursor).limit(this.pageSize).get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })

        console.log(this.posts)

        if (docs.size < this.pageSize) {
          event.target.disabled = true;
          this.infiniteEvent = event;
        } else {
          event.target.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }

      }).catch((err) => {
        console.log(err)
      })

  }

  refresh(event) {
    this.getPosts();
      event.target.complete();
      if(this.infiniteEvent){
        this.infiniteEvent.target.disabled = false;
      }

  }


  async  post() {

    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then(async (doc) => {
      console.log(doc)

      if (this.image) {
        await this.upload(doc.id)
      }

      this.text = "";
      this.image = undefined;

      let toast = await this.toastCtrl.create({
        message: "Your post has been created successfully.",
        duration: 3000
      });
      toast.present();

      this.getPosts();
    }).catch((err) => {
      console.log(err)
    })

  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  addPhoto() {
    this.launchCamera();
  }

  launchCamera() {
    let options: CameraOptions = {
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

  upload(name: string) {

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

  async like(post) {

    let body = {
      postId: post.id,
      userId: firebase.auth().currentUser.uid,
      action: post.data().likes && post.data().likes[firebase.auth().currentUser.uid] == true ? "unlike" : "like"
    }

    console.log(body);

    let toast = await this.toastCtrl.create({
      message: "Updating like... Please wait."
    });

    toast.present();

    this.httpClient.post("https://us-central1-prpost-5d828.cloudfunctions.net/updateLikesCount", JSON.stringify(body), {
      responseType: "text"
    }).subscribe((data) => {
      console.log(data)

      toast.message = "Like updated!";
      setTimeout(() => {
        toast.dismiss();
      }, 3000)

    }, (error) => {
      toast.message = "An error has occured. Please try again later.";
      setTimeout(() => {
        toast.dismiss();
      }, 3000)
      console.log(error)
    })

  }

  comment(post) {

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
                    firebase.firestore().collection("comments").add({
                      text: data.comment,
                      post: post.id,
                      owner: firebase.auth().currentUser.uid,
                      owner_name: firebase.auth().currentUser.displayName,
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
