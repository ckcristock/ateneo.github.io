import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceTypesService {
  constructor(private http: HttpClient) {}

  public getServiceTypes(): Observable<any> {
    return this.http.get(`${environment.base_url}/service-types`);
  }
}


