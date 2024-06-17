import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TabladepreciacionService {
  env = environment.base_url;

  constructor(private readonly http: HttpClient) {}

  guardarDepreciacion(datos: any): Observable<any> {
    return this.http.post(`${this.env} /php/depreciacion/guardar_depreciacion.php`, datos);
  }
}
