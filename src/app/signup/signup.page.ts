import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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
    private toastCtrl: ToastController,
    private router: Router, 
    private location: Location,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  signUp() {
    // console.log(this.name, this.email, this.password);
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
                   //navigate to the feeds page
                 }
               }
             ]
           });
           alert.present();
 
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
}
