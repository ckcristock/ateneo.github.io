import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FixedTurnsService {
  constructor(private http: HttpClient) {}

  getFixedTurns(params = {}) {
    return this.http.get(`${environment.base_url}/fixed-turns`, { params });
  }
}
