import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayResult } from '../../data-models/ebay-result.model';
import { EbayItem } from '../../data-models/ebay-item';
import { Project } from '../../data-models/project';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';

@Component({
  selector: 'nk-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateProjectComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private ebayService: EbayHttpService,
    private databaseService: ProjectsDatabaseService,
    private router: Router
  ) {}

  public searchTerm = '';
  public resultData;
  public resultCount: number;
  public parsedData: EbayResult;
  public selectedItems: EbayItem[] = [];
  public draggedItem: EbayItem;
  public currentProject: Project;
  public msgs: Message[];

  ngOnInit() {
    this.currentProject = new Project();
  }

  paginate(event): void {
    if (this.searchTerm !== undefined && this.searchTerm.length > 0) {
      this.ebayService
      .searchEbay(this.searchTerm, event.rows, event.page)
      .subscribe(res => {
        this.resultData = res;
        this.parseResultData();
        this.parsedData.resultList.forEach(r => console.log(r.shippingCost, typeof r.shippingCost));
      });

    }
  }

  private parseResultData(): void {
    this.parsedData = new EbayResult(this.resultData);
    console.log(this.parsedData);
    this.resultCount = this.parsedData.resultCount;
  }

  dragStart(event, item: EbayItem) {
    console.log('drag start');
    this.draggedItem = item;
  }

  dragEnd(event) {
    console.log('drag end');
    this.draggedItem = null;
}

  drop(event) {
    console.log('drop');
    this.selectedItems.push(this.draggedItem);
  }

  removeSelected(index) {
    console.log(index);
    console.log(this.selectedItems.map(i => i.title));

    this.selectedItems.splice(index, 1);
  }

  public submitProject() {
    this.currentProject.date = new Date();
    this.currentProject.authorId = this.authService.getUsername();
    this.currentProject.partsIds = [];
    this.currentProject.rating = 0;
    this.selectedItems.forEach(i => this.currentProject.partsIds.push(i.itemId));
    console.log(this.currentProject);

    this.databaseService.postProject(this.currentProject)
      .subscribe(res => {
        console.log(res);
        window.scrollTo(0, 0);
        this.setSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 2500);

      }, err => {
        window.scrollTo(0, 0);
        console.log(err);
        this.setErrorMessage();
      });

    // this.authService.saveProject(this.currentProject);
  }

  setSuccessMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Project saved'});
  }

  setErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Your project could not be saved'});
  }

}
