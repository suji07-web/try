import { Component } from '@angular/core';
import { LoanService } from '../services/loan.service';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss']
})
export class EmiCalculatorComponent {

  emiResult:any;

  emiForm = new FormGroup({

    principleAmount: new FormControl(
      2000,
      Validators.required
    ),

    numberOfMonths: new FormControl(
      13,
      Validators.required
    ),

    firstRepaymentDate: new FormControl(
      '2026-06-04',
      Validators.required
    )

  });

  constructor(
    private loanService: LoanService,
    private router: Router
  ) {}
  applyNow() {

  this.router.navigate(['/loan-details']);

}

  calculateEmi() {

    const payload = {
      principleAmount:this.emiForm.value.principleAmount,
      interestRate: 10.55,
      numberOfMonths: this.emiForm.value.numberOfMonths,
      firstRepaymentDate: this.emiForm.value.firstRepaymentDate

    };

    this.loanService.calculateEmi(payload).subscribe({
      next:(response)=>{
        console.log(response);
        this.emiResult =response.data;
         const emiData = { ...response.data,numberOfMonths:this.emiForm.value.numberOfMonths,interestRate: 10.55};
          sessionStorage.setItem(
    'emiData',
    JSON.stringify(emiData)
  );
},
      error:(error)=>{
        console.log(error);
      }

    });

  }

}