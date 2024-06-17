import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  public id: number = null;

  constructor(private httpClient: HttpClient) {}
  storePeople(form) {
    return this.httpClient.post(`${environment.base_url}/professionals`, form);
  }
  getPeople(params = {}) {
    return this.httpClient.get(`${environment.base_url}/professionals`, { params });
  }
  getProfessional(id = null) {
    return this.httpClient.get(`${environment.base_url}/professionals/`.concat(id));
  }
}
