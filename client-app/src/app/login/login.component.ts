import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'nk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  click() {
    this.authService.login('niki', '123')
    .subscribe(res => {
      console.log(res);
    });
  }

  wrong() {
    this.authService.login('wrong', 'wrong')
    .subscribe(res => {
      console.log(res);
    });
  }

  logout() {
    this.authService.logout();
  }

  isLogged() {
    console.log(this.authService.isLoggedIn());
    console.log('Expires at: ', this.authService.getExpiration().toString());
  }
}
