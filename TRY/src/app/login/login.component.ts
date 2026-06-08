import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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
  step = 1;
  errorMessage: string = '';
  showOtp = false;

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
  mobileForm = new FormGroup({

  mobile: new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{4}$')
  ])

});

otpForm = new FormGroup({

  otp: new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{6}$')
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
      this.step = 2;    },
    error: (error) => {
      console.log(error);
      this.errorMessage =
        'Invalid Username or Password';
    }
  });

}
  generateOtp() {

  if (this.mobileForm.invalid) {
    return;
  }

  const payload = {

    mobile:
      this.mobileForm.value.mobile

  };

  this.http.post(

    `${environment.apiBaseUrl}${environment.auth.generateOtp}`,

    payload

  ).subscribe({

    next: () => {

      this.errorMessage = '';

      this.step = 3;

    },

    error: (error) => {

      if (error.status === 401) {

        this.errorMessage =
          'Unable to generate OTP';

      }

    }

  });

}
verifyOtp() {

  if (this.otpForm.invalid) {
    return;
  }

  const payload = {

    mobile:
      this.mobileForm.value.mobile,

    otp:
      this.otpForm.value.otp

  };

  this.http.post(

    `${environment.apiBaseUrl}${environment.auth.verifyOtp}`,

    payload

  ).subscribe({

    next: (response) => {
      console.log(response);
      this.errorMessage = '';

      this.router.navigate(['/emi-calculator']);

    },

    error: (error) => {

      if (error.status === 401) {

        this.errorMessage =
          'Invalid OTP';

      }

    }

  });


}}


