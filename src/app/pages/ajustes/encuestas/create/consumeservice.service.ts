import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConsumeserviceService {
  constructor(private http: HttpClient) {}

  getEncuestas(id = '1') {
    return this.http.get(
      environment.base_url + '/php/recursos_humanos/formularios/listar_formulario.php',
      { params: { id: id } },
    );
  }
}
