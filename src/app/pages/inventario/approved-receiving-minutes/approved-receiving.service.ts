import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApprovedReceivingService {
  private readonly API_URL = `${environment.base_url}/php/actarecepcion_nuevo/`;

  constructor(private readonly http: HttpClient) {}

  getApprovedReceivingMinutes(params: any): Observable<any> {
    return this.http.get(`${this.API_URL}lista_actarecepcion.php`, { params });
  }
}
