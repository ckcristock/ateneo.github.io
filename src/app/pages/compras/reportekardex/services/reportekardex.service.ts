import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportekardexService {
  constructor(private http: HttpClient) {}

  downloadKardex(params): Observable<any> {
    console.log('params', params);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/php/archivos/descarga_kardexd.php${params}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  downloadInvoice(Id_Factura): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(
      `${environment.base_url}/php/facturasventas/descarga_pdf.php?id=${Id_Factura}`,
      {
        headers,
        responseType: 'blob' as 'json',
      },
    );
  }

  downloadReporteKardex(ruta, id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/php/${ruta}?id=${id}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  currentDateTime() {
    let ahora = new Date();
    let dia = ahora.getDate();
    let mes = ahora.getMonth() + 1;
    let anio = ahora.getFullYear();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    let segundos = ahora.getSeconds();

    let diaFormateado = dia <= 9 ? '0' + dia : dia;
    let mesFormateado = mes <= 9 ? '0' + mes : mes;
    let horasFormateadas = horas <= 9 ? '0' + horas : horas;
    let minutosFormateados = minutos <= 9 ? '0' + minutos : minutos;
    let segundosFormateados = segundos <= 9 ? '0' + segundos : segundos;

    return `${anio}-${mesFormateado}-${diaFormateado} ${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
  }
}
