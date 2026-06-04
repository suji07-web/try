import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

 
  constructor(private http: HttpClient, private router: Router) {}
  userDetails: any;
    ngOnInit(): void {
      this.fetchUserDetails();
    }
toggleTheme(event: any): void {

  if (event.checked) {document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}
changeToolbarColor(event: any): void {
  const color =event.target.value;
  document.documentElement.style.setProperty('--text-color',color);
}

changeBackgroundColor(event: any): void {
  const color =event.target.value;
  document.body.style.background =color;
}
 
goToSettings(): void {
  this.router.navigate(
    ['/settings']
  );
}
 home():void{
  this.router.navigate(['/home']);
 }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
fetchUserDetails() {
       this.http.get<any>(
    'https://192.168.0.29:8766/ic-user/fetchUser?isProfile=true',)
    
  .subscribe({
    next: (response) => {
      console.log(response);
      this.userDetails =response;
    },
    error: (error) => {console.log('ERROR:',error);

       }

  });}
}



