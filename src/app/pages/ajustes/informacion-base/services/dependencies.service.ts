import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DependenciesService {
  constructor(private http: HttpClient) {}

  getDependencies(params = {}) {
    return this.http.get(`${environment.base_url}/dependencies`, { params });
  }

  save(form) {
    return this.http.post(`${environment.base_url}/dependencies`, form);
  }
}
