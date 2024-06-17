import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GrupoestibaService {
  constructor(private http: HttpClient) {}

  public getGrupoEstibas(): Observable<any> {
    return this.http.get(environment.base_url + '/php/grupo_estiba/get_grupo_estibas.php');
  }
}
