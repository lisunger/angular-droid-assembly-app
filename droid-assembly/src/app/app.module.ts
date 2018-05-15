import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { EbayHttp } from './ebay-components/services/ebay-http.service';
import { EbayComponentsModule } from './ebay-components/ebay-components.module';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, HttpModule, AppRoutingModule,
    EbayComponentsModule
  ],
  providers: [ EbayHttp ],
  bootstrap: [AppComponent]
})
export class AppModule { }
