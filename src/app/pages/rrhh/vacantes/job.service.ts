import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  getJob(id) {
    return this.http.get(`${environment.base_url}/jobs/${id}`);
  }
  getJobs(params = {}) {
    return this.http.get(`${environment.base_url}/jobs`, { params });
  }
  save(params = {}) {
    return this.http.post(`${environment.base_url}/jobs`, params);
  }

  setState(id, params = {}) {
    return this.http.post(`${environment.base_url}/jobs/set-state/${id}`, params);
  }

  getContractTypes() {
    return this.http.get(`${environment.base_url}/work-contract-type`);
  }

  getVisaTypes() {
    return this.http.get(`${environment.base_url}/visa-types`);
  }

  getDrivingLicenses() {
    return this.http.get(`${environment.base_url}/drivingLicenses`);
  }

  getDocumentTypes() {
    return this.http.get(`${environment.base_url}/documentTypes`);
  }

  getSalaryTypes() {
    return this.http.get(`${environment.base_url}/salaryTypes`);
  }

  getApplicants(params = {}) {
    return this.http.get(`${environment.base_url}/applicants`, { params });
  }

  download(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/download-applicants/${id}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  getDependencies() {
    return this.http.get(`${environment.base_url}/filter-all-depencencies`);
  }

  getPositions() {
    return this.http.get(`${environment.base_url}/filter-all-positions`);
  }
}
