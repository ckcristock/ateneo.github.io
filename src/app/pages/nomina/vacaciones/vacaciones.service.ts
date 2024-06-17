import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VacacionesService {
  constructor(private http: HttpClient) {}

  getVacations() {
    return this.http.get(`${environment.base_url}/pay-vacation`);
  }

  saveInformation(data: any) {
    return this.http.post(`${environment.base_url}/pay-vacation`, data);
  }
}
