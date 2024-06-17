import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private httpClient: HttpClient) {}

  storePeople(form) {
    return this.httpClient.post(`${environment.base_url}/person`, form);
  }
  getPeople(params = {}) {
    return this.httpClient.get(`${environment.base_url}/people-paginate`, {
      params,
    });
  }

  getPersonCompany(params?: { group_id?: number; dependency_id?: number }) {
    return this.httpClient.get(`${environment.base_url}/person-company`, { params });
  }

  getPeopleIndex(params = { type: '2' }) {
    return this.httpClient.get(`${environment.base_url}/people`, { params });
  }

  getAll(params = {}) {
    return this.httpClient.get(`${environment.base_url}/people-all`, {
      params,
    });
  }

  validarCedula(cedula) {
    return this.httpClient.get(`${environment.base_url}/validar-cedula/${cedula}`);
  }
}
