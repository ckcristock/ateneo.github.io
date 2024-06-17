import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../../../shared/globales/globales';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class DepartamentoService {
  constructor(
    private client: HttpClient,
    // private globales: Globales,
  ) {}

  getDepartamentos(): Observable<any> {
    return this.client.get(environment.ruta + 'php/departamentos/get_departamentos.php');
  }

  getMunicipios(): Observable<any> {
    return this.client.get(environment.ruta + 'php/departamentos/get_municipios.php');
  }
}
