import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {
  errorMessage: string = '';

  loginForm = new FormGroup({

    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^.{5,}$')
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
      )
    ])

  });

  constructor(private router: Router,
              private http: HttpClient) {}

login() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const payload = {
    username:
      this.loginForm.value.username,
    password:
      this.loginForm.value.password
  };
  this.http.post<any>(
    'https://192.168.0.29:8766/auth/signin?rememberMe=false&otpRequired=false',
    payload
  )

  .subscribe({
    next: (response) => {
      console.log(response);
      const token =response.accessToken;
      sessionStorage.setItem('token',token);
      this.router.navigate(['/home']);
    },
    error: (error) => {
      console.log(error);
      this.errorMessage =
        'Invalid Username or Password';
    }
  });

}
  }


