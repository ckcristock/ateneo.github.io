import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfesionesService {
  constructor(private http: HttpClient) {}

  getProfessions(params = {}) {
    return this.http.get(`${environment.base_url}/paginateProfessions`, { params });
  }

  createNewProfession(data: any) {
    return this.http.post(`${environment.base_url}/professions`, data);
  }
}
