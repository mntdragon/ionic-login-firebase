import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  public zone:NgZone;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.zone = new NgZone({});
    const config = {
      apiKey: "AIzaSyC7C-JMy5x-YrvgntI2zOebSnByUZ7GSpI",
      authDomain: "login-app-6f119.firebaseapp.com",
      databaseURL: "https://login-app-6f119.firebaseio.com",
      projectId: "login-app-6f119",
      storageBucket: "login-app-6f119.appspot.com",
      messagingSenderId: "508748919601"
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged( user => {
      this.zone.run( () => {
        if (!user) { 
          this.rootPage = 'LoginPage';
        } else {
          this.rootPage = HomePage;
        }
      });     
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

