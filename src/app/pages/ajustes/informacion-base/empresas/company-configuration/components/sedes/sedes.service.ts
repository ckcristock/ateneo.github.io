import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SedesService {
  constructor(private http: HttpClient) {}

  paginateLocations(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-locations`, { params });
  }
}
