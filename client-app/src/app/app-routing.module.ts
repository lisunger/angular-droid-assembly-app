import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
// import { LoginComponent as TestLoginComponent} from './testing/login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';

const routes: Routes = [
  { path: 'home', redirectTo: 'projects', pathMatch: 'full'},
  { path: 'projects', component: ProjectListComponent },
  { path: 'new-project', component: CreateProjectComponent },
  { path: 'profile', component: ProfileComponent},
  // { path: 'login', component: TestLoginComponent },
{ path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
