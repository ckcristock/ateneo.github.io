import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposRegimenService {
  constructor(private http: HttpClient) {}

  getRegimeType(params = {}) {
    return this.http.get(`${environment.base_url}/paginateRegimeType`, { params });
  }

  updateOrCreateRegimeType(data: any) {
    return this.http.post(`${environment.base_url}/regime-type`, data);
  }
}
