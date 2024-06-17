import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HotelesService {
  constructor(private http: HttpClient) {}

  getCities() {
    return this.http.get(`${environment.base_url}/cities`);
  }

  getHotels(params = {}) {
    return this.http.get(`${environment.base_url}/paginateHotels`, { params });
  }

  createHotel(data: any) {
    return this.http.post(`${environment.base_url}/hotels`, data);
  }
}
