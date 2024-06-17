import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposRetencionesService {
  constructor(private http: HttpClient) {}

  getRetentionType(params = {}) {
    return this.http.get(`${environment.base_url}/paginateRetentionType`, { params });
  }

  updateOrCreateRetentionType(data: any) {
    return this.http.post(`${environment.base_url}/retention-type`, data);
  }

  getAccountPlan() {
    return this.http.get(`${environment.base_url}/account-plan`);
  }
}
