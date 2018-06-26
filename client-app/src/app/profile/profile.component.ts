import { Component, OnInit } from '@angular/core';
import { User } from '../data-models/user';
import { Comment as ProjectComment } from '../data-models/comment';
import { ProjectsDatabaseService } from '../services/projects-database.service';
import { AuthService } from '../services/auth.service';
import { Project } from '../data-models/project';

@Component({
  selector: 'nk-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(
    private dbService: ProjectsDatabaseService,
    private authService: AuthService
  ) {}

  user: User = {};
  comments: ProjectComment[] = [];
  projects: Project[] = [];
  deleteCommentDialogVisibility = false;
  selectedCommentId = undefined;
  deleteProjectDialogVisibility = false;
  selectedProjectId = undefined;

  ngOnInit() {
    this.loadUser();
    this.loadProjects();
    this.loadComments();
  }

  loadUser() {
    this.dbService.getUser(this.authService.getUserId()).subscribe(res => {
      this.user = <User>res['data'];
    });
  }

  loadProjects() {
    this.dbService.getProjectsByUserId(this.authService.getUserId())
      .subscribe(res => {
        console.log('PROJECTS: ', res);
        this.projects = [];
        res['data'].forEach(p => this.projects.push(<Project> p));
      });
  }

  loadComments() {
    this.dbService
      .getCommentsByUserId(this.authService.getUserId())
      .subscribe(res => {
        this.comments = [];
        this.comments = res['data'];
        this.comments.forEach(c => {
          this.dbService
            .getProjectNameById(c.projectId)
            .subscribe(
              name => (c['projectName'] = name['data']),
              error => { c['projectName'] = 'project unavailable'; });
        });
      });
  }

  onClickDeleteComment(commentId: string) {
    this.deleteCommentDialogVisibility = true;
    this.selectedCommentId = commentId;
  }

  deleteCommentCanceled() {
    this.deleteCommentDialogVisibility = false;
    this.selectedCommentId = undefined;
  }

  deleteCommentConfirmed() {
    this.dbService.deleteComment(this.selectedCommentId).subscribe(res => {
      this.deleteCommentDialogVisibility = false;
      this.selectedCommentId = undefined;
      this.loadComments();
    });
  }

  onClickDeleteProject(projectId: string) {
    this.deleteProjectDialogVisibility = true;
    this.selectedProjectId = projectId;
  }

  deleteProjectCanceled() {
    this.deleteProjectDialogVisibility = false;
    this.selectedProjectId = undefined;
  }

  deleteProjectConfirmed() {
    this.dbService.deleteProject(this.selectedProjectId).subscribe(res => {
      this.deleteProjectDialogVisibility = false;
      this.selectedProjectId = undefined;
      this.loadProjects();
    });
  }
}
