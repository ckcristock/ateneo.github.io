import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class newCallService {
  constructor(private http: HttpClient) {}

  newCall(form) {
    return this.http.post(`${environment.base_url}/presentianCall`, JSON.stringify(form.value));
  }

  newCallByWaitingList(id) {
    return this.http.post(`${environment.base_url}/patientforwaitinglist`, id);
  }
}
