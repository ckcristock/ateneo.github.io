import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConsecutivosService {
  constructor(private http: HttpClient) {}

  paginate(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-comprobante-consecutivo`, { params });
  }

  guardarConsecutivo(data: any, id: any) {
    return this.http.put(`${environment.base_url}/comprobante-consecutivo/${id}`, data);
  }

  getConsecutivo(table: any) {
    return this.http.get(`${environment.base_url}/get-consecutivo/${table}`);
  }

  construirConsecutivo(object: any, city = '', context = 'crear') {
    let con = object.Consecutivo;
    context != 'editar' ? (con = con + 1) : '';
    let today = new Date();
    let today_ = {
      anio: '',
      mes: '',
      dia: '',
    };
    today_.anio = today.toLocaleDateString('es', { year: '2-digit' });
    today_.mes = today.toLocaleDateString('es', { month: '2-digit' });
    today_.dia = today.toLocaleDateString('es', { day: '2-digit' });
    let consecutivo =
      object.Prefijo +
      (object.city ? '.' + city : '-') +
      con.toString().padStart(object.longitud, 0) +
      (object.Anio || object.Mes || object.Dia ? '-' : '') +
      (object.Anio ? today_.anio : '') +
      (object.Mes ? today_.mes : '') +
      (object.Dia ? today_.dia : '');
    return consecutivo;
  }
}
