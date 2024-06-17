import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipificationService {
  constructor(private http: HttpClient) {}
  getFormalities() {
    return this.http.get(environment.base_url + '/formality');
  }
  getAmbits() {
    return this.http.get(environment.base_url + '/ambit');
  }
  getTypeServices(id) {
    return this.http.get(environment.base_url + '/type-service/formality/' + id);
  }
}
