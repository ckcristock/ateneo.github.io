import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IServicio {
  constructor(private http: HttpClient) {}

  chargeFields = (params = {}) => {
    return this.http.get(environment.base_url + params['ruta'], { params });
  };

  save = (data: any, resource: string) => {
    return this.http.post(`${environment.base_url}${resource}`, data);
  };

  update = (data: any, id: number, resource: string) => {
    return this.http.put(`${environment.base_url}${resource}/${id}`, data);
  };
}
