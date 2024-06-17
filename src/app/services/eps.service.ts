import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EpsService {
  private _rutaBase: string = environment.ruta + 'php/GENERALES/eps/';

  constructor(private client: HttpClient) {
    // private globales: Globales
  }

  public GetEntidadesSalud(): Observable<any> {
    return this.client.get(this._rutaBase + 'get_entidades_salud_select.php');
  }

  // Metodos de lista precio eps
  public GetProductosEvento(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/listaprecioeps/get_productos_evento.php', {
      params: p,
    });
  }
  public ValidarCum(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/listaprecioeps/validar_cum.php', { params: p });
  }
  SaveProducto(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/listaprecioeps/save_producto.php', data);
  }
}
