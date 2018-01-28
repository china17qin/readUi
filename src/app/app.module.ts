import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { BookServicesProvider } from '../providers/book-services/book.services';
import { ComponentsModule } from './../components/components.module';
import { ContactPage } from '../pages/contact/contact';
import { FindPage } from '../pages/find/find';
import { HomePage } from '../pages/home/home';
import { HttpProvider } from '../providers/http/http';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';


@NgModule({
  declarations: [
    FindPage,
    ContactPage,
    HomePage,
    MyApp,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FindPage,
    ContactPage,
    HomePage,
    MyApp,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpProvider,
    BookServicesProvider,
  ]
})
export class AppModule { }
