import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Select } from '@shared/interfaces/global.interface';
import { Request } from 'src/app/shared/interfaces/request.interface';
import { environment } from 'src/environments/environment';
import { UserDetail } from './interfaces/detalle.interface';

export interface PersonConfig {
  boards: Select[];
  folders: Select[];
  companies: Select[];
  points: Select[];
  folderId: number;
  boardId: number;
  companiesId: Array<number>;
  pointId: number;
}

export interface BodyPersonConfig
  extends Pick<PersonConfig, 'boardId' | 'pointId' | 'folderId' | 'companiesId'> {}

@Injectable({
  providedIn: 'root',
})
export class DetalleService {
  private API_URL = `${environment.base_url}/`;

  constructor(private http: HttpClient) {}

  getBasicData(id) {
    return this.http.get(`${environment.base_url}/person/${id}`);
  }
  getBasicDataCustom(id) {
    return this.http.get(`${environment.base_url}/basicData/${id}`);
  }

  liquidar(data: any, id) {
    return this.http.put(`${environment.base_url}/liquidateOrActivate/${id}`, data);
  }

  blockUser(data: any, id) {
    return this.http.put(`${environment.base_url}/blockOrActivate/${id}`, data);
  }

  setPreliquidadoLog(info: any) {
    return this.http.post(`${environment.base_url}/preliquidation`, info);
  }

  getAllUserInfo(id: number): Observable<Request<UserDetail>> {
    return this.http.get<Request<UserDetail>>(`${this.API_URL}person-view/${id}`);
  }

  downloadLiquidationPdf(personId: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/liquidation/download/${personId}`, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  getPersonConfig(personId: number) {
    return this.http.get<Request<PersonConfig>>(`${this.API_URL}person-configuration/${personId}`);
  }

  putPersonConfig(body: BodyPersonConfig, id: number) {
    return this.http.put(`${this.API_URL}person-configuration/${id}`, body);
  }
}
