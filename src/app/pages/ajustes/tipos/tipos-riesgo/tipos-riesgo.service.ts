import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposRiesgoService {
  constructor(private http: HttpClient) {}

  getRiskType(params = {}) {
    return this.http.get(`${environment.base_url}/paginateRiskTypes`, { params });
  }

  createRisk(data: any) {
    return this.http.post(`${environment.base_url}/risk`, data);
  }
}
