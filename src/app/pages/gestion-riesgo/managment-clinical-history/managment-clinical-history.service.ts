import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManagmentClinicalHistoryService {
  constructor(private http: HttpClient) {}

  get(params = {}) {
    return this.http.get(`${environment.base_url}/clinical-history-model`, { params });
  }
  getModules(params = {}) {
    return this.http.get(`${environment.base_url}/module-clinical-history-model`, { params });
  }

  getThicknesses() {
    return this.http.get(`${environment.base_url}/thicknesses`);
  }

  save(data: any) {
    return this.http.post(`${environment.base_url}/materials`, data);
  }

  sendVariables(data: any) {
    return this.http.post(`${environment.base_url}/variables`, data);
  }

  update(data, id) {
    return this.http.put(`${environment.base_url}/materials/${id}`, data);
  }
}
