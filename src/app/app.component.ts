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
  partner: number;
  apiRoot: string;

  pages: Array<{title: string, content: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.fetchPageHierarchy();
    this.initializeApp();
    this.partner = 1;
    this.apiRoot = 'http://localhost:3000';  

    this.pages = [
      { title: 'Home', content: '', component: HomePage },
    ];

  }

  fetchPageHierarchy() {
    const app = this;
    axios.get(`/partners/1/pages.json`)
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
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
