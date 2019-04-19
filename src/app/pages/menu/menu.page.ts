import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ToastController, MenuController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath = '';
 
  pages = [
    {
      title: 'Posts',
      url: '/menu/posts'
    },
    {
      title: 'Friends',
      url: '/menu/friends'
    }
  ];

  constructor(private router: Router, private toastCtrl: ToastController, private menuCtrl: MenuController) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  
  ngOnInit() {
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
