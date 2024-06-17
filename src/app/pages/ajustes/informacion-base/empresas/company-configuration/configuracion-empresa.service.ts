import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionEmpresaService {
  private API_URL = `${environment.base_url}/company-configuration`;

  constructor(private http: HttpClient) {}

  getBanks() {
    return this.http.get(`${environment.base_url}/banks`);
  }

  getArl() {
    return this.http.get(`${environment.base_url}/arl`);
  }
  getCompanies(params = {}) {
    return this.http.get(`${environment.base_url}/get-all-companies`, { params });
  }

  getCompanyData(id) {
    /* let params = { id: id } */
    return this.http.get(`${environment.base_url}/companyData/${id}`);
  }

  getCompaniesOwner(params = {}) {
    return this.http.get(`${environment.base_url}/company`, { params });
  }

  saveCompanyData(data: any) {
    return this.http.post(`${environment.base_url}/saveCompanyData`, data);
  }

  getPaymentConfiguration(params = {}) {
    return this.http.get(`${environment.base_url}/companyPayment`, { params }); //trae los datos del id 1
  }

  changePaymentConfiguration(data: any) {
    return this.http.post(`${environment.base_url}/companyPayment`, data);
  }

  postQuantityMemorandums(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}`, body);
  }

  putQuantityMemorandums(body: any, id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, body);
  }
}
