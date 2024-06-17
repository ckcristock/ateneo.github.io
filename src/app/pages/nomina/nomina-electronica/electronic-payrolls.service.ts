import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ElectronicPayrollsService {
  constructor(private http: HttpClient) {}

  getPayrolls(id) {
    return this.http.get(`${environment.base_url}/electronic-payroll-paginate/${id}`);
  }

  getStatistcs(id) {
    return this.http.get(`${environment.base_url}/electronic-payroll-statistics/${id}`);
  }

  getElectronicPayroll(id) {
    return this.http.get(`${environment.base_url}/electronic-payroll/${id}`);
  }
  reportElectronic({ id, idPersonPayroll }) {
    return this.http.post(
      `${environment.base_url}/payroll/report-electronic/${id}/${idPersonPayroll}`,
      {},
    );
  }
  reportAllElectronic(id) {
    return this.http.post(`${environment.base_url}/payroll/report-electronic/${id}`, {});
  }
  deleteElectronicPayroll(id) {
    return this.http.delete(`${environment.base_url}/electronic-payroll/${id}`);
  }
}
