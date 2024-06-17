import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmbalajeService {
  constructor(private http: HttpClient) {}

  paginate(params = {}) {
    return this.http.get(`${environment.base_url}/packaging-paginate`, { params });
  }

  index() {
    return this.http.get(`${environment.base_url}/packaging`);
  }

  store(data) {
    return this.http.post(`${environment.base_url}/packaging`, data);
  }
}
