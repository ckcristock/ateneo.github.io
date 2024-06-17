import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LiquidadosService {
  constructor(private http: HttpClient) {}

  getLiquidado(id: any) {
    return this.http.get(`${environment.base_url}/liquidado/${id}`);
  }

  mostrar(id, fechafin) {
    return this.http.get(
      `${environment.base_url}/nomina/liquidaciones/funcionarios/${id}/mostrar/${fechafin}`,
    );
  }

  vacacionesActuales(params = {}, id) {
    return this.http.post(
      `${environment.base_url}/nomina/liquidaciones/${id}/vacaciones_actuales`,
      { params },
    );
  }

  salarioBase(params = {}, id) {
    return this.http.post(`${environment.base_url}/nomina/liquidaciones/${id}/salario_base`, {
      params,
    });
  }

  bases(params = {}, id) {
    return this.http.post(`${environment.base_url}/nomina/liquidaciones/${id}/bases`, { params });
  }

  ingresos(params = {}, id) {
    return this.http.post(`${environment.base_url}/nomina/liquidaciones/${id}/ingresos`, {
      params,
    });
  }

  getPdfLiquidacion(data) {
    return this.http.post(`${environment.base_url}/nomina/liquidaciones/previsualizacion`, data);
  }

  liquidar(data: any) {
    return this.http.post(`${environment.base_url}/liquidation`, data);
  }

  getDiasTrabajados(id, fechaFin) {
    return this.http.get(
      `${environment.base_url}/nomina/liquidaciones/dias-trabajados/${id}/${fechaFin}`,
    );
  }
}
