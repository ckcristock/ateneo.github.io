import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CamposTercerosService {
  constructor(private http: HttpClient) {}

  getFields(params = {}) {
    return this.http.get(`${environment.base_url}/third-party-fields`, { params });
  }

  save(data) {
    return this.http.post(`${environment.base_url}/third-party-fields`, data);
  }

  changeState(data, id) {
    return this.http.put(`${environment.base_url}/changeStateField/${id}`, data);
  }
}
