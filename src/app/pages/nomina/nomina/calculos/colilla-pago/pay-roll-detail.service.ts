import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayRollDetailService {
  constructor(private http: HttpClient) {}

  getOvertimes({ pid, inicio, fin }) {
    return this.http.get(
      `${environment.base_url}/payroll/overtimes/person/${pid}/${inicio}/${fin}`,
    );
  }
  getOvertimesPercentages() {
    return this.http.get(`${environment.base_url}/params/payroll/overtimes/percentages`);
  }

  getSalary({ pid, inicio, fin }) {
    return this.http.get(`${environment.base_url}/payroll/salary/person/${pid}/${inicio}/${fin}`);
  }
  getFactors({ pid, inicio, fin }) {
    return this.http.get(`${environment.base_url}/payroll/factors/person/${pid}/${inicio}/${fin}`);
  }
  getIncomes({ pid, inicio, fin }) {
    return this.http.get(`${environment.base_url}/payroll/incomes/person/${pid}/${inicio}/${fin}`);
  }
  getRetentions({ pid, inicio, fin }) {
    return this.http.get(
      `${environment.base_url}/payroll/retentions/person/${pid}/${inicio}/${fin}`,
    );
  }
  getDeductions({ pid, inicio, fin }) {
    return this.http.get(
      `${environment.base_url}/payroll/deductions/person/${pid}/${inicio}/${fin}`,
    );
  }
  getNetPay({ pid, inicio, fin }) {
    return this.http.get(`${environment.base_url}/payroll/net-pay/person/${pid}/${inicio}/${fin}`);
  }
  getSocialSecurity() {
    return this.http.get(`${environment.base_url}/payroll/social-security/person`);
  }
}
