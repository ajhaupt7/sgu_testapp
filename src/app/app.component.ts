import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CustomPage } from '../pages/custom/custom';

import axios from 'axios';
import PartnerConfig from '../../config/partner_config'

import { ENV } from '../../config/environment.dev';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  apiRoot: string;
  test:any;

  pages: Array<{title: string, content: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.apiRoot = ENV.API_URL;  

    this.pages = [
      { title: 'Home', content: `${PartnerConfig.id}`, component: HomePage },
    ];

    this.setCachedPages();
    this.fetchPageHierarchy();
    this.initializeApp();

  }

  setCachedPages() { 
    if (PartnerConfig.pages) {
      PartnerConfig.pages.map(page => {
        this.pages.push({title:page.title, content:page.content, component:CustomPage});
      }) 
    }
  }

  fetchPageHierarchy() {
    const app = this;
    this.pages = this.pages.slice(0,1);
    axios.get(`${this.apiRoot}/partners/${PartnerConfig.id}/app_settings.json`)
      .then((response) => {
        response.data.pages.map(page => { 
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
