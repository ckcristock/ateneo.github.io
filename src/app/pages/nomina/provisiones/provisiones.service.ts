import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '@shared/interfaces/request.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Provisions {
  bonus: number;
  severanceInterest: number;
  severance: number;
  vacations: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProvisionesService {
  private API_URL = `${environment.base_url}/provisions`;

  constructor(private readonly http: HttpClient) {}

  getProvisions(): Observable<Request<Provisions>> {
    return this.http.get<Request<Provisions>>(`${this.API_URL}`);
  }
}
