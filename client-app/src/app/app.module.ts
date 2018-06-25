import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login-component/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './common/header/header.component';

import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/authInterceptor';
import { EbayHttpService } from './services/ebay-search.service';
import { ProjectsModule } from './projects/projects.module';
import { LoginGuardServce } from './services/login-guard.service';
import { LogoutGuardServce } from './services/logout-guard.service';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { ProjectsDatabaseService } from './services/projects-database.service';
import { RegisterComponent } from './login/register-component/register.component';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    HeaderComponent,
    PageNotFoundComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ProjectsModule,
    MessagesModule,
    MessageModule
  ],
  providers: [
    AuthService,
    LoginGuardServce,
    LogoutGuardServce,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    EbayHttpService,
    ProjectsDatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
