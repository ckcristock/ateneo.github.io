import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FixedTurnService {
  constructor(private http: HttpClient) {}

  getFixedTurns(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-fixed-turns`, { params });
  }

  getFixedTurnsActive(params = {}) {
    return this.http.get(`${environment.base_url}/fixed-turns_active`, { params });
  }

  comboFixedTurns() {
    return this.http.get(`${environment.base_url}/fixed-turns`);
  }

  getFixedTurn(id) {
    return this.http.get(`${environment.base_url}/fixed-turns/${id}`);
  }

  getFixedTurnHours(params = {}) {
    return this.http.get(`${environment.base_url}/fixed-turn-hours`, {
      params,
    });
  }
  saveTurnFixed(data) {
    return this.http.post(`${environment.base_url}/fixed-turns`, data);
  }

  updateTurnFixed(data, id) {
    return this.http.put(`${environment.base_url}/fixed-turns/${id}`, data);
  }

  changeState(id) {
    return this.http.post(`${environment.base_url}/fixed-turns/change-state/${id}`, {});
  }
}
