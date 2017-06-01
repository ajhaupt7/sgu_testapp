import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CustomPage } from '../pages/custom/custom';

import axios from 'axios';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  partnerId: number;
  apiRoot: string;

  pages: Array<{title: string, content: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.partnerId = 1;
    this.apiRoot = 'http://localhost:3000';  

    this.fetchPageHierarchy();
    this.initializeApp();

    this.pages = [
      { title: 'Home', content: '', component: HomePage },
    ];

  }

  fetchPageHierarchy() {
    const app = this;
    axios.get(`${this.apiRoot}/partners/${this.partnerId}/pages.json`)
      .then((response) => {
        response.data.map(page => { 
          app.pages.push({title: page.title, content:page.content, component: CustomPage})
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component, { title: page.title, content: page.content });
  }
}
