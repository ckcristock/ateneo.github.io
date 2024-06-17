import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayRollSocialSecurityService {
  constructor(private http: HttpClient) {}

  getScurity({ pid, inicio, fin }) {
    return this.http.get(`${environment.base_url}/payroll/security/person/${pid}/${inicio}/${fin}`);
  }
  getScurityPercentages({ pid }) {
    return this.http.get(
      `${environment.base_url}/params/payroll/ssecurity_company/percentages/${pid}}`,
    );
  }
}
