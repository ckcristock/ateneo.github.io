import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RotatingTurnService {
  constructor(private http: HttpClient) {}

  save(form) {
    return this.http.post(environment.base_url + '/rotating-turns', form);
  }
  getAllCreate(params = {}) {
    return this.http.get(environment.base_url + '/rotating-turns', { params });
  }
  getAll(params = {}) {
    return this.http.get(environment.base_url + '/get-rotating-turns', { params });
  }

  getAllSelect(params = {}) {
    return this.http.get(environment.base_url + '/rotating-turns', { params });
  }

  getTurn(id) {
    return this.http.get(environment.base_url + '/rotating-turns/' + id);
  }

  changeState(id) {
    return this.http.post(`${environment.base_url}/rotating-turns/change-state/${id}`, {});
  }
  update(id, body) {
    return this.http.patch(`${environment.base_url}/rotating-turns/${id}`, body);
  }
}
