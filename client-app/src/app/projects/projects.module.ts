import { NgModule } from '@angular/core';
import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';

@NgModule({
  declarations: [ProjectListComponent, CreateProjectComponent],
  exports: [ProjectListComponent, CreateProjectComponent],
  imports: []
})
export class ProjectsModule { }
