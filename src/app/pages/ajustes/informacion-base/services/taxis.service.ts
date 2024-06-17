import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaxisService {
  constructor(private http: HttpClient) {}

  getTaxis(params = {}) {
    return this.http.get(`${environment.base_url}/paginateTaxis`, { params });
  }

  createTaxi(data: any) {
    return this.http.post(`${environment.base_url}/taxis`, data);
  }

  updateTaxi(data: any, id: any) {
    return this.http.put(`${environment.base_url}/taxis/${id}`, data);
  }
}
