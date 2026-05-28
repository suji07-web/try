import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

export class HomeComponent {


  
  editIndex: number | null = null;

  
  userForm = new FormGroup({

    users: new FormArray([])

  });

  constructor(private router: Router) {}


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

  localStorage.removeItem(
    'loggedIn'
  );

  this.router.navigate(['/']);


}

}