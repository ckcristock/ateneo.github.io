import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlmuerzosService {
  constructor(private http: HttpClient) {}

  getPeople(params = { type: '2' }) {
    return this.http.get(`${environment.base_url}/people`, { params });
  }

  getLunches(params = {}) {
    return this.http.get(`${environment.base_url}/lunch`, { params });
  }

  getLunch(id: any) {
    return this.http.get(`${environment.base_url}/lunch/${id}`);
  }

  createLunch(data: any) {
    return this.http.post(`${environment.base_url}/lunch`, data);
  }

  activateOrInactivate(state) {
    return this.http.put(`${environment.base_url}/state-change`, state);
  }
}
