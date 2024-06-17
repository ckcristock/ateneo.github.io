import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BancosService {
  constructor(private http: HttpClient) {}

  getBanks(params = {}) {
    return this.http.get(`${environment.base_url}/paginateBanks`, { params });
  }

  createBank(data: any) {
    return this.http.post(`${environment.base_url}/banks`, data);
  }
}
