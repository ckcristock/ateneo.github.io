import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkContractTypesService {
  constructor(private http: HttpClient) {}

  getWorkContractTypes() {
    return this.http.get(`${environment.base_url}/work-contract-type`);
  }

  getContractTerms() {
    return this.http.get(`${environment.base_url}/contract-terms`);
  }

  getWorkContractTypeList() {
    return this.http.get(`${environment.base_url}/work-contract-type-list`);
  }
}
