import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposTerminosService {
  constructor(private http: HttpClient) {}

  getTermsTypeList() {
    return this.http.get(`${environment.base_url}/contract-terms`);
  }

  //crear servicio que filtra
  getTermsTypes(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-contract-term`, { params });
  }

  createTermType(data: any) {
    return this.http.post(`${environment.base_url}/contract-terms`, data);
  }
}
