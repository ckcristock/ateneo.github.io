import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CesantiasService {
  constructor(private http: HttpClient) {}

  getSeverancePaymentsPaginate(params: any = {}) {
    return this.http.get(`${environment.base_url}/severance-payment-paginate`, { params });
  }

  getSeverancePayments(params: any = {}) {
    return this.http.get(`${environment.base_url}/get-severance-payment`, { params });
  }

  pay(data) {
    return this.http.post(`${environment.base_url}/severance-payments`, data);
  }

  validateYear(params = {}) {
    return this.http.get(`${environment.base_url}/severance-payments-validate`, { params });
  }

  getSeverance(id) {
    return this.http.get(`${environment.base_url}/severance-payments/${id}`);
  }
  getSeveranceInterest(id) {
    return this.http.get(`${environment.base_url}/severance-interest-payments/${id}`);
  }
}
