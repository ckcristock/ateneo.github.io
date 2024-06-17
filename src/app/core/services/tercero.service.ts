import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TerceroService {
  private _rutaBase: string = environment.ruta + 'php/terceros/';
  private _rutaConsultaEps: string = environment.ruta + 'php/GENERALES/eps/';

  constructor(private client: HttpClient) {}

  FiltrarTerceros(match: string): Observable<any> {
    let p = { coincidencia: match };
    return this.client.get(this._rutaBase + 'filtrar_terceros2.php', { params: p });
  }

  GetEpss(): Observable<any> {
    return this.client.get(this._rutaConsultaEps + 'lista_eps_radicaciones.php');
  }

  public cambiarEstadoTercero(tipo: string, id: any) {
    let p: any = {
      tipo: tipo,
      id: id,
    };
    return this.client.get(environment.ruta + 'php/terceros/cambiar_estado.php', { params: p });
  }
}
