import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountableIncomesService {
  constructor(private http: HttpClient) {}

  getCountableIncomes(params = {}) {
    return this.http.get(`${environment.base_url}/countable_incomes`, { params });
  }

  getBenefitIncome(person_id) {
    return this.http.get(`${environment.base_url}/countable-incomes`, {
      params: {
        person_id,
      },
    });
  }

  saveBenefitIncome(body) {
    return this.http.post(`${environment.base_url}/countable-incomes`, body);
  }

  deleteBenefitIncome(id) {
    return this.http.delete(`${environment.base_url}/countable-incomes/${id}`);
  }

  getBenefitNotIncome(person_id) {
    return this.http.get(`${environment.base_url}/countable-not-incomes`, {
      params: {
        person_id,
      },
    });
  }

  saveBenefitNotIncome(body) {
    return this.http.post(`${environment.base_url}/countable-not-incomes`, body);
  }

  deleteBenefitNotIncome(id) {
    return this.http.delete(`${environment.base_url}/countable-not-incomes/${id}`);
  }
}
