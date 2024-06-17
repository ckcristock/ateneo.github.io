import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReporteHorarioService {
  constructor(private http: HttpClient) {}

  getCompanies(params = {}) {
    return this.http.get(`${environment.base_url}/company`, { params });
  }

  getReportes() {
    return this.http.get(`${environment.base_url}/`);
  }
}
