import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import firebase from 'firebase';
import {MyService} from "../services/auth";
import {MainPage} from "../pages/main/main";
import {AndroidPermissions} from "@ionic-native/android-permissions";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  mainPage:any = MainPage;
  @ViewChild('nav') nav: NavController;

  constructor(
              platform: Platform,
              statusBar: StatusBar,
              private androidPermissions: AndroidPermissions) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide();

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.GET_ACCOUNTS).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.GET_ACCOUNTS)
      );

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.USE_CREDENTIALS).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.USE_CREDENTIALS)
      );

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );



    });




  }




}

