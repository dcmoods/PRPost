import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument,  } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

export interface User { 
  userId: string; 
  displayName: string;
  email: string;
  owner: string;
  created: firebase.firestore.FieldValue;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  private userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastCtrl: ToastController
  ) { 
    this.userDoc = this.afs.doc<User>("users/" + this.afAuth.auth.currentUser.uid.toString());
    this.user = this.userDoc.valueChanges();
  }

  ngOnInit() {
  }

  submit(user: User){
    this.userDoc.update(user).then(async () => {
      
      let toast = await this.toastCtrl.create({
        message: "Your profile has been updated.",
        duration: 3000
      });
      
      await toast.present();
    }).catch(async (err) => {
      console.log(err.message);
      let toast = await this.toastCtrl.create({
        message: err.message,
        duration: 3000
      });
      
      await toast.present();
    });
  }
}
