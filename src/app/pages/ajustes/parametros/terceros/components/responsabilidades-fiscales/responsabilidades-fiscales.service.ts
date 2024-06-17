import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResponsabilidadesFiscalesService {
  constructor(private http: HttpClient) {}

  getFiscalResponsibility(params = {}) {
    return this.http.get(`${environment.base_url}/paginateFiscalResponsibility`, { params });
  }

  updateOrCreategetFiscalResponsibility(data: any) {
    return this.http.post(`${environment.base_url}/fiscal-responsibility`, data);
  }
}
