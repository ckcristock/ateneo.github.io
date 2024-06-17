import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '@shared/interfaces/request.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DisciplinaryFollow } from './components/disciplinary-follow/disciplinary-follow.interface';

@Injectable({
  providedIn: 'root',
})
export class DescargoService {
  constructor(private http: HttpClient) {}

  getDisciplinaryProcess(params = {}) {
    return this.http.get(`${environment.base_url}/disciplinary_process`, { params });
  }

  getDisciplinaryProcessById(id: number): Observable<Request<DisciplinaryFollow>> {
    return this.http.get<Request<DisciplinaryFollow>>(
      `${environment.base_url}/disciplinary_process/${id}`,
    );
  }

  getFilesToDownload(id) {
    return this.http.get(`${environment.base_url}/legal_document/${id}`);
  }

  saveFiles(data) {
    return this.http.post(`${environment.base_url}/legal_document`, data);
  }

  createAnotacion(data) {
    return this.http.post(`${environment.base_url}/annotation`, data);
  }

  cancelAnnotation(id, data) {
    return this.http.put(`${environment.base_url}/annotation/${id}`, data);
  }

  getAnnotations(id) {
    return this.http.get(`${environment.base_url}/annotation/${id}`);
  }

  closeOrOpenProccess(id, data) {
    return this.http.put(`${environment.base_url}/process/${id}`, data);
  }

  deleteDocuments(data, id) {
    return this.http.put(`${environment.base_url}/legal_document/${id}`, data);
  }

  newProcessAction(body: object): Observable<any> {
    return this.http.post(`${environment.base_url}/disciplinary-process-actions`, body);
  }
}
