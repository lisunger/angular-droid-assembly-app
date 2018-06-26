import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EbayHttpService } from '../../services/ebay-search.service';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EbayResult } from '../../data-models/ebay-result.model';
import { EbayItem } from '../../data-models/ebay-item';
import { Project } from '../../data-models/project';
import { Message } from 'primeng/components/common/message';

@Component({
  selector: 'nk-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditProjectComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private ebayService: EbayHttpService,
    private databaseService: ProjectsDatabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  private projectId;
  public searchTerm = '';
  public resultData;
  public resultCount: number;
  public parsedData: EbayResult;
  public selectedItems: EbayItem[] = [];
  public draggedItem: EbayItem;
  public currentProject: Project = new Project();
  public msgs: Message[];


  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.databaseService.getProject(this.projectId)
      .subscribe(res => {
        console.log(res);
        this.currentProject = res;
        this.currentProject.partsIds.forEach(p => {
          this.ebayService.searchItemById(p)
            .subscribe(i => {
              this.selectedItems.push(new EbayItem(i['findItemsByKeywordsResponse'][0]['searchResult'][0]['item'][0]));
            });
        });
      });
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

  submitEdit() {
    this.currentProject.date = new Date();
    this.currentProject.authorId = this.authService.getUserId();
    this.currentProject.partsIds = [];
    this.currentProject.rating = 0;
    this.selectedItems.forEach(i => this.currentProject.partsIds.push(i.itemId));

    this.databaseService.putEditedProject(this.currentProject)
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

}
