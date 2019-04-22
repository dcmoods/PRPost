import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument,  } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { userInfo } from 'os';
import { map, switchMap } from 'rxjs/operators';

export interface User { 
  userId: string; 
  displayName: string;
  email: string;
  owner: string;
  created: firebase.firestore.FieldValue;
  followers: firebase.firestore.FieldValue;
}

export interface Friend { 
  id: string,
  userId: string; 
  displayName: string;
  email: string;
  created: firebase.firestore.FieldValue;
}

export interface FriendId extends Friend { id: string; }

@Component({
  selector: 'app-add-friends-tab',
  templateUrl: './add-friends-tab.page.html',
  styleUrls: ['./add-friends-tab.page.scss'],
})



export class AddFriendsTabPage implements OnInit {

  private userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  private friendsCollection: AngularFirestoreCollection<Friend>;
  friends: Observable<FriendId[]>;
  
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
    this.userDoc = this.afs.doc<User>("users/" + this.afAuth.auth.currentUser.uid.toString());
    this.user = this.userDoc.valueChanges();
    this.friendsCollection = this.userDoc.collection<Friend>('friends');
    this.friends = this.friendsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Friend;
        const id = a .payload.doc.id;  
        return { id, ...data};
      }))
    );
  }

  ngOnInit() {
    this.friends.subscribe((data) => {
        this.currentFriends = data;
      });
  }

  searchChanged(query) {
    if (query.length){
      this.showResults = true;
    } else {
      this.showResults = false;
    }
  }

  alreadyFriends(userId){
    var notFriends = true;
    for(var i = 0; i < this.currentFriends.length; i++) {
        if (this.currentFriends[i].userId == userId) {
            notFriends = false;
            break;
        }
    }
    return notFriends;
  }

  addFriend(user: User) {
    //console.log(user);
    const id = user.userId.toString();
    const friend: Friend = { 
      id: id,
      userId: user.userId,
      email: user.email,
      displayName: user.displayName,
      created: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    this.friendsCollection.doc(id).set(friend);

    this.afs.collection("users").doc(id).update({ 
      followers: firebase.firestore.FieldValue.arrayUnion(this.afAuth.auth.currentUser.uid.toString()) 
    });
  }
  
  removeFriend(userId) {
    this.friendsCollection.doc(userId).delete();
  }
}
