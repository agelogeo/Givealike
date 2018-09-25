import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController, ModalController,
  NavController,
  NavParams,
  PopoverController,
  ToastController
} from 'ionic-angular';
import {MyService} from "../../services/auth";
import {GooglePlus} from "@ionic-native/google-plus";
import {HomePage} from "../home/home";
import {PrivacyPage} from "../privacy/privacy";
import {HttpClient} from "@angular/common/http";
import {AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig} from "@ionic-native/admob-free";
import {Clipboard} from "@ionic-native/clipboard";
import {Http} from "@angular/http";
import firebase from 'firebase';
import {Storage} from "@ionic/storage";
import {PopoverPage} from "../../components/popover/popover";
import {TermsPage} from "../terms/terms";
import { AppRate } from '@ionic-native/app-rate';
import {SocialComponent} from "../../components/social/social";
import {SocialSharing} from "@ionic-native/social-sharing";
import {VideoPage} from "../video/video";


/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  /*user:{
    email :string,
    name:string,
    pic:string
  }*/
  host:string = "";
  link:string = "";
  loading : any;
  isBalanceOkay: boolean = true;
  emptyAd: boolean = true;
  wrongLink: boolean = false;
  counter:number = 0;
  minumum_balance:number = 0.1;

  // REWARDS
  // M id : ca-app-pub-4781041300358039/4943879735
  rewardId:string = 'ca-app-pub-4781041300358039/4943879735';
  // T id : ca-app-pub-3940256099942544/5224354917
  //rewardId:string = 'ca-app-pub-3940256099942544/5224354917';

  // BANNERS
  // M id : ca-app-pub-4781041300358039/7468703746
  bannerId:string = 'ca-app-pub-4781041300358039/7468703746';
  // T id : ca-app-pub-3940256099942544/6300978111
  //bannerId:string = 'ca-app-pub-3940256099942544/6300978111';
  testing:boolean = false;
  isAdReady:boolean = false;

  mail :string;
  name:string;
  pic:string;

  constructor(public httpClient: HttpClient,
              public admobFree: AdMobFree,
              private loadingCtrl: LoadingController,
              private toastCtrl : ToastController,
              private clipboard: Clipboard,
              public googlePlus: GooglePlus,
              public myService:MyService,
              public navCtrl: NavController,
              private alertCtrl:AlertController,
              private storage: Storage,
              public popoverCtrl: PopoverController,
              public modalCtrl: ModalController,
              private appRate: AppRate,
              private socialSharing: SocialSharing) {


    this.presentAlert();


    this.mail =this.myService.json.email;
    this.name =this.myService.json["displayName"];
    this.pic = this.myService.json["imageUrl"];
    this.showBannerAd();
    this.checkBalance();





    const videoConfig: AdMobFreeRewardVideoConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      id: this.rewardId,
      autoShow: false,
      isTesting :this.testing
    };
    this.admobFree.rewardVideo.config(videoConfig);

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_REWARD).subscribe(() => {
      const toast = this.toastCtrl.create({
        message: 'Congratulations. You will receive your reward soon.',
        showCloseButton: true,
        closeButtonText: 'Ok',
        position : 'top'
      });
      toast.present();
      this.loading.dismiss();
      this.getLikes();
    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_CLOSE).subscribe(() => {

      this.loading.dismiss();
      this.prepareAd().catch();
    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_LOAD).subscribe(() => {
      const toast = this.toastCtrl.create({
        message: 'Video loaded.',
        position: 'bottom',
        duration: 1000
      });
      toast.present();
      this.loading.dismiss();
      this.emptyAd = false;
    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_LOAD_FAIL).subscribe(() => {
      const toast = this.toastCtrl.create({
        message: 'Please try again later.',
        showCloseButton: true,
        closeButtonText: 'Ok',
        duration: 2000
      });
      toast.present();
      this.loading.dismiss();
      this.emptyAd = true;
    });

  }

  ionViewWillEnter() {
    //this.getTutorial(this.myService);
    this.getGlobalSettings(this.myService);
    //this.getHost(this.myService);
    this.counter=this.getFirebaseCounter(this.myService.getActiveUser().uid,this.myService);
    console.log('ionViewDidLoad MainPage');
  }

  onLogOut(){
    this.googlePlus.logout();
    firebase.auth().signOut();
    this.storage.remove('json');
    this.navCtrl.setRoot(HomePage);
  }

  onPrivacy(){
    this.navCtrl.push(PrivacyPage);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'WARNING !!',
      subTitle: 'We don\'t need your account credentials.',
      message : 'Givealike will NEVER ask you for your username or password. We ONLY need a link to send your reward.',
      buttons: ['I understand.']
    });
    alert.present();
  }

  presentSocial(myEvent : MouseEvent){
    //alert(this.myService.host);
    //
    // alert(this.myService.maxLimit);
    const popover = this.popoverCtrl.create(SocialComponent);
    popover.present({ev: myEvent});
    popover.onDidDismiss(
      data => {
        if (data == null) {

        }else{
          if (data.action == "android"){
            this.socialSharing.share('Givealike helps you promote your social profile on your favorite social network. It provides you the easiest way to get unlimited free likes on the photo of your preference.','Free Likes - Givealike','assets/imgs/logo.png','https://play.google.com/store/apps/details?id=gr.givealike.givealike').then(() => {
              // Success!
            }).catch(() => {
              // Error!
            });
          } else if (data.action == "ios"){
            this.socialSharing.share('Givealike helps you promote your social profile on your favorite social network. It provides you the easiest way to get unlimited free likes on the photo of your preference.','Free Likes - Givealike','assets/imgs/logo.png','https://play.google.com/store/apps/details?id=gr.givealike.givealike').then(() => {
              // Success!
            }).catch(() => {
              // Error!
            });
          }
        }
      }
    )
  }

  presentPopover(myEvent : MouseEvent) {
    const popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ev: myEvent});
    popover.onDidDismiss(
      data => {
        if (data == null) {

        }else{
          if (data.action == "privacy"){
            this.navCtrl.push(PrivacyPage);
           /* let profileModal = this.modalCtrl.create(PrivacyPage);
            profileModal.present();*/
          } else if (data.action == "terms"){
            this.navCtrl.push(TermsPage);
           /* let profileModal = this.modalCtrl.create(TermsPage);
            profileModal.present();*/
          }else if (data.action == "feedback"){
            this.showFeedbackPrompt();
          } else if (data.action == "rate"){
            this.appRate.preferences.storeAppURL = {
              ios: '<app_id>',
              android: 'market://details?id=gr.givealike.givealike',
              windows: 'ms-windows-store://review/?ProductId=<store_id>'
            };
            this.appRate.navigateToAppStore();
          }
        }
      }
    )
  }

  onInstructions(){
    this.navCtrl.push(VideoPage).catch(e => alert(e));
  }

  onInstructions1(){
    const alert = this.alertCtrl.create({
      title: 'Instructions',
      subTitle: '♥ Go to your post/picture<br>' +
      '♥ Click ⁝ above the post<br>' +
      '♥ Click "Copy Link"<br> ' +
      '♥ Click "Paste" button below<br>' +
      '♥ Click "Get Likes"<br><br>' +
      '⚠ Profile must be PUBLIC!"<br>',


      buttons: [
        {
          text: 'VIDEO TUTORIAL',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
            this.navCtrl.push(VideoPage);
          }
        },
        {
          text: 'I got it!',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  checkLink(){
    if(!this.isLinkInvalid())
      this.prepareAd();
  }

  onPaste(){
    this.clipboard.paste().then(
      (resolve: string) => {
        this.link = resolve;

        if(!this.isLinkInvalid())
          this.prepareAd();

      },
      (reject: string) => {
        const toast = this.toastCtrl.create({
          message: 'Copy a URL first',
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 3000
        });
        toast.present();
      }
    ).catch();


  }

  showAd(){
    this.admobFree.rewardVideo.show().catch();
  }

  async prepareAd() {
    //try {
    this.loading = this.loadingCtrl.create({
      content: 'Loading ads...'
    });

    this.loading.present();

    if(this.isBalanceOkay){

      this.admobFree.rewardVideo.prepare()
        .then(() => {
          // banner Ad is ready


          //if(this.admobFree.rewardVideo.isReady())
        })
        .catch(e => {
        });
    }

    setTimeout(() => {
      this.loading.dismiss();

    }, 3000);
  }

  isValid(){
    if(this.link.startsWith('https://www.') && this.link.length>30 && this.link.slice(21,25).match('.com') && this.isBalanceOkay && !this.emptyAd && !this.isMaxReached()){
      return true;
    }
    return false;
  }

  isLinkInvalid(){
    if(this.link.startsWith('https://www.') && this.link.length>35 && this.link.slice(21,25).match('.com')){
      this.wrongLink = false;
      return false;
    }else if(this.link.length>20){
      this.wrongLink = true;
      return true;
    }
  }

  getLikes(){

    this.httpClient.get(this.myService.host+'action=likes&link='+this.link)
      .subscribe(data => {

        if(this.minumum_balance < data['balance']){
          this.isBalanceOkay=true;
        }else{
          this.isBalanceOkay=false;
        }
        console.log('Balance: ', data['balance']);
        console.log('isBalanceOkay: ', this.isBalanceOkay);
        this.logLink();
      });


  }

  logLink(){
    let date = new Date();
    this.myService.getActiveUser().getIdToken()
      .then( (token:string) =>{
        // Get a reference to the database service
        var uid = this.myService.getActiveUser().uid;

         var newPostKey = firebase.database().ref().push().key;
         // Write the new post's data simultaneously in the posts list and the user's post list.
         var updates = {};
         var hours = date.getHours();
         updates['/links/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+'/'+uid+'/'+newPostKey] = this.link;
         //updates['/counters/'+date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate()+'/'+uid] = {count : 1 };
         //alert('Token OK');
         firebase.database().ref().update(updates);


        firebase.database().ref('users/' + this.myService.getActiveUser().uid).set({
          username: this.myService.json["displayName"],
          email: this.myService.json.email
          //profile_picture : this.myService.json["imageUrl"]
        });

        this.counter = this.getFirebaseCounter(uid,this.myService);


      })
      .catch((e) => {
        alert(e);
      })
  }

  showFeedbackPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Leave us a feedback',
      message: "Please let us know, if you encounter any issues or suggest us some ideas.",
      inputs: [
        {
          name: 'message',
          placeholder: 'Your message'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            //alert(data.message);
            this.sendFeedBack(data.message);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  sendFeedBack(message : string){
    let date = new Date();




    this.myService.getActiveUser().getIdToken()
      .then( (token:string) =>{
        // Get a reference to the database service
        var uid = this.myService.getActiveUser().uid;

        var newPostKey = firebase.database().ref().push().key;
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        var hours = date.getHours();
        updates['/feedback/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+'/'+uid+'/'+newPostKey] = message;
        //updates['/counters/'+date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate()+'/'+uid] = {count : 1 };
        //alert('Token OK');
        firebase.database().ref().update(updates);

      })
      .catch((e) => {
        alert(e);
      })
  }

  getFirebaseCounter(uid : string,ms : MyService):number{
    let date = new Date();
    var counter = 0;
    var ref = firebase.database().ref();
    ref.once("value")
      .then(function(snapshot) {
        counter = snapshot.child("links")
          .child(date.getFullYear().toString())
          .child(date.getMonth().toString())
          .child(date.getDate().toString())
          .child(uid).numChildren();
        ms.counter = counter;
        return counter;
      }).catch( e => alert(e));
    return 0;
  }

  getTutorial(ms : MyService){
    var ref = firebase.database().ref();
    ref.once("value")
      .then(function(snapshot) {
        var tut = snapshot.child("global")
          .child("tutorial").val();
        ms.tutorial = tut;
      }).catch( e => alert(e));
  }

  getHost(ms: MyService) {
    var ref = firebase.database().ref();
    ref.once("value")
      .then(function(snapshot) {
        var tut = snapshot.child("global")
          .child("host").val();
        ms.host = tut.toString();
      }).catch( e => alert(e));
  }



  isMaxReached(){
    if(this.myService.counter >= this.myService.maxLimit)
      return true;
    else
      return false;
  }

  getGlobalSettings(ms: MyService){
    var ref = firebase.database().ref();
    ref.once("value")
      .then(function(snapshot) {
        var max = snapshot.child("global")
          .child("maxLimit").val();
        ms.maxLimit = max;
        var host = snapshot.child("global")
          .child("host").val();
        ms.host = host;
        var tutorial = snapshot.child("global")
          .child("tutorial").val();
        ms.tutorial = tutorial;
      }).catch( e => alert(e));

  }


  checkBalance(){

    this.httpClient.get(this.myService.host+'action=balance')
      .subscribe(data => {

        if(this.minumum_balance < data['balance']){
          this.isBalanceOkay=true;
        }else{
          this.isBalanceOkay=false;
        }
        console.log('Balance: ', data['balance']);
        console.log('isBalanceOkay: ', this.isBalanceOkay);
      });

  }

  showBannerAd(){
    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      id: this.bannerId,
      autoShow: true,
      isTesting : this.testing
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      this.admobFree.banner.show();
    })
  }
}
