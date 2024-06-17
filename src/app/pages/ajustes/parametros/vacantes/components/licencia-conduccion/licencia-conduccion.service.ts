import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LicenciaConduccionService {
  constructor(private http: HttpClient) {}

  getDrivingLicenses(params = {}) {
    return this.http.get(`${environment.base_url}/paginateDrivingLicences`, { params });
  }

  save(data: any) {
    return this.http.post(`${environment.base_url}/drivingLicenses`, data);
  }
}
