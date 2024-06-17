import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompraNacionalService {
  constructor(private http: HttpClient) {}

  getListaComprasNacionales(params = {}) {
    return this.http.get(environment.base_url + '/php/comprasnacionales/lista_compras', { params });
  }

  getDatosComprasNacionales(params = {}) {
    return this.http.get(environment.base_url + '/php/comprasnacionales/datos_compras_nacionales', {
      params,
    });
  }

  getActividadOrdenCompra(params = {}) {
    return this.http.get(
      environment.base_url + '/php/comprasnacionales/actividad_orden_compra',
      params,
    );
  }

  getDetallePerfil(params = {}) {
    return this.http.get(environment.base_url + '/php/comprasnacionales/detalle_perfil', params);
  }

  getEstadosCompra() {
    return this.http.get(environment.base_url + '/get-estados-compra');
  }

  setEstadoCompra(params: any) {
    return this.http.post(environment.base_url + '/php/comprasnacionales/actualiza_compra', params);
  }

  getProducts(params = {}) {
    return this.http
      .get<[any, string[]]>(`${environment.base_url}/get-product-typeahead-oc`, { params })
      .pipe(map((response) => response['data']));
  }

  save(data) {
    return this.http.post(
      `${environment.base_url}/php/comprasnacionales/guardar_compra_nacional`,
      data,
    );
  }

  getCompraNacional() {}

  getTipoRechazo() {
    return this.http.get(`${environment.base_url}/php/comprasnacionales/detalle_rechazo`);
  }

  download(id: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/php/comprasnacionales/descarga_pdf.php/${id}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  getPurchaseRequests(pagination = {}) {
    const params = new HttpParams({ fromObject: pagination });
    return this.http.get(`${environment.base_url}/paginate-purchase-request-orden-compra`, {
      params,
    });
  }
}
