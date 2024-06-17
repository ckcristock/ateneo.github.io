import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BodeganuevoService {
  constructor(private http: HttpClient) {}

  public getBodegas(): Observable<any> {
    return this.http.get(environment.base_url + '/php/bodega_nuevo/get_bodegas.php');
  }

  getBodegasInternacionales(): Observable<any> {
    return this.http.get(environment.ruta + 'php/bodega_nuevo/get_bodegas_internacionales.php');
  }

  getBodegasPuntos(origen: string): Observable<any> {
    let p = { tipo: origen };
    return this.http.get(
      environment.ruta + 'php/ajusteindividual/' + 'consultar_bodega_punto.php',
      { params: p },
    );
  }
}
