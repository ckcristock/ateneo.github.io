import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Reemplaza a Globales

@Injectable({
  providedIn: 'root',
})
export class RadicacionService {
  constructor(private client: HttpClient) {}

  getRadicados(p = ''): Observable<any> {
    return this.client.get(environment.ruta + 'php/radicados/get_lista_radicados.php?' + p);
  }

  getFacturasParaRadicar(p: string = ''): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/radicados/get_facturas_para_radicacion.php?' + p,
    );
  }

  saveRadicado(data): Observable<any> {
    return this.client.post(environment.ruta + 'php/radicados/guardar_radicado.php', data);
  }

  eliminarRadicacion(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/radicados/eliminar_radicacion.php', data);
  }
}
