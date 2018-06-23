import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from 'environments/environment';
import { Todo } from './todo';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { map, catchError, } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { SessionService } from 'app/session.service';
//const API_URL = environment.apiUrl;

const API_URL = `/api`; //URL to web api
export interface TokenPayload {
  email?: string;
  password: string;
  username?: string;
}

@Injectable()
export class ApiService {

  constructor(
    private http: Http,
    private session: SessionService
  ) {
  }

  public signIn(user: TokenPayload) {
    return this.http
      .post(API_URL + '/sign-in', 
        user
      ).pipe(
      map(response => response.json()),
      catchError(this.handleError)
      );
    }

  public getAllTodos(): Observable<Todo[]> {
    const options = this.getRequestOptions();
    return this.http
      .get(API_URL + '/todos', options).pipe(
      map(response => {
        const todos = response.json();
        return todos.map((todo) => new Todo(todo));
      }),
      catchError(this.handleError)
    );
  }

  public createTodo(todo: Todo): Observable<Todo> {
    const options = this.getRequestOptions();
    return this.http
      .post(API_URL + '/todos', todo, options).pipe(
      map(response => {
        return new Todo(response.json());
      }),
      catchError(this.handleError)
    );
  }

  public getTodoById(todoId: number): Observable<Todo> {
    const options = this.getRequestOptions();
    return this.http
      .get(API_URL + '/todos/' + todoId, options).pipe(
      map(response => {
        return new Todo(response.json());
      }),
      catchError(this.handleError)
    );
  }

  public updateTodo(todo: Todo): Observable<Todo> {
    const options = this.getRequestOptions();
    return this.http
      .put(API_URL + '/todos/' + todo.id, todo, options).pipe(
      map(response => {
        return new Todo(response.json());
      }),
      catchError(this.handleError)
    );
  }

  public deleteTodoById(todoId: number): Observable<null> {
    const options = this.getRequestOptions();
    return this.http
      .delete(API_URL + '/todos/' + todoId, options).pipe(
      map(response => null),
      catchError(this.handleError)
      );
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  private getRequestOptions() {
    const headers = new Headers({
      'Authorization': 'Bearer ' + this.session.accessToken
    });
    return new RequestOptions({ headers });
  }
}
