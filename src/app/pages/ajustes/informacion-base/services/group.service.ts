import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  getGroup(params = {}) {
    return this.http.get(`${environment.base_url}/group`, { params });
  }

  save(form) {
    return this.http.post(`${environment.base_url}/group`, form);
  }
}
