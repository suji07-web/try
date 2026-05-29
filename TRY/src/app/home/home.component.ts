import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent 
implements OnInit {
   ngOnInit(): void {
  this.fetchUserDetails();
}
  userDetails: any;
  editIndex: number | null = null;
  userForm = new FormGroup({
    users: new FormArray([])
  });

  constructor(private router: Router, private http: HttpClient) {}
  get users(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  createUser(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      priority: new FormControl('Medium')
    });
}

  addUser() {
  this.users.push(
    this.createUser()
  );
  this.editIndex = this.users.length - 1;
  }


  deleteUser(index: number) {
    this.users.removeAt(index);
  }


  editUser(index: number) {
    this.editIndex = index;
  }


  saveUser() {
    this.editIndex = null;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  goToBranchPage(): void {
    this.router.navigate(['/branch-details']);
  }
fetchUserDetails() {
  const token =sessionStorage.getItem('token');
  console.log('TOKEN:',token);
  this.http.get<any>(
    'https://192.168.0.29:8766/ic-user/fetchUser?isProfile=true',
    { headers: {
        Authorization:
          `Bearer ${token}`,

      }
    }
  )
  .subscribe({
    next: (response) => {
      console.log('FULL RESPONSE:',response);
      this.userDetails =response;
    },
    error: (error) => {console.log('ERROR:',error);
        if (error.status === 401) {
          sessionStorage.removeItem('token');
          this.router.navigate(['/']);
        }
       }

  });

}
}