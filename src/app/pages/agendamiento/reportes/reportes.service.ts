import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  constructor(private http: HttpClient) {}

  download(params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(environment.base_url + '/reporte', {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }
}
