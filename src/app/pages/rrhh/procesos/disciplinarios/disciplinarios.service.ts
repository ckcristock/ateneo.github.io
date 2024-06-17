import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Select } from '@shared/interfaces/global.interface';
import { Request, RequestPaginate } from '@shared/interfaces/request.interface';

@Injectable({
  providedIn: 'root',
})
export class DisciplinariosService {
  constructor(private http: HttpClient) {}

  getDisciplinaryProcess(params = {}) {
    return this.http.get(`${environment.base_url}/disciplinary_process`, {
      params,
    });
  }

  createNewProcess(data: any) {
    return this.http.post(`${environment.base_url}/disciplinary_process`, data);
  }

  getHistory(id: any) {
    return this.http.get(`${environment.base_url}/memorandums-person/${id}`);
  }

  getProcessByPerson(id: any) {
    return this.http.get(`${environment.base_url}/process/${id}`);
  }

  downloadPDF(id, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/descargo/${id}`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }

  download(file, params = {}) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/file?path=${file}`, {
      responseType: 'blob' as 'json',
    });
  }

  approve(data, id) {
    return this.http.post(`${environment.base_url}/approve_process/${id}`, data);
  }

  getConsecutive(): Observable<any> {
    return this.http.get(`${environment.base_url}/get-consecutivo/disciplinary_processes`);
  }

  getFileCallReleases(id: number, body = {}): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${environment.base_url}/disciplinary-notice-download/${id}`, body, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  getClosureReasonPaginate(params: any): Observable<Request<RequestPaginate<Select[]>>> {
    return this.http.get<Request<RequestPaginate<Select[]>>>(
      `${environment.base_url}/disciplinary-closure-reason-paginate`,
      { params },
    );
  }

  getClosureReason(): Observable<Request<Select[]>> {
    return this.http.get<Request<Select[]>>(`${environment.base_url}/disciplinary-closure-reason`);
  }

  createClosureReason(body: object): Observable<any> {
    return this.http.post(`${environment.base_url}/disciplinary-closure-reason`, body);
  }
}
