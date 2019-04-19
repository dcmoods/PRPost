import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export interface User { 
  userId: string; 
  displayName: string;
  email: string;
  owner: string;
  created: firebase.firestore.FieldValue;
}

@Component({
  selector: 'app-view-friends-tab',
  templateUrl: './view-friends-tab.page.html',
  styleUrls: ['./view-friends-tab.page.scss'],
})

export class ViewFriendsTabPage implements OnInit {

  currentUsers: any[] = [];
  UserIds: any[] = [];

  private friendsCollection: AngularFirestoreCollection<User>;
  friends: Observable<User[]>;

  constructor(private readonly afs: AngularFirestore) { 
    this.friendsCollection = afs.collection<User>('users');
    this.friends = this.friendsCollection.valueChanges();
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    let docRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
    docRef.get()
      .then((doc) => {
        let UserIds = doc.data().UserIds;
        if(UserIds !== undefined){
          UserIds.forEach((User) => {
            let UserDoc = firebase.firestore().collection("users").doc(User.userId);
            UserDoc.get()
              .then((doc) => {
                this.currentUsers.push(doc.data());
                doc.data().UserIds.forEach((doc) => {
                  this.UserIds.push({ userId: User.userId });
                })
                console.log(doc.data());
              });
          });
        }
    })
    
  }

  removeUser(User){
    let docRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

    docRef.get()
      .then((doc) => {

        const index = this.currentUsers.indexOf(User, 0);
        if (index > -1) {
          this.currentUsers.splice(index, 1);
        }

        const idIndex = this.UserIds.indexOf(User.userId, 0);
        if (idIndex > -1) {
          this.UserIds.splice(idIndex, 1);
        }

        docRef.update({ UserIds: this.UserIds });
      }).catch((err) =>{
        console.log(err);
      })
  }
}
