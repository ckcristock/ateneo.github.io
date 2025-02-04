import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeveranceFundsService {
  constructor(private http: HttpClient) {}

  getSeveranceFounds() {
    return this.http.get(`${environment.base_url}/severance-funds`);
  }
}
