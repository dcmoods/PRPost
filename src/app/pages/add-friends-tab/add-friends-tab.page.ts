import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { userInfo } from 'os';

export interface User { 
  userId: string; 
  displayName: string;
  email: string;
  owner: string;
  created: firebase.firestore.FieldValue;
  friends: any[];
}

export interface Friend { 
  userId: string; 
  displayName: string;
  email: string;
  owner: string;
  created: firebase.firestore.FieldValue;
}

@Component({
  selector: 'app-add-friends-tab',
  templateUrl: './add-friends-tab.page.html',
  styleUrls: ['./add-friends-tab.page.scss'],
})



export class AddFriendsTabPage implements OnInit {

  private userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  friends: Observable<Friend[]>;
  
  searchConfig = {
    ...environment.algolia,
    indexName: 'user_search'
  }

  showResults = false;
  currentFriends: any[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { 
    // this.friendsCollection = afs.collection<User>('users');
    // this.friends = this.friendsCollection.valueChanges();
    this.userDoc = this.afs.doc<User>("users/" + this.afAuth.auth.currentUser.uid.toString());
    this.user = this.userDoc.valueChanges();
    this.friends = this.userDoc.collection<User>("friends").valueChanges();
    this.user.subscribe((data) => {
      this.currentFriends = data.friends;
      console.log(this.currentFriends);
    });

    this.friends.subscribe((data) => {
      //this.currentFriends = data.friends;
      console.log(data);
    });

 
  }

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
    let user = this.afs.collection("users", ref => ref.where('userId', '==', userId));
    
    //this.userDoc.
    //this.friends = this.
    // let docRef = firebase.firestore().collection("users").doc(this.afAuth.auth.currentUser.uid);
      
    // docRef.get()
    //   .then((doc) => {
    //     //console.log(doc.data());
    //     let friendIds = doc.data().friendIds;
    //     if(friendIds == undefined){
    //       friendIds = [];
    //     }
    //     this.currentFriends.push(userId);
    //     friendIds.push({ userId: userId });
    //     docRef.update({ friendIds: friendIds });
    //   }).catch((err) =>{
    //     console.log(err);
    //   })
  }

  getFriends(){
    let docRef = firebase.firestore().collection("users").doc(this.afAuth.auth.currentUser.uid);
    docRef.get()
      .then((doc) => {
        let friendIds = doc.data().friendIds;
        //console.log(friendIds);
        if(friendIds !== undefined){
          friendIds.forEach((friend) => {
            //console.log(friend.userId);
            this.currentFriends.push(friend.userId);
          });
        }
    })
  }

  
}
