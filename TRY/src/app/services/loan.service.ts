import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor(
    private http: HttpClient
  ) {}

  calculateEmi(payload:any): Observable<any> {

    return this.http.post<any>(
      `${environment.apiBaseUrl}${environment.loan.emiCalculation}`,
      payload
    );

  }

  getLoanDropdowns(): Observable<any> {

    return this.http.get<any>(
      `${environment.apiBaseUrl}${environment.genericValue}?genericName=REPAYMENTFREQUENCY,PURPOSEOFLOAN`
    );

  }
  getBusinessDropdowns() {

  return this.http.get<any>(
    `${environment.apiBaseUrl}${environment.genericValue}?genericName=COMPANYTYPE,NATUREOFBUSINESS,SEGMENT,INDUSTRYTYPE,DESIGNATION`
  );

}
  getCountryList(): Observable<any> {

    return this.http.get<any>(
      `${environment.apiBaseUrl}${environment.country}?oneTimeAuth=Y&recordStatus=OPEN&authStatus=AUTHORIZED`
    );

  }
  saveLoanDetails(payload: any) {
  return this.http.post(
    `${environment.apiBaseUrl}${environment.loan.loanDetail}`,
    payload
  );
}

}