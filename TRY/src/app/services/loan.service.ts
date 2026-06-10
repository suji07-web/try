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
  saveLoanDetails(payload: any): Observable<any> {
  return this.http.post(
    `${environment.apiBaseUrl}${environment.loan.loanDetail}`,
    payload
  );
}

    getDocumentChecklist(originationId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}${environment.document.checkList}` +
      `?stageId=${environment.stageId}&screenCode=${environment.screenCode}&originationId=${originationId}`
    );
  }

      uploadDocument(file: File, metadata: {
    documentNameForChecklist: string;   
    documentName: string;               
    documentType: string;
    documentNumber: string;
    documentSide: number;              
    fileName: string;
    fileType: string;
    verificationType: string;           
  }): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('data', JSON.stringify(metadata));
    formData.append('module', 'document');
 
    return this.http.post<any>(
      `${environment.apiBaseUrl}${environment.document.upload}`,
      formData
    );
  }

     linkDocumentToOrigination(documentIds: number[], originationId: number): Observable<any> {
    return this.http.post<any>(
      `${environment.apiBaseUrl}${environment.document.linkToOrigination}`,
      {
        documentIds,
        originationId,
        screenCode: environment.screenCode
      }
    );
  }
     runOcrForIncorporationCertificate(file: File,originationId: number,documentId: number): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', file, file.name);
 
    return this.http.post<any>(
      `${environment.apiBaseUrl}${environment.document.ocrSave}` +`?originationId=${originationId}` +`&documnetName=Incorporation%20Certificate` +   `&documentId=${documentId}`,formData
    );
  }


downloadDocument(uuid: string): Observable<Blob> {
  return this.http.get(`${environment.apiBaseUrl}${environment.document.download}`, {
    params: { uuid },
    responseType: 'blob'
  });
}

}