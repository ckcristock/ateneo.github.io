import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposNovedadesService {
  constructor(private http: HttpClient) {}

  getNovelties(params = {}) {
    return this.http.get(`${environment.base_url}/paginateNoveltyTypes`, { params });
  }

  createNovelty(data: any) {
    return this.http.post(`${environment.base_url}/disability-leaves`, data);
  }
}
