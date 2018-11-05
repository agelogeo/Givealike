import firebase from 'firebase';

export class MyService{

  loggedIn : boolean;
  counter : number = 0;
  maxLimit : number = 2;
  json : any;
  tutorial : string = "";
  host: string = "http://agelogeo.com/apps/maxcheaters.php?";

  getActiveUser(){
    return firebase.auth().currentUser;
  }


  signOut(){
    firebase.auth().signOut();
  }



}
