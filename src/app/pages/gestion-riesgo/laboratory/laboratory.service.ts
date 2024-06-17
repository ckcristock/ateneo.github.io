import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LaboratoryService {
  constructor(private clientHttp: HttpClient) {}

  newCall(form) {
    return this.clientHttp.post(
      `${environment.base_url}/presentianCall`,
      JSON.stringify(form.value),
    );
  }

  getPatient(params) {
    return this.clientHttp
      .get<[any, string[]]>(`${environment.base_url}/patients`, { params })
      .pipe(map((response) => response['data']));
  }

  getCie10(params) {
    return this.clientHttp
      .get<[any, string[]]>(`${environment.base_url}/cie10s`, { params })
      .pipe(map((response) => response['data']));
  }

  public getContracts(params = {}) {
    return this.clientHttp.get(`${environment.base_url}/contract`, { params });
  }

  public getProfesionals(ips: string, speciality: string, params = {}) {
    return this.clientHttp.get(`${environment.base_url}/get-professionals/${ips}/${speciality}`, {
      params,
    });
  }

  getCups(params = {}) {
    return this.clientHttp
      .get<[any, string[]]>(`${environment.base_url}/cups`, { params })
      .pipe(map((response) => response['data']));
  }

  getCup(id) {
    return this.clientHttp.get(`${environment.base_url}/cups/${id}`);
  }

  getLaboratoriesPlace() {
    return this.clientHttp.get(`${environment.base_url}/laboratories-places`);
  }

  getLaboratories(params = {}) {
    return this.clientHttp.get(`${environment.base_url}/paginate-laboratories`, { params });
  }

  getLaboratory(id) {
    return this.clientHttp.get(`${environment.base_url}/laboratories/${id}`);
  }

  createLaboratory(data: any) {
    return this.clientHttp.post(`${environment.base_url}/laboratories`, data);
  }

  getCupsId(id) {
    return this.clientHttp.get(`${environment.base_url}/cups-laboratory/${id}`);
  }

  tomarOAnular(data: any) {
    return this.clientHttp.post(`${environment.base_url}/tomar-anular-laboratorio`, data);
  }

  asignarHoras(data: any) {
    return this.clientHttp.post(`${environment.base_url}/asignar-horas-laboratorio`, data);
  }

  asignarTubos(data: any) {
    console.log(data);
    return this.clientHttp.post(`${environment.base_url}/asignar-tubos`, data);
  }

  getAllTubes(id) {
    return this.clientHttp.get(`${environment.base_url}/get-all-tubes/${id}`);
  }

  getMotivos() {
    return this.clientHttp.get(`${environment.base_url}/causal-anulation`);
  }

  cargarDocumento(data: any) {
    return this.clientHttp.post(`${environment.base_url}/document-laboratory`, data);
  }

  download(id) {
    return this.clientHttp.get(`${environment.base_url}/download-laboratory/${id}`);
  }

  getTubeId(id) {
    return this.clientHttp.get(`${environment.base_url}/tube-id/${id}`);
  }

  getReport(params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.clientHttp.get(`${environment.base_url}/laboratory-report`, {
      headers,
      responseType: 'blob' as 'json',
      params,
    });
  }
  deleteDocument(id) {
    return this.clientHttp.get(`${environment.base_url}/delete-document-laboratory/${id}`);
  }

  downloadFiles(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.clientHttp.get(`${environment.base_url}/download-files-laboratory/${id}`);
  }
}
