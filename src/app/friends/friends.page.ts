import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  searchConfig = {
    ...environment.algolia,
    indexName: 'user_search'
  }

  showResults = false;
  friends: any[] = [];
  users: any[] = [];
  search: string = "";
  pageSize: number = 50;
  cursor: any;
  infiniteEvent: any;


  constructor( private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

  ngOnInit() {
    //this.getFriends();
  }

  
  searchChanged(query) {
    if (query.length){
      this.showResults = true;
    } else {
      this.showResults = false;
    }
  }

  addFriend(userId){
    console.log(userId);
  }

  async getUsers(){
    let query = firebase.firestore().collection("users")
    .orderBy("displayName")
    .startAt("displayName")
    .endAt("displayName"+'\uf8ff')
    .limit(25);

    query.get()
    .then((docs) => {

      docs.forEach((doc) => {
        this.users.push(doc);
      })


      console.log(this.users)
    }).catch((err) =>{
      console.log(err)
    })
  }

  async getFriends(){
    this.friends = [];

    let loading = await this.loadingCtrl.create({
      message: "Loading Friends...",
      spinner: 'crescent'
    });
    await loading.present();

    let query = firebase.firestore().collection("users")
      .where("userId", "==", firebase.auth().currentUser.uid.toString())
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
          this.friends.push(doc);
        })

        loading.dismiss();

        this.cursor = this.friends[this.friends.length - 1];

        console.log(this.friends)
      }).catch((err) =>{
        console.log(err)
      })
  }

  
}
