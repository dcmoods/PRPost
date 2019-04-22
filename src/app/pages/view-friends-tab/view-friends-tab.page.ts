import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { map } from 'rxjs/operators';

export interface User { 
  userId: string; 
  displayName: string;
  email: string;
  owner: string;
  created: firebase.firestore.FieldValue;
}


export interface Friend { id: string, userId: string; }
export interface FriendId extends Friend { id: string; }


@Component({
  selector: 'app-view-friends-tab',
  templateUrl: './view-friends-tab.page.html',
  styleUrls: ['./view-friends-tab.page.scss'],
})

export class ViewFriendsTabPage implements OnInit {

  private userDoc: AngularFirestoreDocument<User>;
  private friendsCollection: AngularFirestoreCollection<Friend>;
  friends: Observable<FriendId[]>;

  currentUsers: any[] = [];
  UserIds: any[] = [];

  //private friendsCollection: AngularFirestoreCollection<User>;
  //friends: Observable<User[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore) { 
    this.userDoc = this.afs.doc<User>("users/" + this.afAuth.auth.currentUser.uid.toString());
    this.friendsCollection = this.userDoc.collection<Friend>('friends');
    this.friends = this.friendsCollection.valueChanges();
  }

  ngOnInit() {
  }
}
