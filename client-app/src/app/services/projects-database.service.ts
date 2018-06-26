import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../data-models/project';
import { Comment as ProjectComment } from '../data-models/comment';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectsDatabaseService {

  constructor(private http: HttpClient) { }

  private mainUrl = '/db';

  getProjects(first: number = -1, rows: number = -1): Observable<Object[]> {
    let url = this.mainUrl + '/api/projects';
    if (first > -1 && rows > -1) {
      url += `?page=${first}&limit=${rows}`;
    }
    return <Observable<Object[]>>this.http.get(url);
  }

  getProject(projectId: string): Observable<Project> {
    const url = this.mainUrl + `/api/projects/${projectId}`;
    return <Observable<Project>> this.http.get(url).map(res => {
      return res['data'];
    });
  }

  postProject(project: Project): Observable<Object> {
    const url = this.mainUrl + '/api/projects';
    return this.http.post(url, project);
  }

  putEditedProject(project: Project): Observable<Object> {
    console.log(project);
    const url = this.mainUrl + `/api/projects/${project.id}`;
    return this.http.put(url, project);
  }

  deleteProject(projectId: string): Observable<Object> {
    const url = this.mainUrl + `/api/projects/${projectId}`;
    return this.http.delete(url);
  }

  getProjectCount(): Observable<Object> {
    const url = this.mainUrl + `/api/projects/count`;
    return this.http.get(url);
  }

  getProjectNameById(projectId: string): Observable<Object> {
    const url = this.mainUrl + `/api/projects/${projectId}/name`;
    return this.http.get(url);
  }

  getProjectsByUserId(userId: string) {
    const url = this.mainUrl + `/api/users/${userId}/projects`;
    return this.http.get(url);
  }

  postComment(comment: ProjectComment): Observable<Object> {
    const url = this.mainUrl + '/api/projects/comments';
    return this.http.post(url, comment);
  }

  getCommentsByProjectId(projectId: string): Observable<Object> {
    const url = this.mainUrl + `/api/projects/${projectId}/comments`;
    return this.http.get(url);
  }

  getCommentsByUserId(userId: string): Observable<Object> {
    const url = this.mainUrl + `/api/comments/${userId}`;
    return this.http.get(url);
  }

  deleteComment(commentId: string): Observable<Object> {
    const url = this.mainUrl + `/api/comments/${commentId}`;
    return this.http.delete(url);
  }

  getUser(userId: string): Observable<Object> {
    const url = this.mainUrl + `/api/users/${userId}`;
    return this.http.get(url);
  }

  getUserameById(userId: string): Observable<Object> {
    const url = this.mainUrl + `/api/users/${userId}/name`;
    return this.http.get(url);
  }
}
