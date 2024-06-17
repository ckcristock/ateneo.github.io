import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreliquidadosService {
  constructor(private http: HttpClient) {}

  getPreliquidados(params = {}) {
    //return this.http.get(`${environment.base_url}/preLiquidado`, {params});
    return this.http.get(`${environment.base_url}/preliquidation`, { params });
  }

  activate(data: any, id) {
    return this.http.put(`${environment.base_url}/liquidateOrActivate/${id}`, data);
  }
}
