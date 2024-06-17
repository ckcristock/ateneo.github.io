import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../../shared/globales/globales';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuditoriaspendientesService {
  constructor(private client: HttpClient) {}
  getAuditoriasPendientes(p: string): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/Superauditoria/get_auditorias_pendientes_cloud.php?' + p,
    );
  }
  /*  getAuditoriasPendientes(p:string):Observable<any>{
    return this.client.get(environment.ruta+'php/Superauditoria/get_auditorias_pendientes.php?'+p);
  } */
  saveEstado(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/Superauditoria/completar_datos.php', data);
  }
  getAuditoriasRechazadas(p: string): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/Superauditoria/get_auditorias_rechazadas.php?' + p,
    );
  }
  getDetalleCabecera(p: string): Observable<any> {
    return this.client.get(environment.ruta + 'php/Superauditoria/get_detalle_cabecera.php?' + p);
  }
  updateDocumentoAuditoria(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/Superauditoria/update_archivo.php', data);
  }
  getAuditoriasConObseracion(p: string): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/Superauditoria/get_auditorias_observacion.php?' + p,
    );
  }
  getAuditoriasListas(p: string): Observable<any> {
    return this.client.get(environment.ruta + 'php/Superauditoria/get_auditorias.php?' + p);
  }
  getTipoServicio(): Observable<any> {
    return this.client.get(environment.ruta + 'php/Superauditoria/tipo_servicio.php');
  }
  getDepartamentos(): Observable<any> {
    return this.client.get(environment.ruta + 'php/Superauditoria/get_departamentos.php');
  }
  anularDispensacion(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/Superauditoria/anular_auditoria.php', data);
  }
  getTipoSoporte(p: string): Observable<any> {
    return this.client.get(environment.ruta + 'php/Superauditoria/get_soportes.php?id=' + p);
  }
}
