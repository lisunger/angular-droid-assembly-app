import { Component, OnInit } from '@angular/core';
import { ProjectsDatabaseService } from '../../services/projects-database.service';
import { Project } from '../../data-models/project';

@Component({
  selector: 'nk-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  constructor(private databaseService: ProjectsDatabaseService) { }

  projects: Project[] = [];

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.databaseService.getProjects().subscribe(res => {
      this.projects = res['data'];
      this.loadAuthors();
    });
  }

  loadAuthors() {
    this.projects.forEach(p => {
      this.databaseService.getUserameById(p.authorId)
          .subscribe(res => {
            p['authorName'] = res['data'];
          });
    });
  }

  voteUp(proj: Project) {
    // TODO
  }

  voteDown(proj: Project) {
    // TODO
  }


}
