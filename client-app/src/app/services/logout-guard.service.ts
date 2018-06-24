import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LogoutGuardServce implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      console.log('user: LOGGED');
      this.router.navigate(['/home']);
      return false;
    } else {
      console.log('user: NOT LOGGED');
      return true;
    }
  }
}
