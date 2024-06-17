import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private htpp: HttpClient) {}

  getAppointmentsTomigrate(params?) {
    return this.htpp.get(environment.base_url + '/appointments/tomigrate', { params });
  }

  getAppointments(params?) {
    return this.htpp.get(environment.base_url + '/appointments', { params });
  }

  getAppointmentsPendding(params?) {
    return this.htpp.get(environment.base_url + '/appointments-pending', { params });
  }

  getAppointment(id) {
    return this.htpp.get(environment.base_url + '/appointments/' + id);
  }
  cancelAppointment(id, form) {
    return this.htpp.post(environment.base_url + '/cancel-appointment/' + id, form);
  }

  migrateAppointment(id: Number) {
    return this.htpp.post(environment.base_url + '/migrate-appointment', { id: id });
  }

  confirmAppointment(message, id) {
    return this.htpp.post(environment.base_url + '/confirm-appointment', {
      message: message,
      id: id,
    });
  }

  getStatistics() {
    return this.htpp.get(environment.base_url + '/get-statistics-by-collection');
  }
}
