import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AsignacionCitasService {
  finalizedCall(params = {}) {
    return this.httpClient.get(environment.base_url + '/finalize-my-call-pending', { params });
  }

  constructor(private httpClient: HttpClient) {}

  getCallPending() {
    return this.httpClient.get(environment.base_url + '/get-call-pending');
  }
}
