import {Component,OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
@Component({
  selector:'app-branch-details',
  templateUrl:'./branch-details.component.html',
  styleUrls:['./branch-details.component.scss']
})
export class BranchDetailsComponent
implements OnInit {
  branchDetails: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchBranchDetails();
  }
    logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  
  fetchBranchDetails() {
    const token =sessionStorage.getItem('token');
    this.http.get<any>( 'https://192.168.0.29:8766/ic-user/getOperatingBranch?username=ABHILASH',
     {headers: {Authorization:`Bearer ${token}`}}
    )
    .subscribe({
      next: (response) => {console.log('BRANCH RESPONSE:',response);
        this.branchDetails =response;
      },

      error: (error) => {
        console.log('ERROR:', error);

        if (error.status === 401) {
          sessionStorage.removeItem('token');

          this.router.navigate(['/']
          );
        }
      }
    });
  }
}