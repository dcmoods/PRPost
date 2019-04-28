import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Chance } from 'chance';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  name: string = "";
  email: string = "";
  password: string = "";

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastCtrl: ToastController,
    private router: Router, 
    private location: Location,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  signUp() {
    this.afAuth.auth
     .createUserWithEmailAndPassword(this.email, this.password)
       .then((data) => {
 
         let newUser: firebase.User = data.user;
         newUser.updateProfile({
           displayName: this.name,
           photoURL: ""
         }).then(async () => {
           console.log("Profile updated.");

          let alert = await this.alertCtrl.create({
             header: "Account Created",
             message: "Your acount has been created successfully.",
             buttons: [
               {
                 text: "OK",
                 handler: () => {
                   this.router.navigate(['/menu/post-feed'])
                 }
               }
             ]
           });
           alert.present();
 
           const user =  {
            userId: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            owner: newUser.uid,
            followers: firebase.firestore.FieldValue.arrayUnion(newUser.uid)
          }

          this.afs.collection('users').doc(user.owner).set(user);
          // firebase.firestore().collection("users").add({
          //   userId: newUser.uid,
          //   email: newUser.email,
          //   displayName: newUser.displayName,
          //   created: firebase.firestore.FieldValue.serverTimestamp(),
          //   owner: newUser.uid,
          // }).then(async (doc) => {
          //   console.log(doc)
          // }).catch((err) => {
          //   console.log(err)
          // })
         }).catch((err) => {
           console.log(err);
         });

       })
       .catch(async (err) => {
         console.log(err);
         let toast = await this.toastCtrl.create({
           message: err.message,
           duration: 3000
         });
         toast.present();
       });
   }
 
   goback() {
     this.location.back();
   }

   addUser() {
    const chance = new Chance();
    this.afAuth.auth
     .createUserWithEmailAndPassword(chance.email(), '123456')
       .then((data) => {
 
         let newUser: firebase.User = data.user;
         newUser.updateProfile({
           displayName: chance.name(),
           photoURL: chance.avatar({protocol: 'https'})
         }).then(async () => {
           console.log("Profile updated.");
          
           const user =  {
             userId: newUser.uid,
             email: newUser.email,
             displayName: newUser.displayName,
             created: firebase.firestore.FieldValue.serverTimestamp(),
             owner: newUser.uid,
             followers: firebase.firestore.FieldValue.arrayUnion(newUser.uid)
           }

           this.afs.collection('users').doc(user.owner).set(user);

         }).catch((err) => {
           console.log(err);
         });
         
       })
       .catch(async (err) => {
         console.log(err);
       });
   }
    
}
