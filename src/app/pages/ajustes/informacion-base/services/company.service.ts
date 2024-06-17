import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Responses } from '@app/core/interfaces/responses';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getCompanies(params = {}): Observable<Responses> {
    return this.http.get<Responses>(`${environment.base_url}/company`, { params });
  }

  getTypeOneCompanies() {
    return this.http.get(`${environment.base_url}/get-companies`);
  }

  setCompanies(personId: any, body: any) {
    return this.http.post(`${environment.base_url}/person/set-companies/${personId}`, body);
  }

  //Empresas en las que puede trabajar el funcionario
  getPersonCompanies(personId: any) {
    return this.http.get(`${environment.base_url}/person/get-companies/${personId}`);
  }
}
