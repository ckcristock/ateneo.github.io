import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetalleAgendaService {
  constructor(private http: HttpClient) {}

  public cancellAgenda(params): Observable<any> {
    return this.http.post(`${environment.base_url}/cancell-agenda`, {
      params,
    });
  }
}
