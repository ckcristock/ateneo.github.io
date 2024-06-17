import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  globales = environment;
  constructor(private client: HttpClient) {}
  getServicios(p: string): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/servicio/servicios.php?' + p);
  }

  getServiciosNgSelect(): Observable<any> {
    return this.client.get(this.globales.ruta + 'php/servicio/servicios_ng_select.php');
  }

  saveServicio(data: FormData): Observable<any> {
    return this.client.post(this.globales.ruta + 'php/servicio/guardar_servicio.php', data);
  }
  inactivarServicio(data: FormData): Observable<any> {
    return this.client.post(this.globales.ruta + 'php/servicio/inactivar_servicio.php', data);
  }
}
