import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LateArrivalsService {
  constructor(private http: HttpClient) {}

  getLateArrivals(date1, date2, params = {}) {
    return this.http.get(`${environment.base_url}/late_arrivals/data/${date1}/${date2}`, {
      params,
    });
  }
  getLateArrivalsPaginated(date1, date2, params = {}) {
    return this.http.get(`${environment.base_url}/late_arrivals/paginate/${date1}/${date2}`, {
      params,
    });
  }
  downloadLateArrivals(date1, date2, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/late-arrivals/download/${date1}/${date2}`, {
      params,
      headers,
      responseType: 'blob' as 'json',
    });
  }
  getStatistcs(date1, date2, params = {}) {
    return this.http.get(`${environment.base_url}/late_arrivals/statistics/${date1}/${date2}`, {
      params,
    });
  }
}
