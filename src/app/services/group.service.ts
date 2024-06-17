import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  getGroup(): Observable<object> {
    return this.http.get(`${environment.base_url}/group`);
  }

  //?Servicio usado para pasar el parametro opcional de company_id o de lo contrario obtener los grupos de todas las empresas
  getGroupsByCompanyId(params = {}): Observable<object> {
    return this.http.get(`${environment.base_url}/group`, { params });
  }

  save(form): Observable<object> {
    return this.http.post(`${environment.base_url}/group`, form);
  }

  //?Servicio para recuperar los grupos de la empresa en la que trabaja el ususario, viene con dependencias y cargos
  getGroupsOnlyCompany(): Observable<object> {
    return this.http.get(`${environment.base_url}/group-company`);
  }
}
