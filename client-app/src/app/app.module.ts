import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { LoginComponent as LoginTest } from './testing/login/login.component';
import { LoginComponent } from './login/login.component';
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
import { ViewProjectComponent } from './projects/view-project/view-project.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginTest,
    LoginComponent,
    ProfileComponent,
    HeaderComponent,
    PageNotFoundComponent,
    ViewProjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ProjectsModule
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
