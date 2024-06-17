import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpirationsService {
  private readonly API_URL = `${environment.ruta}/php/bodega/`;

  constructor(private readonly http: HttpClient) {}

  getWinery(params: any): Observable<any> {
    return this.http.get(`${this.API_URL}bodega_punto.php`, { params });
  }

  getExpirations(params: any): Observable<any> {
    return this.http.get(`${this.API_URL}vencimientos.php`, { params });
  }
}
