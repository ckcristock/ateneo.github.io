import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoActividadesService {
  constructor(private http: HttpClient) {}

  getActivityTypes(params = {}) {
    return this.http.get(environment.base_url + '/rrhh-activity-types', { params });
  }
  saveActivityType(data) {
    return this.http.post(environment.base_url + '/rrhh-activity-types', data);
  }
  setActivityType(data) {
    return this.http.post(environment.base_url + '/rrhh-activity-types/set', data);
  }
}
