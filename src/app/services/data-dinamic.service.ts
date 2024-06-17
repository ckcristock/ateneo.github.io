import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../core/models/users.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DataDinamicService {
  constructor(private httpClient: HttpClient) {}

  public getDepartments() {
    return this.httpClient.get(`${environment.base_url}/departments`);
  }

  public getCompanies(typeLocation = 3) {
    return this.httpClient.get(`${environment.base_url}/get-companys/${typeLocation}`);
  }
  public getPeopleTypes() {
    return this.httpClient.get(`${environment.base_url}/people-type-custom`);
  }

  public getLocations(idCompany) {
    return this.httpClient.get(`${environment.base_url}/get-sedes/${idCompany}`);
  }

  public getCities(params?) {
    return this.httpClient.get(`${environment.base_url}/cities`, { params });
  }
  public getAgreements() {
    return this.httpClient.get(`${environment.base_url}/agreements`);
  }
  public getTypeDocuments() {
    return this.httpClient.get(`${environment.base_url}/type-documents`);
  }
  public getEps() {
    return this.httpClient.get(`${environment.base_url}/eps`);
  }
  public getRegimens() {
    return this.httpClient.get(`${environment.base_url}/type-regimens`);
  }

  public getlevels() {
    return this.httpClient.get(`${environment.base_url}/levels`);
  }

  public getContracts(params = {}) {
    return this.httpClient.get(`${environment.base_url}/contract`, { params });
  }

  // public getContracts(params = {}) {
  //   return this.httpClient.get(`${environment.base_url}/work-contract-type`, { params })
  // }

  public savePatient(form) {
    return this.httpClient.post(`${environment.base_url}/patients`, form);
  }

  public getPatientAgain(document) {
    return this.httpClient.get(`${environment.base_url}/get-patient-fill/${document}`);
  }

  public getPriceList() {
    return this.httpClient.get(`${environment.base_url}/price_lists`);
  }

  public getPaymentMethod() {
    return this.httpClient.get(`${environment.base_url}/payment_methods`);
  }

  public getBenefitsPlan() {
    return this.httpClient.get(`${environment.base_url}/benefits_plans`);
  }
  public gettypeReportes() {
    return this.httpClient.get(`${environment.base_url}/type_reportes`);
  }

  public getSpecialties(sede: string, procedure: string) {
    if (sede == 'undefined' || !sede) {
      sede = '0';
      procedure = '0';
    }
    return this.httpClient.get(`${environment.base_url}/get-specialties/${sede}/${procedure}`);
  }

  public getSpecialtiesByProcedure(procedure: string) {
    //console.log(procedure);

    if (!procedure) {
      procedure = '0';
    }
    return this.httpClient.get(`${environment.base_url}/get-specialties-by-procedure/${procedure}`);
  }
}
