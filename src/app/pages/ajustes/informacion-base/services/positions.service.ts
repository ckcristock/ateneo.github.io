import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) {}

  getPositions(params = {}) {
    return this.http.get(`${environment.base_url}/positions`, { params });
  }
  save(form) {
    return this.http.post(`${environment.base_url}/positions`, form);
  }
}
