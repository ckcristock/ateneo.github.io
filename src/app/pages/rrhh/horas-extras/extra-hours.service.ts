import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExtraHoursService {
  constructor(private http: HttpClient) {}
  getPeople(d1, d2, type, params = {}) {
    return this.http
      .get(`${environment.base_url}/horas_extras/turno_rotativo/${d1}/${d2}/${type}`, { params })
      .pipe(
        map((d: any) => {
          d.data.forEach((company) => {
            company.groups.forEach((group) => {
              if (Array.isArray(group.dependencies)) {
              } else {
                group.dependencies = Object.values(group.dependencies);
              }
              group.dependencies.forEach((dependency) => {
                dependency.people.forEach((person) => {
                  person.show = 0;
                });
              });
            });
          });
          return d;
        }),
      );
  }

  getDetailPeople(body) {
    return this.http.post(`${environment.base_url}/funcionario/getInfoTotal`, body);
  }

  createExtraHours(body) {
    return this.http.post(`${environment.base_url}/horas_extras/crear`, body);
  }

  createExtrasWeek(body) {
    return this.http.post(`${environment.base_url}/horas_extras/crear-semana`, body);
  }

  updateExtraHours(id, body) {
    return this.http.put(`${environment.base_url}/horas_extras/${id}/update`, body);
  }

  getExtraHoursValids(person, date) {
    return this.http.get(`${environment.base_url}/horas_extras/datos/validados/${person}/${date}`);
  }

  updateRotatingTurnDiary(id, body) {
    return this.http.put(`${environment.base_url}/rotating-hour-diary/${id}`, body);
  }

  updateFixedTurnDiary(id, body) {
    return this.http.put(`${environment.base_url}/fixed-hour-diary/${id}`, body);
  }
}
