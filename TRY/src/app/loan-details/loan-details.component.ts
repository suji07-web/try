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

export interface ChecklistItem {
  id: number;                    
  document: string;              
  docRequired: boolean;         
  mandatoryForNxtStg: boolean;
  mandatoryForApproval: boolean;
 
  
  selectedFile?: File | null;    
  documentId?: number | null;    
  uploading?: boolean;           
  uploaded?: boolean;            
  error?: string;                
  ocrRunning?: boolean;          
  ocrDone?: boolean;       
  fetchedDocumentUrl?: string | null;       
}
@Component({
selector: 'app-loan-details',
templateUrl: './loan-details.component.html',
styleUrls: ['./loan-details.component.scss']
})

export class LoanDetailsComponent implements OnInit {
error = '';
loanCompleted = false;
businessCompleted = false;
documentCompleted = false;   


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

checklistItems: ChecklistItem[] = [];    
optionalItems: ChecklistItem[] = [];     
checklistLoading = false;
checklistError = '';
originationId: number | null = null;     

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
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
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
      next: (response: any) => {

        console.log('Loan Details Saved', response);

        // response.data.originationModel.originationId confirmed from API response
        this.originationId = response?.data?.originationModel?.originationId ?? null;

        this.loanCompleted = true;
        this.loadChecklist();   // load checklist as soon as originationId is available
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

loadChecklist(): void {
    if (!this.originationId) {
      this.checklistError = 'Origination ID not available. Please complete Loan Details first.';
      return;
    }
 
    this.checklistLoading = true;
    this.checklistError = '';
 
    this.loanService.getDocumentChecklist(this.originationId)
    .subscribe({
      next: (response: any) => {
        this.checklistLoading = false;
        const allItems: ChecklistItem[] = (response.data || []).map((item: any) => ({
          id: item.id,
          document: item.document,
          docRequired: item.docRequired,
          mandatoryForNxtStg: item.mandatoryForNxtStg,
          mandatoryForApproval: item.mandatoryForApproval,
          selectedFile: null,
          documentId: null,
          uploading: false,
          uploaded: false,
          error: '',
          ocrRunning: false,
          ocrDone: false
        }));
 

        this.checklistItems = allItems.filter(i => i.docRequired);
        this.optionalItems = allItems.filter(i => !i.docRequired);
      },
      error: () => {
        this.checklistLoading = false;
        this.checklistError = 'Failed to load document checklist.';
      }
    });
  }

  onFileSelected(event: Event, item: ChecklistItem): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      item.selectedFile = input.files[0];
      item.uploaded = false;
      item.error = '';
      item.ocrDone = false;
    }
  }

   uploadDocument(item: ChecklistItem): void {
    if (!item.selectedFile) {
      item.error = 'Please select a file first.';
      return;
    }
    if (!this.originationId) {
      item.error = 'Origination ID missing.';
      return;
    }
 
    item.uploading = true;
    item.error = '';
 
    const metadata = {
      documentNameForChecklist: item.document,
      documentName: 'National Id',    // fixed value as seen in HAR
      documentType: 'National Id',
      documentNumber: '',
      documentSide: 1,
      fileName: item.selectedFile.name,
      fileType: item.selectedFile.type,
      verificationType: 'kyc'
    };
 
    this.loanService.uploadDocument(item.selectedFile, metadata).subscribe({
      next: (uploadResponse: any) => {
         item.fetchedDocumentUrl = uploadResponse?.data?.documentUrl;
        const documentId: number = uploadResponse?.id || uploadResponse?.documentId;
 
        item.documentId = documentId;
 
        // Step 2: Link the document to the origination
        this.loanService.linkDocumentToOrigination([documentId], this.originationId!).subscribe({
          next: () => {
            item.uploading = false;
            item.uploaded = true;
 
            // Step 3: If this is the Incorporation Certificate → run OCR
            if (this.isIncorporationCertificate(item.document)) {
              this.runOcr(item);
            }
          },
          error: (err: any) => {
            item.uploading = false;
            item.error = 'Upload succeeded but failed to link document. Please retry.';
            console.error(err);
          }
        });
      },
      error: (err: any) => {
        item.uploading = false;
        item.error = 'Upload failed. Please try again.';
        console.error(err);
      }
    });
  }

    isIncorporationCertificate(documentName: string): boolean {
    return documentName.toLowerCase().includes('incorporation');
  }

    runOcr(item: ChecklistItem): void {
    if (!item.selectedFile || !item.documentId || !this.originationId) return;
 
    item.ocrRunning = true;
 
    this.loanService.runOcrForIncorporationCertificate(
      item.selectedFile,
      this.originationId,
      item.documentId
    ).subscribe({
      next: (response: any) => {
        item.ocrRunning = false;
        item.ocrDone = true;
        console.log('OCR result:', response);
      },
      error: (err: any) => {
        item.ocrRunning = false;
        item.error = 'Document uploaded but OCR extraction failed. You may proceed.';
        console.error(err);
      }
    });
  }

   addOptionalDocument(item: ChecklistItem): void {
    this.optionalItems = this.optionalItems.filter(i => i.id !== item.id);
    this.checklistItems.push({ ...item });
  }
    removeDocument(item: ChecklistItem): void {
    this.checklistItems = this.checklistItems.filter(i => i.id !== item.id);
    // Put it back in optional if it was optional originally
    if (!item.docRequired) {
      this.optionalItems.push({ ...item, selectedFile: null, uploaded: false, error: '' });
    }
  }
    get allRequiredUploaded(): boolean {
    return this.checklistItems
      .filter(i => i.mandatoryForNxtStg || i.docRequired)
      .every(i => i.uploaded);
  }
 
  proceedFromDocuments(): void {
    if (!this.allRequiredUploaded) return;
    this.documentCompleted = true;
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
viewDocument(item: ChecklistItem) {
const url =`${environment.apiBaseUrl}${environment.document.fetchDocument}` +`?originationId=${this.originationId}` +`&documnetName=${encodeURIComponent(item.document)}`;
window.open(url, '_blank');
}
}