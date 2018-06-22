import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../data-models/project';

@Injectable()
export class ProjectsDatabaseService {

  constructor(private http: HttpClient) { }

  private mainUrl = '/db';

  getProjects(): Observable<Object[]> {
    const url = this.mainUrl + '/api/projects';
    return <Observable<Object[]>>this.http.get(url);
  }

  postProject(project: Project): Observable<Object> {
    const url = this.mainUrl + '/api/projects';
    return this.http.post(url, project);
  }
}
