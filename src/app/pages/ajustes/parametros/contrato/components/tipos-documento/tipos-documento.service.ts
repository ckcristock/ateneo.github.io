import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TiposDocumentoService {
  constructor(private http: HttpClient) {}

  getDocuments(params = {}) {
    return this.http.get(`${environment.base_url}/paginateDocumentType`, { params });
  }

  createNewDocument(data: any) {
    return this.http.post(`${environment.base_url}/documentTypes`, data);
  }
}
