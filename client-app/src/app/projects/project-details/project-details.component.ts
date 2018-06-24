import { Component, OnInit } from '@angular/core';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../data-models/project';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayItem } from '../../data-models/ebay-item';

@Component({
  selector: 'nk-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  constructor(
    private databaseService: ProjectsDatabaseService,
    private route: ActivatedRoute,
    private ebayService: EbayHttpService) { }

  private projectId;
  project: Project = new Project();
  parts: EbayItem[] = [];

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.databaseService.getProject(this.projectId)
      .subscribe(res => {
        this.project = res;
        this.findItems();
      });

  }

  private findItems() {
    this.project.partsIds.forEach(i => {
      this.ebayService.searchItemById(i)
        .subscribe(res => {
          console.log(res);
          this.parts.push(new EbayItem(res['findItemsByKeywordsResponse'][0]['searchResult'][0]['item'][0]));
        });
    });
  }

  click() {
    console.log(this.parts);
  }

}
