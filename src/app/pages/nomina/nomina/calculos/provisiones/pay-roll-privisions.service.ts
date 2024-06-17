import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayRollProvisionsService {
  constructor(private http: HttpClient) {}

  getProvisions({ pid, inicio, fin }) {
    return this.http.get(
      `${environment.base_url}/payroll/provisions/person/${pid}/${inicio}/${fin}`,
    );
  }
}
