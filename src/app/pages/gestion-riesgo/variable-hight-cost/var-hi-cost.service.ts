import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VarHiCostService {
  constructor(private http: HttpClient) {}

  get(params = {}) {
    return this.http.get(`${environment.base_url}/variables-hight-cost`, { params });
  }
}
