import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CupService {
  constructor(private http: HttpClient) {}

  getAllCup(params = {}) {
    return this.http.get(`${environment.base_url}/cup`, { params });
  }

  getAllPaginateCup(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-cup`, { params });
  }

  createNewCup(data: any) {
    return this.http.post(`${environment.base_url}/cups`, data);
  }

  getCup(data: any) {
    return this.http.get(`${environment.base_url}/cups/`.concat(data));
  }

  getTypes() {
    return this.http.get(`${environment.base_url}/cup-types`);
  }

  getColors() {
    return this.http.get(`${environment.base_url}/get-cups-colors`);
  }
}
