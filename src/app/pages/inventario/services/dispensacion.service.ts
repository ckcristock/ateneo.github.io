import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../../shared/globales/globales';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispensacionService {
  constructor(private client: HttpClient) {}

  public GetDataPositiva(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_datos_positiva.php', {
      params: p,
    });
  }

  public GetServicios(punto: string): Observable<any> {
    let p = { punto: punto };
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_servicios.php', {
      params: p,
    });
  }
  public GetTipoServicios(serv: string, id_punto: string): Observable<any> {
    let p = { serv: serv, id_punto: id_punto };
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_tipo_servicios.php', {
      params: p,
    });
  }

  public GetSoportes(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_tipos_soporte.php', {
      params: p,
    });
  }
  public GetNumeroPrescripcion(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_numero_prescripcion.php',
      { params: p },
    );
  }
  public GetIdDireccionamineto(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_id_direccionamiento.php',
      { params: p },
    );
  }
  public GetProductosNumeroPrescripcion(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_productos_numero_prescripcion.php',
      { params: p },
    );
  }
  public GetProductosIdDireccionamiento(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_productos_id_direccionamiento.php',
      { params: p },
    );
  }

  public GetCamposDinamicosDispensacion(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_campos_dispensacion.php',
      { params: p },
    );
  }

  public GetInformacionTipoServicio(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_info_tipo_servicio.php',
      { params: p },
    );
  }

  public GetCamposDinamicosProductosDispensacion(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_campos_productos_dispensacion.php',
      { params: p },
    );
  }

  public GetPaciente(idPaciente: string, idPunto: string): Observable<any> {
    let p = { id_paciente: idPaciente, id_punto: idPunto };
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_paciente.php', {
      params: p,
    });
  }
  public GetTipoDocumento(): Observable<any> {
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_tipo_documento.php');
  }

  public GetNombreCodigoCie(idCie: string): Observable<any> {
    let p = { id: idCie };
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_cie.php', {
      params: p,
    });
  }

  public GetTablero(id: string): Observable<any> {
    let p = { id: id };
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_tablero_funcionario.php',
      { params: p },
    );
  }

  public GetListaProductosInventario(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_producto_inventario.php',
      { params: p },
    );
  }

  public GetListaProductosDispensacion(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_producto_inventario.php',
      { params: p },
    );
  }
  public GetProductosMipresInventario(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_producto_mipres_inventario.php',
      { params: p },
    );
  }
  public GetListaProductosAtc(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_producto_atc_inventario.php',
      { params: p },
    );
  }
  public ValidarProductoLista(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/validar_producto.php', {
      params: p,
    });
  }

  public GetEntregaPaciente(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_entregas_dis.php', {
      params: p,
    });
  }
  public GetTurnos(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_turnos.php', {
      params: p,
    });
  }
  public GetTurnosAuditoria(p: any): Observable<any> {
    let param = {
      id: p,
    };
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/get_turnos_auditoria.php', {
      params: param,
    });
  }
  public GetTurnosDispensador(p: string, func: string): Observable<any> {
    let param = {
      id_punto: p,
      funcionario: func,
    };
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_turnos_dispensador.php',
      {
        params: param,
      },
    );
  }
  public GetSiguienteTurno(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/get_siguiente_turno_dev.php',
      {
        params: p,
      },
    );
  }
  public CambiarTurnoPreaditoria(p: any): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/cambiar_turno_preauditoria.php',
      { params: p },
    );
  }

  public IniciarAtencion(p: any): Observable<any> {
    return this.client.get(environment.ruta + 'php/tablero_dispensacion/iniciar_atencion.php', {
      params: p,
    });
  }

  public SaveDispensacion(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/save_dispensacion.php',
      data,
    );
  }

  public SaveEntregaPendiente(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/save_pendientes.php',
      data,
    );
  }

  public SaveAuditoria(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/save_auditoria_dev.php',
      data,
    );
  }
  public IniciarAtencionPendientes(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/iniciar_atencion_pendientes.php',
      data,
    );
  }
  public IniciarAtencionAuditoria(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/iniciar_atencion_auditoria.php',
      data,
    );
  }
  public IniciarAtencionDispensacion(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/iniciar_atencion_dispensacion.php',
      data,
    );
  }
  public SavePreAuditoria(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/save_preauditoria.php',
      data,
    );
  }

  public SaveDispensacionAuditoria(data: FormData) {
    return this.client.post(
      environment.ruta + 'php/tablero_dispensacion/save_dispensacion_auditor.php',
      data,
    );
  }

  public ValidarNumeroAutorizacion(p): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/tablero_dispensacion/validar_numero_autorizacion.php',
      {
        params: p,
      },
    );
  }
}
