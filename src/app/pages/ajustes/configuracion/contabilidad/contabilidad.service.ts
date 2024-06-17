import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContabilidadService {
  constructor(private http: HttpClient) {}

  getItemsByEntityType(params = {}) {
    return this.http.get(`${environment.base_url}/account-configurations-paginate`, { params });
  }

  editEntityTypeItem(id, requestBody: any) {
    return this.http.put(`${environment.base_url}/account-configurations/${id}`, requestBody);
  }
  getAccountingAccounts() {
    return this.http.get(`${environment.base_url}/account-plan-select`);
  }
  getRetentionTypes() {
    return this.http.get(`${environment.base_url}/retention-type-select`);
  }
}
