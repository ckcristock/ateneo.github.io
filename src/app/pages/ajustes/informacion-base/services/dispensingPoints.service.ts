import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DispensingPointsService {
  constructor(private http: HttpClient) {}

  getDispensingPoint(params = {}) {
    return this.http.get(`${environment.base_url}/dispensing`, { params });
  }

  setgetDispensingPoint(personId, body) {
    return this.http.post(`${environment.base_url}/dispensing/${personId}`, body);
  }
}
