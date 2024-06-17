import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../../shared/globales/globales';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class TiposervicioService {
  constructor(
    private client: HttpClient,
    // private globales:Globales
  ) {}

  getTipos(): Observable<any> {
    return this.client.get(environment.ruta + 'php/GENERALES/tiposervicio/get_tipos_servicio.php');
  }

  getTiposAll(): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/GENERALES/tiposervicio/get_tipos_servicio_all.php',
    );
  }

  getTiposServiciosNgSelect(idServicio: string): Observable<any> {
    let p = { id_servicio: idServicio };
    return this.client.get(
      environment.ruta + 'php/GENERALES/tiposervicio/get_tipos_servicio_ng_select.php',
      { params: p },
    );
  }

  public GetServiciosTipoServicio(): Observable<any> {
    return this.client.get(environment.ruta + 'php/dispensaciones/get_servicios.php');
  }
  public GetServicios(): Observable<any> {
    return this.client.get(environment.ruta + 'php/dispensaciones/get_servicios_tipo_servicio.php');
  }
}
