import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Request } from '../interfaces/request.interface';
import { GroupCompany } from '../interfaces/group-company.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupCompanyService {
  private readonly API_URL = `${environment.base_url}/`;

  constructor(private readonly http: HttpClient) {}

  getGroupCompany(company_id?: number): Observable<Request<GroupCompany[]>> {
    return this.http.get<Request<GroupCompany[]>>(`${this.API_URL}group-company`, {
      params: {
        company_id: company_id ?? '',
      },
    });
  }
}
