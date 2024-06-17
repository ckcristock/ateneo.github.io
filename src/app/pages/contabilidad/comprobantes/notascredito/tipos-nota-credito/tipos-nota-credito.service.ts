import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposNotaCreditoService {
  constructor(private http: HttpClient) {}

  paginate(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-credit-note-types`, { params });
  }

  create(data) {
    return this.http.post(`${environment.base_url}/credit-note-type`, data);
  }
}
