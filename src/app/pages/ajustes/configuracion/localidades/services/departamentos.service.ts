import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartamentosService {
  constructor(private http: HttpClient) {}

  getDepartments(params = {}) {
    return this.http.get(`${environment.base_url}/departments`, { params });
  }

  getDepartmentById(id: number, params = {}) {
    //busca departamentos por country_id
    return this.http.get(`${environment.base_url}/departments/${id}`, { params });
  }

  getDepartmentPaginate(params = {}) {
    return this.http.get(`${environment.base_url}/paginateDepartment`, { params });
  }

  createNewDepartment(data: any) {
    return this.http.post(`${environment.base_url}/departments`, data);
  }

  setDepartment(data: any) {
    return this.http.post(`${environment.base_url}/departments`, data);
  }

  delete(id: any) {
    return this.http.post(`${environment.base_url}/countries`, id); // 'borrado lógico '+id
  }
}
