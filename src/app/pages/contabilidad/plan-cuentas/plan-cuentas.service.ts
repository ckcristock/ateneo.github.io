import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanCuentasService {
  constructor(private http: HttpClient) {}

  getAccount_plan(params = {}) {
    return this.http.get(`${environment.base_url}/account_plan`, { params });
  }

  createAccount_plan(data: any) {
    return this.http.post(`${environment.base_url}/account_plan`, data);
  }

  getBanks() {
    return this.http.get(`${environment.base_url}/banks`);
  }

  getCompanies() {
    return this.http.get(`${environment.base_url}/company`);
  }

  importCommercialPuc() {
    return this.http.get(`${environment.base_url}/import-commercial-puc`);
  }

  paginate2() {
    return this.http.get(`${environment.base_url}/plan-cuentas-paginacion`);
  }

  /* Servicios de php */

  getPlanCuentas(params = {}) {
    return this.http.get(`${environment.base_url}/php/plancuentas/lista_plan_cuentas.php${params}`);
  }

  descargarExcel(company_id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(
      `${environment.base_url}/php/contabilidad/plancuentas/descargar_informe_plan_cuentas_excel.php?id=${company_id}`,
      { headers, responseType: 'blob' as 'json' },
    );
  }

  listarBancos() {
    return this.http.get(`${environment.base_url}/php/plancuentas/lista_bancos.php`);
  }

  obtenerPlan(params = {}) {
    return this.http.get(
      `${environment.base_url}/php/contabilidad/plancuentas/detalle_plan_cuenta.php`,
      { params },
    );
  }

  validarNiveles(params = {}) {
    return this.http.get(`${environment.base_url}/php/plancuentas/validar_puc_niveles.php`, {
      params,
    });
  }

  validateImport(data, boolean) {
    return this.http.post(
      `${environment.base_url}/import-validator-account-plans/${boolean}`,
      data,
    );
  }

  importInitialBalances(data) {
    return this.http.post(`${environment.base_url}/import-initial-balances`, data);
  }
}
