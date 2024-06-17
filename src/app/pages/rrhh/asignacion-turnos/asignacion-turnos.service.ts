import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AsignacionTurnosService {
  constructor(private http: HttpClient) {}
  getTurns() {}
  getPeople(week, params = {}) {
    return this.http
      .get(`${environment.base_url}/horarios/datos/generales/${week}`, {
        params,
      })
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
                  person.selected = 0;
                });
              });
            });
          });

          return d;
        }),
      );
  }

  saveHours(body) {
    return this.http.post(`${environment.base_url}/rotating-hour`, body);
  }

  getHistory(params = {}) {
    return this.http.get(`${environment.base_url}/history-rotating-hour`, { params });
  }
}
