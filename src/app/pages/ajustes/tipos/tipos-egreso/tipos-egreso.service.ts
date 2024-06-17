import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposEgresoService {
  constructor(private http: HttpClient) {}

  getEgresstype(params = {}) {
    return this.http.get(`${environment.base_url}/paginateEgressTypes`, { params });
  }

  createEgressType(data: any) {
    return this.http.post(`${environment.base_url}/egress_types`, data);
  }
}
