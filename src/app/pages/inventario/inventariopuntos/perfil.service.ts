import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  globales = environment;

  constructor(private http: HttpClient) {}

  getPermisosModulo(modulo, funcionario) {
    let params = new FormData();
    params.append('id', funcionario);
    params.append('modulo', modulo);

    return this.http.post(this.globales.ruta + 'php/tablero/detalle_perfil.php', params).pipe(
      map((response: any) => {
        return response[0];
      }),
    );
  }
}
