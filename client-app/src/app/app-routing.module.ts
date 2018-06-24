import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login-component/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { LoginGuardServce } from './services/login-guard.service';
import { LogoutGuardServce } from './services/logout-guard.service';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { ViewProjectComponent } from './projects/view-project/view-project.component';
import { RegisterComponent } from './login/register-component/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ProjectListComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'project/:id', component: ViewProjectComponent },
  { path: 'new-project', component: CreateProjectComponent, canActivate: [LoginGuardServce] },
  // { path: 'my-projects', component: MyProjectsComponent, canActivate: [LoginGuardServce] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuardServce] },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuardServce] },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
