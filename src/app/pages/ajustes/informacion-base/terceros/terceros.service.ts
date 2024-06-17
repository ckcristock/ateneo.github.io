import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TercerosService {
  constructor(private http: HttpClient) {}

  getZones() {
    return this.http.get(`${environment.base_url}/all-zones`);
  }

  getDepartments() {
    return this.http.get(`${environment.base_url}/departments`);
  }

  getMunicipalities(id) {
    return this.http.get(`${environment.base_url}/municipalities-for-dep/${id}`);
  }

  saveInformation(data: any) {
    return this.http.post(`${environment.base_url}/third-party`, data);
  }

  addThirdPartyPerson(data: any) {
    return this.http.post(`${environment.base_url}/third-party-person`, data);
  }

  getThirdPartyProvider(data: any) {
    return this.http.get(`${environment.base_url}/third-party-provider`, data);
  }

  getThirdParties(params = {}) {
    return this.http.get(`${environment.base_url}/third-party`, { params });
  }

  showThirdParty(id, params = {}) {
    return this.http.get(`${environment.base_url}/third-party/${id}`, { params });
  }

  editThirdParty(id) {
    return this.http.get(`${environment.base_url}/third-party/${id}/edit`);
  }

  updateThirdParties(data: any, id) {
    return this.http.put(`${environment.base_url}/third-party/${id}`, data);
  }

  getWinningList() {
    return this.http.get(`${environment.base_url}/winnings-list`);
  }

  getCiiuCodesList() {
    return this.http.get(`${environment.base_url}/ciiu-code`);
  }

  getDianAddress() {
    return this.http.get(`${environment.base_url}/dian-address`);
  }

  getAccountPlan() {
    return this.http.get(`${environment.base_url}/account-plan`);
  }

  changeState(data: any) {
    return this.http.put(`${environment.base_url}/activate-inactivate`, data);
  }

  getThirdPartyPerson(params = {}) {
    return this.http.get(`${environment.base_url}/third-party-person`, { params });
  }

  getFields() {
    return this.http.get(`${environment.base_url}/fields-third`);
  }

  getTypeDocuments() {
    return this.http.get(`${environment.base_url}/documentTypes`);
  }

  getRegimeType() {
    return this.http.get(`${environment.base_url}/regime-type`);
  }

  getFiscalResponsibility() {
    return this.http.get(`${environment.base_url}/fiscal-responsibility`);
  }

  getCountries() {
    return this.http.get(`${environment.base_url}/countries`);
  }

  /*  getCities(idCountry){
     return this.http.get(`${environment.base_url}/citiesCountry/${idCountry}`);
   } */

  getCiiuCodes() {
    return this.http.get('assets/json/ciiu_codes.json');
  }

  getCountriesWith() {
    return this.http.get(`${environment.base_url}/countries-with-departments`);
  }

  getThirds(params = {}) {
    return this.http.get(`${environment.base_url}/third-parties-list`, { params });
  }

  getClient() {
    return this.http.get(`${environment.base_url}/thirdPartyClient`);
  }

  getThirdPartyPersonForThird(id) {
    return this.http.get(`${environment.base_url}/third-party-person-for-third/${id}`);
  }

  getThirdPartyPersonIndex() {
    return this.http.get(`${environment.base_url}/third-party-person-index`);
  }
}
