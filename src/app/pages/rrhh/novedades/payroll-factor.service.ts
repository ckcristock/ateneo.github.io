import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { skipContentType } from '@app/http.context';

@Injectable({
  providedIn: 'root',
})
export class PayrollFactorService {
  constructor(private http: HttpClient) { }

  getPayrollFactor(params) {
    return this.http.get(`${environment.base_url}/payroll-factor`, { params });
  }
  getPayrollFactorPeople(params) {
    return this.http.get(`${environment.base_url}/payroll-factor-people`, { params }).pipe(
      map((r: any) => {
        if (r.data.data) {
          r.data.data = r.data.data.map((r) => {
            r.selected = false;
            return r;
          });
        }
        return r;
      }),
    );
  }
  count(params) {
    return this.http.get(`${environment.base_url}/payroll-factor-people-count`, { params }).pipe(
      map((r: any) => {
        if (r.data) {
          r.data = r.data.map((r) => {
            r.selected = false;
            return r;
          });
        }
        return r;
      }),
    );
  }
  savePayrollFactor(form) {
    return this.http.post(`${environment.base_url}/payroll-factor`, form, { context: skipContentType() });
  }

  getTypes() {
    return this.http.get(`${environment.base_url}/disability-leaves`);
  }

  download(params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/payroll-factor-download`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }
}
