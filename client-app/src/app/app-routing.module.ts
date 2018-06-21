import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { LoginGuardServce } from './services/login-guard.service';
import { LogoutGuardServce } from './services/logout-guard.service';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectListComponent },
  { path: 'new-project', component: CreateProjectComponent, canActivate: [LoginGuardServce] },
  // { path: 'my-projects', component: MyProjectsComponent, canActivate: [LoginGuardServce] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuardServce] },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuardServce] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
