import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  constructor(private http: HttpClient) {}

  getAll(params = {}) {
    return this.http.get(`${environment.base_url}/loan-paginate`, { params });
  }

  save(body) {
    return this.http.post(`${environment.base_url}/loan`, body);
  }

  getNextPayrolls() {
    return this.http.get(`${environment.base_url}/payroll-nex-mouths`);
  }
  accountPlains() {
    return this.http.get(`${environment.base_url}/account-plan-list`);
  }

  getBankList() {
    return this.http.get(`${environment.base_url}/banks`);
  }

  download(id, companyId, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/proyeccion_pdf/${id}/${companyId}`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }

  downloadExcel(id, companyId, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/proyeccion_excel/${id}/${companyId}`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }

  downloadPaz(id, companyId, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(
      `${environment.base_url}/php/prestamoylibranza/pazysalvo.php/${id}/${companyId}`,
      { params, headers, responseType: 'blob' as 'json' },
    );
  }
}
