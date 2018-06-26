import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private ebayService: EbayHttpService,
    private authService: AuthService) { }

  private projectId;
  project: Project = new Project();
  parts: EbayItem[] = [];
  newComment = '';
  comments: ProjectComment[] = [];
  authorName = 'unknown';

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.loadProject();
    this.loadComments();
  }

  private loadProject() {
    this.databaseService.getProject(this.projectId)
      .subscribe(res => {
        this.project = res;
        this.loadItems();
        this.loadAuthorName();
      }, (error) => {
        this.router.navigate(['/**']);
      });
  }

  private loadItems() {
    this.project.partsIds.forEach(i => {
      this.ebayService.searchItemById(i)
        .subscribe(res => {
          this.parts.push(new EbayItem(res['findItemsByKeywordsResponse'][0]['searchResult'][0]['item'][0]));
        });
    });
  }

  private loadComments() {
    this.databaseService.getCommentsByProjectId(this.projectId)
      .subscribe(res => {
          res['data'].forEach(element => {
          this.comments.push(<ProjectComment> element);
          this.loadCommentsAuthors();
        });
      });
  }

  loadCommentsAuthors() {
    this.comments.forEach(c => {
      this.databaseService.getUserameById(c.authorId)
        .subscribe(res => {
          c['userName'] = res['data'];
        });
    });
  }

  loadAuthorName() {
    this.databaseService.getUserameById(this.project.authorId)
      .subscribe(res => {
        this.authorName = res['data'];
      });
  }

  submitComment() {
    let comment: ProjectComment = {
      authorId: this.authService.getUserId(),
      projectId: this.projectId,
      content: this.newComment.trim(),
      date: new Date()
    };
    this.databaseService.postComment(comment)
      .subscribe(res => {
        this.newComment = '';
        let newComment: ProjectComment = res['data'];
        newComment['userName'] = this.authService.getUsername();
        this.comments.push(newComment);
      }, this.handleError);
    }

  private handleError(error) {
    console.log(error);
  }

}
