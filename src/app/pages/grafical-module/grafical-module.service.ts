import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GraficalModuleService {
  constructor(private http: HttpClient) {}

  getDepartments = () => {
    return this.http.get(environment.base_url + '/departments');
  };
  getSpecialities = () => {
    return this.http.get(environment.base_url + '/get-specialties/0/0');
  };
  getDataByGrafical = (params = {}) => {
    return this.http.get(environment.base_url + '/info-grafical-resume', { params });
  };
}
