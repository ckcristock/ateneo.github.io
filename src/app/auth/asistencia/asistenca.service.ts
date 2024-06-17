import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  constructor(private readonly http: HttpClient) {}

  validate(data: { imagen: any }): Observable<object> {
    return this.http.post(`${environment.base_url}/asistencia/validar`, data);
  }
}
