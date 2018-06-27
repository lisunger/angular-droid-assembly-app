import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayResult } from '../../data-models/ebay-result.model';
import { EbayItem } from '../../data-models/ebay-item';
import { Project } from '../../data-models/project';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';

class MyComponent {
  name = '';
  imageUrl = '';
  color = '';
  inPorts = [];
  outPorts = [];
}

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
  ) { }

  public searchTerm = '';
  public resultData;
  public resultCount: number;
  public parsedData: EbayResult;
  public selectedItems: EbayItem[] = [];
  public draggedItem: EbayItem;
  public currentProject: Project;
  public msgs: Message[];
  public dialogDisplay = false;
  public currentComponent: MyComponent = new MyComponent();
  public iPort;
  public oPort;

  ngOnInit() {
    this.currentProject = new Project();
  }

  paginate(event): void {
    if (this.searchTerm !== undefined && this.searchTerm.length > 0) {
      this.ebayService
      .searchItemByKeywords(this.searchTerm, event.rows, event.page + 1)
      .subscribe(res => {
        this.resultData = res;
        this.parseResultData();
      });

    }
  }

  private parseResultData(): void {
    this.parsedData = new EbayResult(this.resultData);
    this.resultCount = this.parsedData.resultCount;
  }

  dragStart(event, item: EbayItem) {
    this.draggedItem = item;
  }

  dragEnd(event) {
    this.draggedItem = null;
}

  drop(event) {
    this.selectedItems.push(this.draggedItem);
  }

  removeSelected(index) {
    this.selectedItems.splice(index, 1);
  }

  submitProject() {
    this.currentProject.date = new Date();
    this.currentProject.authorId = this.authService.getUserId();
    this.currentProject.partsIds = [];
    this.currentProject.rating = 0;
    this.selectedItems.forEach(i => this.currentProject.partsIds.push(i.itemId));

    this.databaseService.postProject(this.currentProject)
      .subscribe(res => {
        window.scrollTo(0, 0);
        this.setSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 2500);

      }, err => {
        window.scrollTo(0, 0);
        this.setErrorMessage();
      });

  }

  setSuccessMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Project saved'});
  }

  setErrorMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: 'Error', detail: 'Your project could not be saved'});
  }

  createPart() {
    this.dialogDisplay = !this.dialogDisplay;
  }

  submitComponent() {
    // ADD TO GOJS!
    this.currentComponent = new MyComponent();
    this.dialogDisplay = false;
  }

  cancelComponent() {
    this.currentComponent = new MyComponent();
    this.dialogDisplay = false;
  }

  test() {
    console.log(this.currentComponent);
  }

}
