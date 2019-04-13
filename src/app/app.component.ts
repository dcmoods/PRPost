import { Component, OnInit } from '@angular/core';

import { Platform, MenuController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Route } from '@angular/compiler/src/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'Posts',
      url: '/feed',
      icon: 'list'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }
  
  ngOnInit(){
    // this.router.events.subscribe((event: RouterEvent) => {
    //   if (event instanceof NavigationEnd && event.url === '/login') {
    //     this.menuCtrl.enable(true);
    //   } 
    // });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){
    
    firebase.auth().signOut().then(async () => {

      let toast = await this.toastCtrl.create({
        message: "You have been logged out.",
        duration: 3000
      });
      await toast.present();

      this.router.navigate(["/login"]);
    });
    
  }
}
