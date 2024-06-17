import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RetencionService {
  constructor(private client: HttpClient) {}

  getRetencionesPorModalidad(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/GENERALES/retenciones/get_retenciones_modalidad.php',
      { params: p },
    );
  }
}
