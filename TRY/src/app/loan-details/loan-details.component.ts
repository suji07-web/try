import { LoanService } from '../services/loan.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import {
FormGroup,
FormControl,
FormBuilder,
Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { count } from 'rxjs';

@Component({
selector: 'app-loan-details',
templateUrl: './loan-details.component.html',
styleUrls: ['./loan-details.component.scss']
})

export class LoanDetailsComponent implements OnInit {
error = '';
loanCompleted = false;
businessCompleted = false;
emiData:any = {};
loanForm!: FormGroup;
businessForm!: FormGroup;
summaryData: any = {};
summaryBusinessData: any = {};
selectedCountryName = '';

repaymentFrequencyList:any[] = [];
purposeOfLoanList:any[] = [];
companyTypeList:any[] = [];
natureOfBusinessList:any[] = [];
segmentList:any[] = [];
industryTypeList:any[] = [];
designationList:any[] = [];
countryList:any[] = [];

constructor(private fb: FormBuilder,private loanService: LoanService, private router: Router) {

  };


ngOnInit(): void {
  this.loanForm = this.fb.group({
    purposeOfLoan: ['',Validators.required],
    repaymentFrequency: ['',  Validators.required ],
    collateral: ['', Validators.required],
    creditFacility: ['',Validators.required]});

  this.businessForm = this.fb.group({
    companyName: ['',Validators.required],
    companyType: ['',Validators.required],
    natureOfBusiness: ['',Validators.required],
    segment: ['',Validators.required],
    industryType: ['',Validators.required],
    applicantName: ['',Validators.required],
    designation: ['',Validators.required],
    mobileNumber: ['',Validators.required,Validators.pattern('^[0-9]{10}$')],
    email: ['',Validators.required,Validators.email],
    businessAddress: ['', Validators.required],
    city: ['',Validators.required],
    country: ['',Validators.required]
  });

const data = sessionStorage.getItem('emiData');
if(data){
this.emiData = JSON.parse(data);
}
this.loadDropdownValues();
this.loadBusinessDropdownValues();
this.loadCountryList();
}


loadDropdownValues(): void {
        this.loanService.getLoanDropdowns().subscribe({
        next:(response)=>{
          console.log(response);
          this.repaymentFrequencyList = response.data.REPAYMENTFREQUENCY || [] ;
          this.purposeOfLoanList = response.data.PURPOSEOFLOAN || [] ;

      },
        error:(error:any)=>{
        console.log(error);
        this.error = 'Failed to load dropdown values.';
      }})
    }
loadBusinessDropdownValues(): void {
  this.loanService.getBusinessDropdowns().subscribe({
  next:(response)=>{
    console.log(response);
    this.companyTypeList = response.data.COMPANYTYPE || [] ;
    this.natureOfBusinessList = response.data.NATUREOFBUSINESS || [] ;
    this.segmentList = response.data.SEGMENT || [] ;
    this.industryTypeList = response.data.INDUSTRYTYPE || [] ;
    this.designationList = response.data.DESIGNATION || [] ;

},
  error:(error:any)=>{
  console.log(error);
  this.error = 'Failed to load dropdown values.';
}})
}

loadCountryList(): void {
  this.loanService.getCountryList().subscribe({
    next:(response)=>{
      this.countryList = response.data || [] ;
      console.log('Country List', this.countryList);
      console.log('Country 1 ', this.countryList[0]);
    },
    error:(error:any)=>{
      console.log(error);
      this.error = 'Failed to load country list.';
    }
  });
}

goToBusinessDetails(): void {
   console.log('Inside goToBusinessDetails');

  if (this.loanForm.invalid) {
    this.loanForm.markAllAsTouched();
    return;
  }

 const payload = {
  screenCode: 464,

  originationModel: {
    applicationDate: '06-05-2026',
    branchId: 33,
    source: 'Website',
    currencyCode: 'GHS',
    currencyId: 252,
    originationProductId: 702
  },

  loanDetails: {
    loanAmount: this.emiData?.principal,
    totalInterestAmount: this.emiData?.totalInterest,
    interestRate: 10.55,
    loanTenureMonth: this.emiData?.tenure,
    loanTenureYear: this.emiData?.tenure,
    loanTenureDay: 1,
    totalPayableAmount: this.emiData?.totalRepaymentAmount,
    emiInterestPayable: this.emiData?.totalInterest,
    emiAmount: this.emiData?.monthlyPayment,
    customerType: 'New-to-Bank Borrower',
    existingCustomerAccNo: '',
    purposeOfLoan: this.loanForm.value.purposeOfLoan,
    repaymentFrequency: this.loanForm.value.repaymentFrequency,
    collateral: this.loanForm.value.collateral,
    creditFacility: this.loanForm.value.creditFacility
  }
};
  this.loanService.saveLoanDetails(payload)
    .subscribe({
      next: (response) => {

        console.log('Loan Details Saved', response);

        this.loanCompleted = true;
      },

      error: (error: any) => {
        console.log(error);
      }
    });

}
goToSummary(): void {

  if (this.businessForm.invalid) {

    this.businessForm.markAllAsTouched();
    return;

  }

  this.businessCompleted = true;

  this.summaryData = {
    ...this.loanForm.value,
    loanAmount: this.emiData?.principal,
    interestPayable: this.emiData?.totalInterest,
    tenure: this.emiData?.tenure,
    emiAmount: this.emiData?.monthlyPayment,
    totalPayableAmount: this.emiData?.totalRepaymentAmount
  };

  this.summaryBusinessData = this.businessForm.value;

  console.log('Loan Summary', this.summaryData);
  console.log('Business Summary', this.summaryBusinessData);

}
getPurposeOfLoan(): string {

  const item = this.purposeOfLoanList.find(
    x => x.id === this.loanForm.value.purposeOfLoan
  );

  return item?.values || '';

}

getRepaymentFrequency(): string {

  const item = this.repaymentFrequencyList.find(
    x => x.id === this.loanForm.value.repaymentFrequency
  );

  return item?.values || '';

}

getCompanyType(): string {

  const item = this.companyTypeList.find(
    x => x.id === this.businessForm.value.companyType
  );

  return item?.values || '';

}

getNatureOfBusiness(): string {

  const item = this.natureOfBusinessList.find(
    x => x.id === this.businessForm.value.natureOfBusiness
  );

  return item?.values || '';

}

getIndustryType(): string {

  const item = this.industryTypeList.find(
    x => x.id === this.businessForm.value.industryType
  );

  return item?.values || '';

}

getSegment(): string {

  const item = this.segmentList.find(
    x => x.id === this.businessForm.value.segment
  );

  return item?.values || '';

}

getDesignation(): string {

  const item = this.designationList.find(
    x => x.id === this.businessForm.value.designation
  );

  return item?.values || '';

}

getCountry(): string {

  const item = this.countryList.find(
    x => x.countryId === this.businessForm.value.country
  );

  return item?.countryName || '';

}
}