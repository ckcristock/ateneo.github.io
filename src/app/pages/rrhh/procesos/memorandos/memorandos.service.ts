import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemorandosService {
  constructor(private http: HttpClient) {}

  getPeople() {
    return this.http.get(`${environment.base_url}/people`, {
      params: {
        type: '2',
      },
    });
  }

  createNewMemorandum(data: any) {
    return this.http.post(`${environment.base_url}/memorandum`, data);
  }

  getMemorandumLimitated() {
    return this.http.get(`${environment.base_url}/ListLimitated`);
  }

  getTypesOfMemorandum(params = {}) {
    return this.http.get(`${environment.base_url}/type_memorandum`, { params });
  }

  getMemorandumList(params = {}) {
    return this.http.get(`${environment.base_url}/memorandums-paginate`, { params });
  }

  getCallAttention(params: any): Observable<any> {
    return this.http.get(`${environment.base_url}/attention-calls-paginate`, { params });
  }

  getCallAttentionForPerson(id: number): Observable<any> {
    return this.http.get(`${environment.base_url}/attention-calls-validate/${id}`);
  }

  createNewMemorandumType(data: any) {
    return this.http.post(`${environment.base_url}/type_memorandum`, data);
  }

  createNewAttentionCall(data: any) {
    return this.http.post(`${environment.base_url}/attention-call`, data);
  }

  attentionCalls(id) {
    return this.http.get(`${environment.base_url}/alert/${id}`);
  }

  saveFile(file) {
    localStorage.setItem('file', file);
  }

  downloadMemorandum(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/memorandums-download/${id}`, {
      responseType: 'blob' as 'json',
      headers,
    });
  }

  downloadCallAttention(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/attention-calls-download/${id}`, {
      responseType: 'blob' as 'json',
      headers,
    });
  }
}
