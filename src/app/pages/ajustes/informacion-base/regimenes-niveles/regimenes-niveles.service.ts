import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegimenesNivelesService {
  constructor(private http: HttpClient) {}

  getRegimes(params = {}) {
    return this.http.get(`${environment.base_url}/paginateRegimes`, { params });
  }

  getLevelsRegime(id: any, params = {}) {
    return this.http.get(`${environment.base_url}/levels-with-regimes/${id}`, { params });
  }
}
