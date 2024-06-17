import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CustometypeaheadService {
  constructor(private http: HttpClient) {}

  Filtrar(match: string, ruta: string): Observable<any> {
    let p = { coincidencia: match };
    return this.http.get(environment + ruta, { params: p });
  }
}
