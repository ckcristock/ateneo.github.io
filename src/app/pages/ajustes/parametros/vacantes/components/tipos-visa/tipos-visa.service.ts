import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposVisaService {
  constructor(private http: HttpClient) {}

  getVisaTypes(params = {}) {
    return this.http.get(`${environment.base_url}/paginateVisaTypes`, { params });
  }

  save(data: any) {
    return this.http.post(`${environment.base_url}/visa-types`, data);
  }
}
