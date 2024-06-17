import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResponsablesService {
  constructor(private http: HttpClient) {}

  getResponsibles(params = {}) {
    return this.http.get(`${environment.base_url}/responsibles`, { params });
  }

  changeResponsible(data, id) {
    return this.http.put(`${environment.base_url}/responsibles/${id}`, data);
  }
}
