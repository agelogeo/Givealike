import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";

/**
 * Generated class for the SocialComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'social',
  templateUrl: 'social.html'
})
export class SocialComponent {

  constructor(private viewCtrl: ViewController){}

  onAction(action: string){
    this.viewCtrl.dismiss({action: action});
  }

}
