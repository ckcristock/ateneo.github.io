import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatosEmpresaService {
  constructor(private http: HttpClient) {}

  getEnterpriseData(id) {
    return this.http.get(`${environment.base_url}/work_contracts/${id}`);
  }
  getDependecies() {
    return this.http.get(`${environment.base_url}/dependency`);
  }

  getPositions() {
    return this.http.get(`${environment.base_url}/position`);
  }

  getFixed_turn(params = {}) {
    return this.http.get(`${environment.base_url}/fixed_turn`, { params });
  }

  getFixed_turnSP() {
    return this.http.get(`${environment.base_url}/fixed_turn`);
  }

  updateEnterpriseData(data) {
    return this.http.post(`${environment.base_url}/enterpriseData`, data);
  }
}
