import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenPayload } from '../../services/auth.service';

@Component({
  selector: 'nk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('form') form: NgForm;
  loginData = { username: undefined, pass: undefined};
  public error;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    let userData: TokenPayload = {
      username: this.form.controls['username'].
      value, password: this.form.controls['pass'].value};

    this.authService.login(userData)
      .subscribe((res) => {
        // set storage and session
        console.log('SUCCESS with logging: ', res);
        this.authService.setTokenData(res);
        this.router.navigate(['/home']);
      }, (error) => {
        console.log('ERROR with logging: ', error);
        this.error = error.statusText;
        this.clearForm();
      });
  }

  clearForm() {
    this.form.reset();
  }

}
