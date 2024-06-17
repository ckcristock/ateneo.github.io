import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable, of, OperatorFunction } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';

const WIKI_URL = `${environment.base_url}/cie10s`;
const PROCEDURE_URL = `${environment.base_url}/cups`;

const PARAMS = new HttpParams({
  fromObject: {
    origin: '*',
  },
});

@Injectable({
  providedIn: 'root',
})
export class OpenAgendaService {
  constructor(private clientHttp: HttpClient) {}

  /**
   * getTypeAppointment
   */
  public getTypeAppointment(text: string) {
    return this.clientHttp.get(
      `${environment.base_url}/get-type_appointments/${text != '' ? text : 'getall'}`,
    );
  }
  /**
   * getSubTypeAppointment
   */
  public getSubTypeAppointment(value: string) {
    return this.clientHttp.get(`${environment.base_url}/get-type_subappointments/${value}`);
  }
  /**
   * getIps
   */
  public getIps(value: string, params = {}) {
    return this.clientHttp.get(`${environment.base_url}/get-companys/${value}`, { params });
  }

  /**
   * getIps
   */
  public getIpsBasedOnCity(value: string) {
    return this.clientHttp.get(`${environment.base_url}/get-companys-based-on-city/${value}`);
  }
  /**
   * getSedes
   */
  public getSedes(sede: string, procedure: string) {
    return this.clientHttp.get(`${environment.base_url}/get-sedes/${sede}/${procedure}`);
  }
  /**
   * getSpecialties
   */
  public getSpecialties(sede: string, procedure: string) {
    if (sede == 'undefined' || !sede) sede = '0';
    if (!procedure) procedure = '0';
    return this.clientHttp.get(`${environment.base_url}/get-specialties/${sede}/${procedure}`);
  }

  public getSpecialtiesForType(data) {
    return this.clientHttp.post(`${environment.base_url}/get-specialties-type-service`, data);
  }
  /**
   * getProfesionals
   */
  public getProfesionals(ips: string, speciality: string, params = {}) {
    if (ips == '') {
      ips = '0';
    }
    if (!speciality) speciality = '0';
    return this.clientHttp.get(`${environment.base_url}/get-professionals/${ips}/${speciality}`, {
      params,
    });
  }

  public getDurations() {
    return this.clientHttp.get(`${environment.base_url}/get-durations`);
  }

  public getAppointments(idProfessional: Number) {
    return this.clientHttp.get(`${environment.base_url}/agendamientos/${idProfessional}`);
  }

  public getOpenedSpace(especialidad: Number, profesional: Number) {
    return this.clientHttp.get(
      `${environment.base_url}/opened-spaces/${especialidad}/${profesional}`,
    );
  }
  public getOpenedSpaceCustom(params = {}) {
    return this.clientHttp.get(`${environment.base_url}/opened-spaces`, { params });
  }

  public getDiagnostics() {
    return this.clientHttp.get(`${environment.base_url}/cie10s`);
  }

  public saveAgendamiento(formulario: String) {
    return this.clientHttp.post(`${environment.base_url}/agendamientos`, formulario);
  }

  public saveCita(formulario: String, repeat: boolean) {
    return repeat
      ? this.clientHttp.post(`${environment.base_url}/appointment-recursive`, formulario)
      : this.clientHttp.post(`${environment.base_url}/appointments`, formulario);
  }

  public getClean(id) {
    return this.clientHttp.get(`${environment.base_url}/clean-info/${id}`);
  }

  public getInfoCita(id) {
    return this.clientHttp.get(`${environment.base_url}/get-data-cita/${id}`);
  }

  public getTypeLocations() {
    return this.clientHttp.get(`${environment.base_url}/type-locations`);
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.clientHttp
      .get<[any, string[]]>(WIKI_URL, { params: PARAMS.set('search', term) })
      .pipe(map((response: any) => response.data));
  }

  searchProcedure(term: string, speciality: string = '') {
    if (term === '') {
      return of([]);
    }

    return this.clientHttp
      .get<[any, string[]]>(PROCEDURE_URL, { params: { search: term, speciality: speciality } })
      .pipe(map((response: any) => response.data));
  }

  searchProcedureByYear(term: string, year: number) {
    if (term === '') {
      return of([]);
    }

    return this.clientHttp
      .get<[any, string[]]>(PROCEDURE_URL, { params: { search: term, year: String(year) } })
      .pipe(map((response: any) => response.data));
  }

  searchCustomProcedure(term: string, speciality: string = '') {
    return this.clientHttp
      .get<[any, string[]]>(PROCEDURE_URL, { params: { search: term, speciality: speciality } })
      .pipe(map((response: any) => response.data));
  }

  searchCustomProcedureByAppointment(term: string, space: string = '') {
    console.log([term, space]);
    return this.clientHttp
      .get<[any, string[]]>(PROCEDURE_URL, { params: { search: term, space: space } })
      .pipe(map((response: any) => response.data));
  }
}
