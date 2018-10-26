import firebase from 'firebase';

export class MyService{

  loggedIn : boolean;
  counter : number = 0;
  maxLimit : number = 2;
  json : any;
  tutorial : string = "";
  host: string = "?";

  getActiveUser(){
    return firebase.auth().currentUser;
  }


  signOut(){
    firebase.auth().signOut();
  }



}
