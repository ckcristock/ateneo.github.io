import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DisabilityLeavesService {
  constructor(private http: HttpClient) {}

  getDisabilityLeaves() {
    return this.http.get(`${environment.base_url}/disability-leaves`);
  }
}
