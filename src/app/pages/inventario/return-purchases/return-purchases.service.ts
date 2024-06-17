import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { skipContentType } from 'src/app/http.context';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReturnPurchasesService {
  private readonly API_URL = `${environment.base_url}/php/noconforme/`;

  constructor(private readonly http: HttpClient) {}

  getReturnMade(params: any): Observable<any> {
    return this.http.get(`${this.API_URL}devoluciones.php`, { params });
  }

  getReturnPending(params: any): Observable<any> {
    return this.http.get(`${this.API_URL}lista_no_conforme_compra_d.php`, { params });
  }

  getReceptionReport(id: number): Observable<any> {
    return this.http
      .get(`${this.API_URL}cargar_actas_recepcion.php`, {
        params: {
          id_proveedor: id,
        },
      })
      .pipe(map((rec: any) => rec.map((pro) => ({ value: pro.ID, text: pro.Acta }))));
  }

  getProviders(): Observable<any> {
    return this.http.get(`${environment.base_url}/php/comprasnacionales/proveedor_buscar.php`);
  }

  getProducts(params: any): Observable<any> {
    return this.http.get(`${this.API_URL}lista_productos.php`, { params });
  }

  getInvoiceRecord(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}cargar_facturas_actas_recepcion.php`, {
      params: { id_acta: id },
    });
  }

  getTax(): Observable<any> {
    return this.http.get(`${environment.base_url}/php/lista_generales.php`, {
      params: { modulo: 'Impuesto' },
    });
  }

  getDispensingPoint(id: number): Observable<any> {
    return this.http.get(
      `${environment.base_url}/php/inventario_fisico_puntos/lista_punto_funcionario.php`,
      {
        params: { id },
      },
    );
  }

  getReason(): Observable<any> {
    return this.http.get(`${environment.base_url}/php/lista_generales.php`, {
      params: { modulo: 'Causal_No_Conforme' },
    });
  }

  postNewReturnPurchases(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}generar_devolucion_dev.php`, body);
  }

  postGenerateNewOrder(body: any): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'text/plain',
    });
    return this.http.post(
      `${environment.base_url}/php/comprasnacionales/guardar_compra_nacional_pendientes.php`,
      body,
      {
        headers,
      },
    );
  }

  closeNonConforming(params: any): Observable<any> {
    return this.http.get(`${this.API_URL}cerrar_no_conforme.php`, { params });
  }

  cancelReturn(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}anular_devolucion.php`, body, {
      context: skipContentType(),
    });
  }

  postPrintReturnMade(params: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.API_URL}descargar_pdf.php`, {
      params,
      responseType: 'blob' as 'json',
      headers,
    });
  }
}
