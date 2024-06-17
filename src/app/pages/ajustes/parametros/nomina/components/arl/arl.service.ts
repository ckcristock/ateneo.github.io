import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArlService {
  constructor(private http: HttpClient) {}

  getArls(params = {}) {
    return this.http.get(`${environment.base_url}/paginateArl`, { params });
  }

  createArl(data: any) {
    return this.http.post(`${environment.base_url}/arl`, data);
  }

  getArl() {
    return this.http.get(`${environment.base_url}/arl`);
  }
}
