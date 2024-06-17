import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private readonly http: HttpClient) {}

  getPatientsChart(): Observable<any> {
    return this.http.get(`${environment.base_url}/patients-chart`);
  }

  getPatients(params: any): Observable<any> {
    return this.http.get(`${environment.base_url}/patients-paginate`, { params });
  }

  getEps(): Observable<any> {
    return this.http.get(`${environment.base_url}/epss`);
  }

  getDocumentType(): Observable<any> {
    return this.http.get(`${environment.base_url}/type-documents`);
  }

  getLevels(): Observable<any> {
    return this.http.get(`${environment.base_url}/levels`);
  }

  getRegimenType(): Observable<any> {
    return this.http.get(`${environment.base_url}/regime-type`);
  }

  postImportPatient(body: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'text/plain',
    });
    return this.http.post(`${environment.base_url}/patients-import`, body, {
      headers,
    });
  }

  putEditPatient(body: FormData, id: number): Observable<any> {
    return this.http.put(`${environment.base_url}/patients/${id}`, body);
  }
}
