import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActarecepcionremisionService {
  constructor(private client: HttpClient) {}
  saveActaRemision(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'text/plain',
    });
    return this.client.post(
      environment.base_url + '/php/actarecepcion/guardar_acta_remisones_pendientes.php',
      data,
      {
        headers,
      },
    );
  }
}
