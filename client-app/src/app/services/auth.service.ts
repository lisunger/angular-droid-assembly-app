import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/do';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private API_URL = '/api';

  public login(user: TokenPayload): Observable<string> {
    return this.http
      .post<string>(this.API_URL + '/sign-in', user)
      .do(res => { }, error => this.handleError).shareReplay();
  }

  public register(user: TokenPayload): Observable<string> {
    return this.http
      .post<string>(this.API_URL + '/register', user)
      .do(res => {  }, error => this.handleError).shareReplay();
  }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

  public setTokenData(authResult): void {
    let decodedToken = jwtDecode(authResult.token);
    const expiresAt = moment().add(decodedToken.exp, 'second');

    // add the three entries to the browser local storage to be read later
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('expiresAt', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('username', authResult.username);
  }

  public getUserId(): string {
    return jwtDecode(localStorage.getItem('token'))['id'];
  }

  // remove the entries from the browser local storage
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('username');
  }

  public isLoggedIn(): boolean {
    let logged = moment().isBefore(this.getExpiration());
    if (!logged) {
      this.logout();
    }
    return logged;
  }

  public getExpiration() {
    const expiration = localStorage.getItem('expiresAt');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public getUsername(): string {
    return localStorage.getItem('username');
  }
}

export interface TokenPayload {
  email?: string;
  password: string;
  username?: string;
}
