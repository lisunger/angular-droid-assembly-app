import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoginGuardServce implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      console.log('user: LOGGED');
      return true;
    } else {
      console.log('user: NOT LOGGED');
      return false;
    }
  }
}
