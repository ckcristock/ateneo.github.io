import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IngresosService {
  constructor(private http: HttpClient) {}

  verComprobante(comprobanteId) {
    return this.http.get(
      `${environment.base_url}/php/comprobantes/comprobantes_pdf.php?id=${comprobanteId}`,
      { responseType: 'blob' },
    );
  }

  contabNIIF(comprobanteId) {
    const baseUrl = `${environment.base_url}/php/contabilidad/movimientoscontables/movimientos_comprobante_pdf.php`;
    const queryParams = `?id_registro=${comprobanteId}&id_funcionario_elabora=1&tipo=Ingreso&tipo_valor=Niif`;
    const url = baseUrl + queryParams;
    return this.http.get(url, { responseType: 'blob' });
  }
}
