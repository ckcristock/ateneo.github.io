import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CentroCostosService {
  constructor(private http: HttpClient) {}

  getCostCenter(params = {}) {
    return this.http.get(`${environment.base_url}/center_cost`, { params });
  }

  createCostCenter(data: any) {
    return this.http.post(`${environment.base_url}/center_cost`, data);
  }

  obtenerCentroCosto(params = {}) {
    return this.http.get(`${environment.base_url}/php/centroscostos/lista_centros_costos.php`, {
      params,
    });
  }
}
