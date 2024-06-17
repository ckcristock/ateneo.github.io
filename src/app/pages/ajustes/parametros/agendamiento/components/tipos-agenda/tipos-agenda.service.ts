import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposAgendaService {
  constructor(private http: HttpClient) {}

  paginate(params = {}) {
    return this.http.get(`${environment.base_url}/type-appointments-paginate`, { params });
  }
}
