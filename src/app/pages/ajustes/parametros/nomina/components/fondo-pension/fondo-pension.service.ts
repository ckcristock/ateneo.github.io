import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FondoPensionService {
  constructor(private http: HttpClient) {}

  getPensionFunds(params = {}) {
    return this.http.get(`${environment.base_url}/paginatePensionFund`, { params });
  }

  createPensionFund(data: any) {
    return this.http.post(`${environment.base_url}/pension-funds`, data);
  }
}
