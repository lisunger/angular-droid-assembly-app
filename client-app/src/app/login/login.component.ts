import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  loginData = { email: undefined, pass: undefined};
  error;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.form.controls['email'].value, this.form.controls['pass'].value)
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(['/home']);
      }, (error) => {
        console.log(error.error);
        this.error = error;
        this.clearForm();
      });
  }

  clearForm() {
    this.form.reset();
  }

}
