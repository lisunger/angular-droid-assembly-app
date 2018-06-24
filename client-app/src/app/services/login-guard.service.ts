import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoginGuardServce implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      console.log('user: LOGGED');
      return true;
    } else {
      console.log('user: NOT LOGGED');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
