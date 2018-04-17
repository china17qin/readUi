import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import AV from "leancloud-storage";
import { NativeProvider } from '../providers/native/native';
import { LoginPreviewPage } from '../pages/login-preview/login-preview';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    native: NativeProvider,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      native.permission()
      AV.init({
        appId: 'B4hAv1MFcFvMs7oGbSEpStLN-gzGzoHsz',
        appKey: '0PydL8nrVy6EoEjt6WQmJ5RM'
      })
      statusBar.styleLightContent()
      statusBar.overlaysWebView(true);
      splashScreen.hide();
      let currentUser = AV.User.current();
      if(currentUser){
        this.rootPage =TabsPage
      }else{
        this.rootPage =LoginPreviewPage;
      }
      native.getStorage('_ReadUiUserInfo').then(f => {
        console.log(f)
      }, err => {
        
      })
    });
  }
}
