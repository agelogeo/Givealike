import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MyService} from "../../services/auth";

/**
 * Generated class for the VideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage{
  tutorial: string ;
  constructor(public ms:MyService,public navCtrl: NavController, public navParams: NavParams) {

    this.tutorial = this.ms.tutorial;
  }

  ionViewWillLoad(){
    this.tutorial = this.ms.tutorial;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPage');
  }

}
