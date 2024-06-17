import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecaudoServiceService {
  constructor(private http: HttpClient) {}

  saveFees(data: object) {
    return this.http.post(environment.base_url + '/fees', data);
  }

  getReasonsByFees() {
    return this.http.get(environment.base_url + '/reasons');
  }

  getMethodPays() {
    return this.http.get(environment.base_url + '/method-pays');
  }

  getBanks() {
    return this.http.get(environment.base_url + '/banks');
  }
}
