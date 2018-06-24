import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, TokenPayload } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';

@Component({
  selector: 'nk-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  @ViewChild('form') form: NgForm;
  registerData = { username: undefined, email: undefined, pass: undefined};
  public error;
  passConfirm;
  buttonDisabled;
  public msgs: Message[];

  ngOnInit() {
    this.buttonDisabled = (this.form.pristine) || (this.form.invalid) || (this.form.controls['password1'].value !== this.form.controls['password2'].value);
  }

  onKeyUp() {
    this.buttonDisabled = (this.form.pristine) || (this.form.invalid) || (this.form.controls['password1'].value !== this.form.controls['password2'].value);
  }

  register() {
    console.log(this.form);
    let userData: TokenPayload = {
      email: this.form.controls['email'].value,
      username: this.form.controls['username'].value,
      password: this.form.controls['password1'].value
    };

    this.authService.register(userData)
      .subscribe((res) => {
        console.log('SUCCESS with register: ', res);
        // this.authService.setTokenData(res);
        window.scrollTo(0, 0);
        this.setSuccessMessage();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      }, (error) => {
        console.log('ERROR with register: ', error);
        this.error = error.statusText;
        // this.clearForm();
      });
  }

  clearForm() {
    this.form.reset();
  }

  setSuccessMessage() {
    this.msgs = [];
    this.msgs.push({severity: 'success', summary: 'Registration successful'});
  }

}
