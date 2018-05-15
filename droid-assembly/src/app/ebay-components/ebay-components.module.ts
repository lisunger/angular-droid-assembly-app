import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ResultListComponent } from './result-list/result-list.component';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ScrollPanelModule,
    PaginatorModule
  ],
  declarations: [
    ResultListComponent
  ],
  providers: [ ],
  exports: [
    ResultListComponent
  ]
})
export class EbayComponentsModule { }
