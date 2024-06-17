import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FondoCesantiasService {
  constructor(private http: HttpClient) {}

  getSeveranceFunds(params = {}) {
    return this.http.get(`${environment.base_url}/paginateSeveranceFunds`, { params });
  }

  createSeveranceFunds(data: any) {
    return this.http.post(`${environment.base_url}/severance-funds`, data);
  }
}
