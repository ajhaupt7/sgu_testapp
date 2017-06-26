import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import PartnerConfig from '../../../config/partner_config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  partnerId: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.partnerId = PartnerConfig.id;
  }

}
