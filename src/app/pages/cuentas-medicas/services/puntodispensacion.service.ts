import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PuntodispensacionService {
  private _rutaBase: string = environment.ruta + 'php/puntodispensacion/';

  constructor(
    private http: HttpClient,
    //  private globales:Globales
  ) {}

  getPuntosDispensacion(): Observable<any> {
    return this.http.get(environment.ruta + 'php/funcionarios/puntos_funcionario.php');
  }

  public GetDetallePuntoDispensacion(idPunto: string): Observable<any> {
    let p = { id: idPunto };
    return this.http.get(this._rutaBase + 'get_detalle_punto_dispensacion.php', { params: p });
  }

  public GetPuntoDispensacionDetallado(idPunto: string): Observable<any> {
    let p = { id: idPunto };
    return this.http.get(this._rutaBase + 'get_punto_dispensacion_detallado.php', { params: p });
  }

  public GuardarPuntosDispensacion(data: FormData): Observable<any> {
    return this.http.post(this._rutaBase + 'guardar_punto_dispensacion.php', data);
  }

  public EdicionPuntosDispensacion(data: FormData): Observable<any> {
    return this.http.post(this._rutaBase + 'editar_punto_dispensacion.php', data);
  }

  public validarDisAuditoria(p: any): Observable<any> {
    return this.http.get(environment.ruta + 'php/dispensaciones/validacion_dispensacion.php', {
      params: p,
    });
  }
  // public validarAuditoria(idPunto:string):Observable<any>{
  //   let p = {id:idPunto};
  //   return this.client.get(this._rutaBase+'get_punto_dispensacion_detallado.php', {params:p});
  // }
}
