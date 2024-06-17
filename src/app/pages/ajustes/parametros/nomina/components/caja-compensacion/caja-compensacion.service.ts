import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CajaCompensacionService {
  constructor(private http: HttpClient) {}

  getCompensationFound(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-compensation-funds`, { params });
  }

  newCompensationFound(data: any) {
    return this.http.post(`${environment.base_url}/compensation-funds`, data);
  }
}
