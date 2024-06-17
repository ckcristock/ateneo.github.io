import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepartmentMunicipalityService {
  constructor(private readonly http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get(`${environment.base_url}/countries`);
  }

  getDepartments(country_id?: string): Observable<any> {
    return this.http.get(`${environment.base_url}/departments`, {
      params: {
        country_id,
      },
    });
  }

  getMunicipalities(deptId: number): Observable<any> {
    return this.http
      .get(`${environment.base_url}/municipalities/${deptId}`)
      .pipe(map((res: any) => res.data.data.map((mun) => ({ value: mun.id, text: mun.name }))));
  }
}
