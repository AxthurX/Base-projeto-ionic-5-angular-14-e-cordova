import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { File } from '@ionic-native/file/ngx';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: true,
      validation: true,
    }),
    provideAuth(() => getAuth()),
  ],
  providers: [
    BarcodeScanner,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    StatusBar,
    LocalNotifications,
    AppVersion,
    Camera,
  ],
  bootstrap: [AppComponent],
  exports: [HttpClientModule],
})
export class AppModule {
  constructor() {}
}
