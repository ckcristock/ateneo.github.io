import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayrollPersonService {
  constructor(private http: HttpClient) {}

  getPersonPay({ pid }) {
    return this.http.get(`${environment.base_url}/nomina/pago/funcionario/${pid}`);
  }
  getCompanyGlobal() {
    return this.http.get(`${environment.base_url}/company-global`);
  }
}
