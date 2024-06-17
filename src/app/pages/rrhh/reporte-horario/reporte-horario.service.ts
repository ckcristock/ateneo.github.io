import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ReporteHorarioService {
  constructor(private http: HttpClient) {}

  getFixedTurnsDiaries(date1, date2, params) {
    return this.http
      .get(`${environment.base_url}/reporte/horarios/${date1}/${date2}/turno_fijo`, { params })
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
                  person.totalHours = 0;
                  person.totalHoursEdit = 0;
                  person.diaries.forEach((diary) => {
                    person.totalHours += parseFloat(diary.working_hours || 0);
                    if (diary.edit.length > 0) {
                      person.totalHoursEdit += parseFloat(diary.edit[0].hours || 0);
                    } else {
                      person.totalHoursEdit += parseFloat(diary.working_hours || 0);
                    }
                    if (diary.rotating_turn_id) {
                      diary = this.makeColorArrival(diary);
                    }
                  });
                });
              });
            });
          });

          return d;
        }),
      );
  }

  makeColorArrival(diary) {
    diary.colors = {};
    let difEntry = this.makeDiff(diary.entry_time_real, diary.entry_time_one);

    if (difEntry > diary.entry_tolerance * 60) {
      diary.colors.entry = 'red';
    } else {
      diary.colors.entry = 'green';
    }

    diary.colors.launchEntry = this.calculateEntry(diary.launch_time_one, diary.launch_time_real);
    diary.colors.launchLeave = this.calculateLeave(
      diary.launch_time_two,
      diary.launch_time_two_real,
    );

    diary.colors.breckEntry = this.calculateEntry(diary.breack_time_one, diary.breack_time_real);
    diary.colors.breckLeave = this.calculateLeave(
      diary.breack_time_two,
      diary.breack_time_two_real,
    );

    if (diary.leave_time_real) {
      let diffLeave = this.makeDiff(diary.leave_time_real, diary.leave_time_one);

      if (diffLeave < diary.leave_tolerance * 60) {
        diary.colors.leave = 'red';
      } else {
        diary.colors.leave = 'green';
      }
    } else {
      diary.colors.leave = '';
    }

    return diary;
  }

  calculateEntry(time, real) {
    let colorLaunchEntry = '';
    if (time) {
      let diff = this.makeDiff(real, time);
      if (diff > 0) {
        colorLaunchEntry = 'red';
      } else {
        colorLaunchEntry = 'green';
      }
    }
    return colorLaunchEntry;
  }
  calculateLeave(time, real) {
    let colorLaunchEntry = '';
    if (time) {
      let diff = this.makeDiff(real, time);
      if (diff > 0) {
        colorLaunchEntry = 'red';
      } else {
        colorLaunchEntry = 'green';
      }
    }
    return colorLaunchEntry;
  }
  makeDiff(real, entry) {
    return moment(entry, 'HH:mm:ss').diff(moment(real, 'HH:mm:ss'));
  }
  hasLateArrival() {}

  download(date1, date2, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/download/horarios/${date1}/${date2}`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }

  updateHoursWorked(data) {
    return this.http.post(`${environment.base_url}/update-hours-worked`, data);
  }
}
