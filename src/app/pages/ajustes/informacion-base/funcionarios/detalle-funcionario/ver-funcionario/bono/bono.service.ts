import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BonoService {
  constructor(private http: HttpClient) {}

  getBonusList(params = {}) {
    return this.http.get(`${environment.base_url}/countable_income`, { params });
  }

  addBonus(data) {
    return this.http.post(`${environment.base_url}/bonifications`, data);
  }

  getBonusData(params = {}) {
    return this.http.get(`${environment.base_url}/bonifications`, { params });
  }
}
