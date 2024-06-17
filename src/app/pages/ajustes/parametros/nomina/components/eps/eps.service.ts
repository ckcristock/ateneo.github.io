import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EpsService {
  constructor(private http: HttpClient) {}

  getAllEps(params = {}) {
    return this.http.get(`${environment.base_url}/eps`, { params });
  }

  createNewEps(data: any) {
    return this.http.post(`${environment.base_url}/eps`, data);
  }

  saveNewEps(data: any) {
    return this.http.post(`${environment.base_url}/save-eps`, data);
  }

  getPaginateEps(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-eps`, { params });
    //la está tomando de la tabla eps y no epss
  }
}
