import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../data-models/project';
import { EbayHttpService } from '../../services/ebay-search.service';
import { EbayItem } from '../../data-models/ebay-item';
import { AuthService } from '../../services/auth.service';
import { Comment as ProjectComment } from '../../data-models/comment';

@Component({
  selector: 'nk-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDetailsComponent implements OnInit {

  constructor(
    private databaseService: ProjectsDatabaseService,
    private route: ActivatedRoute,
    private ebayService: EbayHttpService,
    private authService: AuthService) { }

  private projectId;
  project: Project = new Project();
  parts: EbayItem[] = [];
  newComment = '';
  comments: ProjectComment[] = [];

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.databaseService.getProject(this.projectId)
      .subscribe(res => {
        this.project = res;
        this.findItems();
      });

    this.databaseService.getComments(this.projectId)
      .subscribe(res => {
        console.log(res);
        res['data'].forEach(element => {
          this.comments.push(<ProjectComment> element);
        });
      });
  }

  private findItems() {
    this.project.partsIds.forEach(i => {
      this.ebayService.searchItemById(i)
        .subscribe(res => {
          this.parts.push(new EbayItem(res['findItemsByKeywordsResponse'][0]['searchResult'][0]['item'][0]));
        });
    });
  }

  submitComment() {
    console.log(this.newComment);
    console.log(this.authService.getUserId());
    let comment: ProjectComment = {
      authorId: this.authService.getUserId(),
      projectId: this.projectId,
      content: this.newComment.trim(),
      date: new Date()
    };
    this.databaseService.postComment(comment)
      .subscribe(res => {
        console.log(res);
        this.newComment = '';
        this.comments.push(res['data']);
      }, this.handleError);
    }

    private handleError(error) {
      console.log(error);
    }

}
