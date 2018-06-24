import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../data-models/project';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectsDatabaseService {

  constructor(private http: HttpClient) { }

  private mainUrl = '/db';

  getProjects(): Observable<Object[]> {
    const url = this.mainUrl + '/api/projects';
    return <Observable<Object[]>>this.http.get(url);
  }

  getProject(id: string): Observable<Project> {
    const url = this.mainUrl + `/api/projects/${id}`;
    return <Observable<Project>> this.http.get(url).map(res => {
      return res['data'];
    });
  }

  postProject(project: Project): Observable<Object> {
    const url = this.mainUrl + '/api/projects';
    return this.http.post(url, project);
  }
}
