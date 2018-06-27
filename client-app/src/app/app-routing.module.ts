import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login-component/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { LoginGuardServce } from './services/login-guard.service';
import { LogoutGuardServce } from './services/logout-guard.service';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { RegisterComponent } from './login/register-component/register.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { GoComponent } from './go/go.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ProjectListComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
  { path: 'new-project', component: CreateProjectComponent, canActivate: [LoginGuardServce] },
  { path: 'edit/:id', component: EditProjectComponent, canActivate: [LoginGuardServce]},
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuardServce] },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuardServce] },
  { path: 'register', component: RegisterComponent },
  { path: 'go', component: GoComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
