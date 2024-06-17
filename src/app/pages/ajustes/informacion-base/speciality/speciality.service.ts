import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface ResponseSpeciality<T> {
  data: T;
}

export interface Speciality {
  text: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class SpecialityService {
  constructor(private http: HttpClient) {}

  getAllSpeciality(params = {}) {
    return this.http.get(`${environment.base_url}/especialities`, { params });
  }

  getAllPaginateSpeciality(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-especialities`, { params });
  }

  createNewSpeciality(data: any) {
    return this.http.post(`${environment.base_url}/specialities`, data);
  }

  getSpeciality(data: any) {
    return this.http.get(`${environment.base_url}/specialities/`.concat(data));
  }

  ChangeSpeciality(id: Number, status: String) {
    return this.http.put(`${environment.base_url}/specialities/${id}`, { status: status });
  }

  getSpecialities() {
    return this.http.get<ResponseSpeciality<Speciality[]>>(`${environment.base_url}/specialities`);
  }
}
