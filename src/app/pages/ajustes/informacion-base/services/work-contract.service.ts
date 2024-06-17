import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkContractService {
  constructor(private http: HttpClient) {}

  getWorkContractList(id) {
    return this.http.get(`${environment.base_url}/get-work-contracts-list/${id}`);
  }

  addContract(data) {
    return this.http.post(`${environment.base_url}/work_contracts`, data);
  }
}
