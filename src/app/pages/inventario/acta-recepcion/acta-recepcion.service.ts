import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActaRecepcionService {
  constructor(private http: HttpClient) {}

  getComprasPendientes(params = {}) {
    return this.http.get(`${environment.base_url}/php/bodega_nuevo/lista_compras_pendientes.php`, {
      params,
    });
  }

  getActaRecepcion(params = {}) {
    return this.http.get(
      `${environment.base_url}/php/actarecepcion_nuevo/lista_actas_pendientes.php`,
      { params },
    );
  }

  getActasAnuladas(params = {}) {
    return this.http.get(`${environment.base_url}/php/actarecepcion/lista_acta_anula.php`, {
      params,
    });
  }

  getCausalesAnulacion() {
    return this.http.get(`${environment.base_url}/php/facturasventas/causales_anulacion.php`);
  }

  getActasIngresadas(params = {}) {
    return this.http.get(
      `${environment.base_url}/php/actarecepcion_nuevo/lista_actarecepcion.php`,
      { params },
    );
  }

  getActaRecepcionCompra(params = {}) {
    return this.http.get(
      `${environment.base_url}/php/bodega_nuevo/acta_recepcion_comprad_test.php`,
      { params },
    );
  }

  detalleActa(params = {}) {
    return this.http.get(`${environment.base_url}/php/bodega_nuevo/detalle_acta_recepcion.php`, {
      params,
    });
  }

  getActividadesActa(params = {}) {
    return this.http.get(
      `${environment.base_url}/php/actarecepcion/actividades_acta_recepcion_compra.php`,
      { params },
    );
  }

  codigoBarras(params = {}) {
    return this.http.get(environment.base_url + '/php/actarecepcion/codigo_barrad.php', { params });
  }

  save(data: any) {
    return this.http.post(
      `${environment.base_url}/php/bodega_nuevo/guardar_acta_recepciond.php`,
      data,
    );
  }

  validate(id: any) {
    return this.http.get(`${environment.base_url}/validate-acta-history/${id}`);
  }

  getNonConforming() {
    return this.http.get(`${environment.base_url}/php/actarecepcion/causal_no_conformes.php`);
  }

  getTaxIva() {
    return this.http.get(environment.base_url + '/impuestos');
  }

  getNonConformingPaginate(pagination: any) {
    return this.http.get(`${environment.base_url}/php/actarecepcion/causalnoconformes`, {
      params: pagination,
    });
  }

  postNonconforming(body: any) {
    return this.http.post(`${environment.base_url}/php/actarecepcion/causalnoconformes`, body);
  }

  patchNonconforming(body: any, id: number) {
    return this.http.patch(
      `${environment.base_url}/php/actarecepcion/causalnoconformes/${id}`,
      body,
    );
  }

  seeAccounting(file: string, params: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/php/contabilidad/movimientoscontables/${file}`, {
      responseType: 'blob' as 'json',
      headers,
      params,
    });
  }
}
