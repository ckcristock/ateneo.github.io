import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeductionService {
  constructor(private http: HttpClient) {}

  getCountableDeductions(params = {}) {
    return this.http.get(`${environment.base_url}/countable_deductions`, { params });
  }

  getDeductions(person_id) {
    return this.http.get(`${environment.base_url}/deductions`, {
      params: {
        person_id,
      },
    });
  }

  saveDeduction(body) {
    return this.http.post(`${environment.base_url}/deductions`, body);
  }

  deleteDeduction(id) {
    return this.http.delete(`${environment.base_url}/deductions/${id}`);
  }
}
