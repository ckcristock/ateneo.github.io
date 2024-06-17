import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RotatingTurnsService {
  constructor(private http: HttpClient) {}

  getRotatingTurns(params = {}) {
    return this.http.get(`${environment.base_url}/rotating-turns`, { params });
  }
}
