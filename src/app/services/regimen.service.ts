import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegimenService {
  constructor(private client: HttpClient) {}

  getRegimenes(): Observable<{}> {
    return this.client.get(environment.ruta + 'php/GENERALES/regimen/get_regimenes.php');
  }
}
