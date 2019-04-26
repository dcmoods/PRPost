import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument,  } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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
    private httpClient: HttpClient
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

  addFriend(user: User, action: string) {
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

    console.log(user);
    let body = {
      postOwner: id,
      userId: this.afAuth.auth.currentUser.uid,
      action: "follow"
    };

    this.httpClient.post("https://us-central1-prpost-5d828.cloudfunctions.net/updateFollowersOnPosts", JSON.stringify(body), {
      responseType: "text"
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }
  
  removeFriend(userId) {
    this.friendsCollection.doc(userId).delete();
    let body = {
      postOwner: userId,
      userId: this.afAuth.auth.currentUser.uid,
      action: "unfollow"
    };

    this.httpClient.post("https://us-central1-prpost-5d828.cloudfunctions.net/updateFollowersOnPosts", JSON.stringify(body), {
      responseType: "text"
    }).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }
}
