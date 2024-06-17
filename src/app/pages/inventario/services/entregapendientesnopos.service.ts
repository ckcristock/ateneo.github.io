import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../../shared/globales/globales';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class EntregapendientesnoposService {
  constructor(private client: HttpClient) {}

  getPendientes(p: string): Observable<any> {
    return this.client.get(environment.ruta + 'php/entregapendientes/get_pendientes.php?' + p);
  }
  getProductosCambio(p: string): Observable<any> {
    return this.client.get(environment.ruta + 'php/entregapendientes/get_cambio_producto.php?' + p);
  }
  getProductosDispensacion(p: string): Observable<any> {
    return this.client.get(
      environment.ruta + 'php/entregapendientes/get_productos_cambio.php?' + p,
    );
  }
  getDetallePunto(p: string): Observable<any> {
    return this.client.get(environment.ruta + 'php/entregapendientes/get_detalle_punto.php?' + p);
  }
  saveEntregaPendientes(data: FormData): Observable<any> {
    return this.client.post(
      environment.ruta + 'php/entregapendientes/guardar_entrega_pendientes.php',
      data,
    );
  }
  saveActaEntrega(data: FormData): Observable<any> {
    return this.client.post(environment.ruta + 'php/entregapendientes/save_acta_entrega.php', data);
  }
  saveCambioProductoNoPos(data: FormData): Observable<any> {
    return this.client.post(
      environment.ruta + 'php/entregapendientes/guardar_cambio_producto_nopos.php',
      data,
    );
  }
  DescargarExcel(p: string) {
    window.open(
      environment.ruta + 'php/entregapendientes/get_reporte_pendientes_excel.php?' + p,
      '_blank',
    );
  }
}
