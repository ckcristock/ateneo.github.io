import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CuentasBancariasService {
  constructor(private http: HttpClient) {}

  getBankAccounts(params = {}) {
    return this.http.get(`${environment.base_url}/paginateBankAccount`, { params });
  }

  createBankAccounts(data: any) {
    return this.http.post(`${environment.base_url}/banksAccount`, data);
  }
}
