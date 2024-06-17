import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
//import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  constructor(private client: HttpClient) {}
  getServicios(p: string): Observable<any> {
    return this.client.get(environment.ruta + 'php/servicio/servicios.php?' + p);
  }

  getServiciosNgSelect(): Observable<any> {
    return this.client.get(environment.ruta + 'php/servicio/servicios_ng_select.php');
  }

  saveServicio(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/servicio/guardar_servicio.php', data);
  }
  inactivarServicio(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/servicio/inactivar_servicio.php', data);
  }
}
