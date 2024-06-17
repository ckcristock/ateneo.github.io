import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  constructor(private http: HttpClient) {}

  getCountries(params = {}) {
    return this.http.get(`${environment.base_url}/paginateCountries`, { params });
  }

  createCountry(data: any) {
    return this.http.post(`${environment.base_url}/countries`, data);
  }
}
