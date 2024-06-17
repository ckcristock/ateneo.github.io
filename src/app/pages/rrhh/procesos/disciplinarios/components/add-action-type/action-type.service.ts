import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Select } from '@shared/interfaces/global.interface';
import { Request, RequestPaginate } from '@shared/interfaces/request.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActionTypeService {
  private readonly API_URL = `${environment.base_url}/action-type`;

  constructor(private http: HttpClient) {}

  getActionTypePaginate(params: any): Observable<Request<RequestPaginate<Select[]>>> {
    return this.http.get<Request<RequestPaginate<Select[]>>>(`${this.API_URL}-paginate`, {
      params,
    });
  }

  getActionType(): Observable<any> {
    return this.http.get<Request<Select[]>>(`${this.API_URL}`);
  }

  createActionType(body: object): Observable<any> {
    return this.http.post(`${this.API_URL}`, body);
  }
}
