import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountPlanService {
  constructor(private http: HttpClient) {}

  getAllWithBalance() {
    return this.http.get(environment.base_url + '/account-plan-balance');
  }
}
