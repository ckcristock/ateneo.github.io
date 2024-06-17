import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposIngresoService {
  constructor(private http: HttpClient) {}

  getIngressType(params = {}) {
    return this.http.get(`${environment.base_url}/paginateIngressTypes`, { params });
  }

  createIngressType(data: any) {
    return this.http.post(`${environment.base_url}/ingress_types`, data);
  }
}
