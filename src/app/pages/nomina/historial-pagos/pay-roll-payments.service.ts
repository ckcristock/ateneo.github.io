import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Request, RequestPaginate } from '@shared/interfaces/request.interface';
import { environment } from 'src/environments/environment';
import { DetailsDianReport } from './interfaces/details-report.interface';

@Injectable({
  providedIn: 'root',
})
export class PayRollPaymentsService {
  private readonly API_URL = `${environment.base_url}/payroll/`;

  constructor(private http: HttpClient) {}

  getPayrollHistory(params) {
    return this.http.get(`${this.API_URL}history/payments`, { params });
  }

  postDianReport(body: { payroll_payment_id: number }): Observable<any> {
    return this.http.post(`${this.API_URL}dian-report`, { body });
  }

  getDetailsDianReport(
    id: number,
    params: any,
  ): Observable<Request<RequestPaginate<DetailsDianReport[]>>> {
    return this.http.get<Request<RequestPaginate<DetailsDianReport[]>>>(
      `${this.API_URL}details-dian-report/${id}`,
      {
        params,
      },
    );
  }
}
