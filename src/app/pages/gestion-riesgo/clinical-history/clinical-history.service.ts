import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClinicalHistoryService {
  constructor(private http: HttpClient) {}

  getClinicalHistory = (params = {}) => {
    return this.http.get(environment.base_url + '/get-clinical-historial', { params });
  };

  getClinicalHistoryDetail = (params = {}) => {
    return this.http.get(environment.base_url + '/get-clinical-historial-detail', { params });
  };

  ClinicalHistorials = (params = {}) => {
    return this.http.get(environment.base_url + '/clinical-historials', { params });
  };

  ClinicalHistorialsTypes = (params = {}) => {
    return this.http.get(environment.base_url + '/clinical-historials-types', { params });
  };

  ClinicalHistorialsSubTypes = (params = {}) => {
    return this.http.get(environment.base_url + '/clinical-historials-sub-types', { params });
  };

  chargeFields = (params = {}) => {
    return this.http.get(environment.base_url + '/get-fields', { params });
  };
}
