import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NominaConfigService {
  constructor(private http: HttpClient) {}

  getAllParams() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/all`);
  }

  getExtras() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/extras`);
  }
  getIncapacidades() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/incapacidades`);
  }
  getNovedades() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/novelties`);
  }
  getParafiscales() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/parafiscales`);
  }
  getRiesgos() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/riesgos`);
  }
  getSeguridadEmpresa() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/ssocial_empresa`);
  }
  getSeguridadFuncionario() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/ssocial_funcionario`);
  }

  /* getTipoActivosFijos(params){  //del php puro, es tipo de activos
    return this.http.get(
      `${environment.base_url}/php/tipoactivo/get_lista_tipo_activo.php?`, {params}
    );
  } */

  getAccountingAccount(params) {
    return this.http.get<readonly string[]>(
      `${environment.base_url}/php/plancuentas/filtrar_cuentas.php`,
      params,
    );
    //http.get<readonly string[]>(environment.base_url + "/php/plancuentas/filtrar_cuentas.php", { params: { coincidencia: term, tipo: 'niif' }})
  }

  getCountableIncome() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/income`);
  }

  getCountableDeductions() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/deductions`);
  }

  getLiquidation() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/liquidations`);
  }

  getSalariosSubsidios() {
    return this.http.get(`${environment.base_url}/parametrizacion/nomina/salarios-subsidios`);
  }

  getPeopleWithDni(params) {
    return this.http
      .get<[any, string[]]>(`${environment.base_url}/people-with-dni`, { params })
      .pipe(map((response) => response['data']));
  }

  getResponsablesNomina() {
    return this.http.get(`${environment.base_url}/payroll-manager`);
  }

  /////////////////////////UPDATES//////////////////////////////////////

  createUpdatePayrollManager(data) {
    return this.http.post(`${environment.base_url}/payroll-manager`, data);
  }

  updateExtras(id, data = {}) {
    return this.http.put(
      `${environment.base_url}/parametrizacion/nomina/extras/update/${id}`,
      data,
    );
  }

  updateSSocialPerson(id, data = {}) {
    return this.http.put(
      `${environment.base_url}/parametrizacion/nomina/seguridad-social-persona/update/${id}`,
      data,
    );
  }

  updateSSocialCompany(id, data = {}) {
    return this.http.put(
      `${environment.base_url}/parametrizacion/nomina/seguridad-social-company/update/${id}`,
      data,
    );
  }

  updateRiesgosArl(id, data = {}) {
    return this.http.put(
      `${environment.base_url}/parametrizacion/nomina/riesgos-arl/update/${id}`,
      data,
    );
  }

  updateParafiscales(id, data = {}) {
    return this.http.put(
      `${environment.base_url}/parametrizacion/nomina/parafiscales/update/${id}`,
      data,
    );
  }

  updateNovedades(id, data = {}) {
    return this.http.put(
      `${environment.base_url}/parametrizacion/nomina/novedades/update/${id}`,
      data,
    );
  }

  updateIncapacidades(id, data = {}) {
    return this.http.put(
      `${environment.base_url}/parametrizacion/nomina/incapacidades/update/${id}`,
      data,
    );
  }

  updateCreateNovedades(data = {}) {
    return this.http.post(`${environment.base_url}/disability-leaves`, data);
  }

  updateCreateIngresos(data = {}) {
    return this.http.post(`${environment.base_url}/parametrizacion/nomina/income/update`, data);
  }

  updateCreateEgresos(data = {}) {
    return this.http.post(`${environment.base_url}/parametrizacion/nomina/deductions/update`, data);
  }

  updateCreateLiquidaciones(data = {}) {
    return this.http.post(
      `${environment.base_url}/parametrizacion/nomina/liquidations/update`,
      data,
    );
  }

  updateCreateSalariosSubsidios(data = {}) {
    return this.http.post(
      `${environment.base_url}/parametrizacion/nomina/salarios-subsidios/update`,
      data,
    );
  }

  updateCreatePayrollManager(data) {
    return this.http.post(`${environment.base_url}/payroll-manager`, data);
  }
}
