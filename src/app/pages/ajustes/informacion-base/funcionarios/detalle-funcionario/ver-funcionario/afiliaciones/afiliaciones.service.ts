import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AfiliacionesService {
  constructor(private http: HttpClient) {}

  getAfiliationInfo(id) {
    return this.http.get(`${environment.base_url}/afiliation/${id}`);
  }

  updateAfiliation(data, id) {
    return this.http.post(`${environment.base_url}/updateAfiliation/${id}`, data);
  }

  getEpss() {
    return this.http.get(`${environment.base_url}/epss`);
  }

  getCompensationFund() {
    return this.http.get(`${environment.base_url}/compensation-funds`);
  }

  getPension_funds() {
    return this.http.get(`${environment.base_url}/pension-funds`);
  }

  getSeverance_funds() {
    return this.http.get(`${environment.base_url}/severance-funds`);
  }

  getArls() {
    return this.http.get(`${environment.base_url}/arl`);
  }
}
