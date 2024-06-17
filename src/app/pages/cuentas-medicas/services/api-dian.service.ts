import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Globales } from "@shared/globales/globales";
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiDianService {
  headers: HttpHeaders;
  ruta = 'https://api-dian.sigesproph.com.co/api/ubl2.1/';

  constructor(
    public http: HttpClient,
    //  private globales: Globales
  ) {
    this.headers = new HttpHeaders()
      .set('Authorization', 'Basic ZmFjdHVyYWNpb25AcHJvaHNhLmNvbTo4MDQwMTYwODQ=')
      .set('Access-Control-Allow-Origin', '*')
      .set('Content-Type', 'application/json');
  }

  public transmitirDian(payload: FormData) {
    let metodo = payload.get('metodo');
    let datos = payload.get('datos');

    let ruta = this.ruta + metodo;
    this.headers.set('SOAPAction', ruta);
    if (environment.ruta.includes('sigesproph.com.co')) {
      return this.http.post(ruta, datos, { headers: this.headers });
    } else {
      let ruta = 'http://localhost:8000/api/ubl2.1/' + metodo;
      return this.http.post(ruta, datos, { headers: this.headers });
    }
  }

  validarCufe(cufe) {
    return this.http.get(
      environment.ruta + 'php/facturaccion/validar_cufe_factura.php?cufe=' + cufe,
    );
  }
}
