import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  constructor(private afAuth: AngularFireAuth, private toastCtrl: ToastController, private router: Router, private menuCtrl: MenuController) { }

  ngOnInit() {
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          console.log(user);

          this.toastCtrl.create({
            message: "Welcome " + user.user.displayName,
            duration: 3000
          }).then((toast) => toast.present());        

          this.router.navigate(['/menu/posts'])
        })
        .catch((err) => {
          console.log(err);

          this.toastCtrl.create({
            message: err.message,
            duration: 3000
          }).then((toast) => toast.present());
        })

  }

  gotoSignup() {
    this.router.navigateByUrl('/signup');
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

}
