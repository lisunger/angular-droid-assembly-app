import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/do';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Project } from '../data-models/project';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public login(email: string, password: string): Observable<string> {
    return this.http
      .post<string>('/server/login', { email, password })
      .do(res => {
        this.setSession(res);
      }).shareReplay();
  }

  private setSession(authResult): void {
    console.log('setting session!!!!');

    const expiresAt = moment().add(authResult.expiresIn, 'second');

    // add the two entries to the browser local storage to be read later
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('user_id', authResult.userId);
  }

  // remove the entries from the browser local storage
  public logout(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_id');
    this.router.navigate(['home']);
  }

  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  public getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public getUserId(): string {
    return localStorage.getItem('user_id');
  }

  public saveProject(project: Project) {

  }
}
