import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {

  constructor(
    private session: SessionService,
  ) {
  }

  public isSignedIn() {
    return !!this.session.accessToken;
  }

  public doSignOut() {
    this.session.destroy();
  }

  public doSignIn(accessToken: string) {
    console.log(accessToken);
    if ((!accessToken)) {
      console.log(accessToken);
      return;
    }
    
    localStorage.setItem('mean-token', accessToken);
    this.session.accessToken = accessToken;
  }

}
