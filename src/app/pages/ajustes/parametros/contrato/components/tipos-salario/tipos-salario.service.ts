import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposSalarioService {
  constructor(private http: HttpClient) {}

  getSalaryTypesList() {
    return this.http.get(`${environment.base_url}/salaryTypes`);
  }

  getSalaryTypes(params = {}) {
    return this.http.get(`${environment.base_url}/paginateSalaryType`, { params });
  }

  createSalaryType(data: any) {
    return this.http.post(`${environment.base_url}/salaryTypes`, data);
  }
}
