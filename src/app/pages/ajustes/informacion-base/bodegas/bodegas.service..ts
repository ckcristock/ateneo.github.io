import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { AnyAaaaRecord } from 'dns';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BodegasService {
  constructor(private http: HttpClient) {}

  getBodegas(params = {}) {
    return this.http.get(`${environment.base_url}/paginateBodegas`, { params });
  }

  getAllBodegas() {
    return this.http.get(`${environment.base_url}/bodegas`);
  }

  getBodega(id: any) {
    return this.http.get(`${environment.base_url}/bodegas/${id}`);
  }

  getGruposBodega(id: any, params = {}) {
    return this.http.get(`${environment.base_url}/bodegas-with-estibas/${id}`, { params });
  }

  getEstibasGrupo(id: any, params = {}) {
    return this.http.get(`${environment.base_url}/grupos-with-estibas/${id}`, { params });
  }

  createBodega(data: any) {
    return this.http.post(`${environment.base_url}/bodegas`, data);
  }

  createGrupo(data: any) {
    return this.http.post(`${environment.base_url}/grupos-bodegas`, data);
  }

  createEstiba(data: any) {
    return this.http.post(`${environment.base_url}/estibas`, data);
  }

  activarInactivar(data: any) {
    return this.http.post(`${environment.base_url}/bodegas-activar-inactivar`, data);
  }
}
