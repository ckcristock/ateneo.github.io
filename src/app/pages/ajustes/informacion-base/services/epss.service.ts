import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EpssService {
  constructor(private http: HttpClient) {}

  getEpss() {
    return this.http.get(`${environment.base_url}/epss`);
  }

  getAllEps(params = {}) {
    return this.http.get(`${environment.base_url}/eps`, { params });
  }

  getInfoEpsContract(id) {
    return this.http.get(`${environment.base_url}/contracts/${id}`);
  }

  getAllPaginateEps(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-eps`, { params });
  }

  createNewEps(data: any) {
    return this.http.post(`${environment.base_url}/eps`, data);
  }

  createNewEpsContact(data: any) {
    return this.http.post(`${environment.base_url}/contracts`, data);
  }

  getAllPaginateEpsContact(params = {}) {
    return this.http.get(`${environment.base_url}/contracts`, { params });
  }

  getEpsContracts(data: any) {
    return this.http.get(`${environment.base_url}/contracts-for-select`, data);
  }

  getPaymentMethodsContracts() {
    return this.http.get(`${environment.base_url}/get-payment-methods-contracts`);
  }

  getAttentionRoutes() {
    return this.http.get(`${environment.base_url}/get-attention-routes`);
  }

  getAttentionRoutesCustom(data) {
    return this.http.post(`${environment.base_url}/get-attention-routes-custom`, data);
  }
}
