import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DireccionamientoService {
  globales = environment;

  constructor(private client: HttpClient) {}

  getDireccionamientos(p: any): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/mipres/get_direccionamientos.php', {
      params: p,
    });
  }

  getDetallesDireccionamiento(id: any): Observable<any> {
    let p = { id: id };
    return this.client.get(this.globales.ruta + 'php/mipres/get_detalle_direccionamiento.php', {
      params: p,
    });
  }
}
