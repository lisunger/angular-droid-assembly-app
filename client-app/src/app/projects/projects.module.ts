import { NgModule } from '@angular/core';
import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';
import { DragDropModule } from 'primeng/dragdrop';
import { EditorModule } from 'primeng/editor';
import { ChipsModule } from 'primeng/chips';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ProjectDetailsComponent } from './project-details/project-details.component';

@NgModule({
  declarations: [
    ProjectListComponent,
    CreateProjectComponent,
    ProjectDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    ScrollPanelModule,
    PaginatorModule,
    DragDropModule,
    EditorModule,
    ChipsModule,
    MessagesModule,
    MessageModule
  ]
})
export class ProjectsModule {}
