import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlertasComunService {
  constructor(private http: HttpClient) {}

  getAlerts(params = {}) {
    return this.http.get(`${environment.base_url}/paginateAlert`, { params });
  }

  getAlertsNotification(params = {}) {
    return this.http.get(`${environment.base_url}/alerts`, { params });
  }

  sendAlert(data: any) {
    return this.http.post(`${environment.base_url}/alerts`, data);
  }

  read(params = {}) {
    return this.http.get(`${environment.base_url}/read-alert`, { params });
  }

  markAllAsRead() {
    return this.http.get(`${environment.base_url}/mark-all-notifications-as-read`);
  }
}
