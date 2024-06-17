import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CertificadosService {
  constructor(private http: HttpClient) {}

  getReasonLayoffs() {
    return this.http.get(`${environment.base_url}/reason_withdrawal`);
  }

  createNewWorkCertificate(data: any) {
    return this.http.post(`${environment.base_url}/work-certificate`, data);
  }

  createNewLayoffsCertificate(data: any) {
    return this.http.post(`${environment.base_url}/layoffs-certificate`, data);
  }

  updateLayoffsCertificate(id: any, state) {
    return this.http.put(`${environment.base_url}/layoffs-certificate/${id}`, state);
  }

  getWorkCertificates(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-work-certificate`, { params });
  }

  getLayoffsCertificates(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-layoffs-certificate`, { params });
  }

  downloadLaboral(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/download-work-certificate/${id}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  downloadComprobante(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/download-layoffs-certificate/${id}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }
}
