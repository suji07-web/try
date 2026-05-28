import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  login() {

    const username =
      this.loginForm.value.username?.trim();

    const password =
      this.loginForm.value.password?.trim();

    if (
      username === 'admin123' &&
      password === 'Admin@123'
    ) {
    localStorage.setItem('loggedIn','true');
    this.router.navigate(['/home']);
     } 

     else {
      // mark fields red
      if (username !== 'admin1208!') {
        this.loginForm.controls.username.setErrors({
          invalid: true
        });
      }

      if (password !== '1234') {
        this.loginForm.controls.password.setErrors({
          invalid: true
        });
      }
    }
  }
  }


