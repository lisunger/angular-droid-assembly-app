import { NgModule } from '@angular/core';
import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';
import { DragDropModule } from 'primeng/dragdrop';

@NgModule({
  declarations: [ProjectListComponent, CreateProjectComponent],
  exports: [ProjectListComponent, CreateProjectComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ScrollPanelModule,
    PaginatorModule,
    DragDropModule
  ]
})
export class ProjectsModule {}
