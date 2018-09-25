import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {AppVersion} from "@ionic-native/app-version";

@Component({
  selector: 'page-popover',
  template: `
    <ion-grid text-center>
      <ion-row>
        <ion-col>
          <h4>About Us</h4>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button ion-button icon-left outline round block color="menuText" (click)="onAction('privacy')"><ion-icon name="lock"></ion-icon>Privacy Policy</button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button ion-button icon-left outline block round color="menuText" (click)="onAction('terms')"><ion-icon name="book"></ion-icon>Terms of use</button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <h4>Feedback</h4>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button ion-button icon-left outline round block color="menuText" (click)="onAction('feedback')"><ion-icon name="contact"></ion-icon>Contact us</button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button ion-button icon-left outline round block color="menuText" (click)="onAction('rate')"><ion-icon name="star"></ion-icon>Rate us</button>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p style="text-align: center">V: {{versionNumber}}</p>
        </ion-col>
      </ion-row>
    </ion-grid>
  `
})

export class PopoverPage{
  versionNumber:any;
  constructor(private viewCtrl: ViewController,private appVersion: AppVersion){

    this.appVersion.getVersionNumber().then(version => {
      this.versionNumber = version;
    });
  }

  onAction(action: string){
    this.viewCtrl.dismiss({action: action});
  }
}
