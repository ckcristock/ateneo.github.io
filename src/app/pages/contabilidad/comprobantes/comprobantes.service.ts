import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ComprobantesService {
  constructor(private http: HttpClient) {}
  private rutaBase = environment.base_url;

  // Egresos

  // comprobanteegresovarioscrear

  // Ingresos

  // Notas Credito

  getNotaCreditoPDF(idNotaCredito: string) {
    const url = `${this.rutaBase}/php/notas_credito_nuevo/descarga_pdf.php?tipo=Nota_Credito&id=${idNotaCredito}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getNiifNostasCredito(idNotaCredito: string, idFuncionario: string) {
    let url = `${this.rutaBase}/php/contabilidad/movimientoscontables/movimientos_nota_credito_global_pdf.php?id_registro=${idNotaCredito}&id_funcionario_elabora=${idFuncionario}&tipo=Niif`;
    return this.http.get(url, { responseType: 'blob' });
  }
  // Notas Debito

  // Notas Contables

  getNiifNostasContables(idDocumentoContable: any) {
    const url = `${this.rutaBase}/php/contabilidad/notascontables/descarga_pdf.php?id=${idDocumentoContable}&tipo=Niif`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
