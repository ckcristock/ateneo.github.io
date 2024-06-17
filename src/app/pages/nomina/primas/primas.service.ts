import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrimasService {
  constructor(private http: HttpClient) {}

  getPrimasList() {
    return this.http.get(`${environment.base_url}/bonuses`);
  }

  getPrimasPaginated(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-bonuses`, { params });
  }

  checkBonuses(params) {
    return this.http.get(`${environment.base_url}/check-bonuses/${params}`);
  }

  getPremiumPeople(id_prima) {
    return this.http.get(`${environment.base_url}/bonuses/${id_prima}`);
  }

  setBonus(params) {
    return this.http.post(`${environment.base_url}/query-bonuses`, params);
  }

  saveBonus(params) {
    return this.http.post(`${environment.base_url}/bonuses`, params);
  }

  getReport(params) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(
      `${environment.base_url}/bonuses-report/${params.anio}/${params.period}/${params.status}`,
      { headers, responseType: 'blob' as 'json' },
    );
  }

  getReportPdfs(params) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/bonus-stubs/${params.anio}/${params.period}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  getOneReportPdfs(params) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/bonus-stub/${params.id}/${params.period}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }
}
