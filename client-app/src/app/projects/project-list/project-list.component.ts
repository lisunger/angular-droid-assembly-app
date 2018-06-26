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
  projectsCount: number;

  ngOnInit() {
    this.databaseService.getProjectCount()
      .subscribe(res => {
        this.projectsCount = res['data'];
        this.paginate({first: 0, rows: 5});
        this.loadAuthors();
      });
  }

  // getProjects(page: number, limit: number) {
  //   this.databaseService.getProjects(page, limit).subscribe(res => {
  //     this.projects = res['data'];
  //     this.loadAuthors();
  //   });
  // }

  loadAuthors() {
    this.projects.forEach(p => {
      this.databaseService.getUserameById(p.authorId)
          .subscribe(res => {
            p['authorName'] = res['data'];
          });
    });
  }

  paginate(event) {
    this.databaseService.getProjects(event.first, event.rows)
      .subscribe(res => {
        this.projects = [];
        res['data'].forEach(r => this.projects.push(<Project> r));
        this.loadAuthors();
      });
  }

  voteUp(proj: Project) {
    // TODO
  }

  voteDown(proj: Project) {
    // TODO
  }


}
