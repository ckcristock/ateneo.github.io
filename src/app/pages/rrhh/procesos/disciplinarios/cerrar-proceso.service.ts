import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CerrarProcesoService {
  constructor(private http: HttpClient) {}

  cerrarProceso(procesoData) {
    return this.http.post(`${environment.base_url}/disciplinary_process-closure`, procesoData);
  }

  getFileToDownload(id) {
    return this.http.get(`${environment.base_url}/legal_document/${id}`);
  }
}
