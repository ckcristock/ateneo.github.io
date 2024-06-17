import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  public Mes: number = 0;

  constructor(
    // private datePipe: DatePipe,
    private client: HttpClient,
  ) {}

  private GetInfoConfiguracion(): void {
    this.client
      .get(environment.base_url + '/php/actarecepcion/lista_impuesto_mes.php', {
        params: { modulo: 'Impuesto' },
      })
      .subscribe((data: any) => {
        this.Mes = parseInt(data.Meses.Meses_Vencimiento);
      });
  }

  public GetConfiguracion(): Observable<any> {
    return this.client.get(environment.base_url + '/php/genericos/detalle.php', {
      params: { modulo: 'Configuracion', id: '1' },
    });
  }

  // public GetNoConformes(): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/actarecepcioninternacional/causal_no_conformes_internacional.php');
  // }

  // public GetCausalNoPago(): Observable<any> {
  //   let p = { modulo: 'Causal_No_Pago' };
  //   return this.client.get(environment.base_url + '/php/lista_generales.php', { params: p });
  // }

  // public GetMunicipiosDepartamento(idDepartamento: string): Observable<any> {
  //   let p = { id: idDepartamento };
  //   return this.client.get(environment.ruta + 'php/genericos/municipios_departamento.php', { params: p });
  // }

  // public GetTiposDocumentos(): Observable<any> {
  //   let p = { modulo: 'Tipo_Documento' };
  //   return this.client.get(environment.base_url + '/php/lista_generales.php', { params: p });
  // }

  // public GetListaEps(): Observable<any> {
  //   return this.client.get(environment.ruta + 'php/GENERALES/eps/lista_eps.php');
  // }

  // public GetGeneralData(modulo: string): Observable<any> {
  //   let p = { modulo: modulo };
  //   return this.client.get(environment.base_url + '/php/lista_generales.php', { params: p });
  // }

  // public ThousandRound(value: number): number {
  //   let calculo = Math.round(value / 1000) * 1000;

  //   return calculo;
  // }

  // public TestRemoteConnection(data: FormData): Observable<any> {
  //   return this.client.post(environment.ruta + 'php/test_remote_connection.php', data);
  // }

  // public ProbarCaracteresEspeciales(data: FormData) {
  //   return this.client.post(environment.ruta + 'php/test_especiales.php', data);
  // }

  public ValidarEntregasDobles(puntoDispensacion: any, entregados: Array<any>, idProducto: string) {
    let response = { codigo: '', fecha: '', validar: false };
    if (puntoDispensacion.Entrega_Doble == 'No') {
      let exist = entregados.filter((x) => x.Id_Producto == idProducto);

      if (exist.length > 0) {
        let e = entregados.find((x) => x.Id_Producto == idProducto);
        response.codigo = e.Codigo;
        response.fecha = e.Fecha;
        // this._swalService.ShowMessage(['warning','Alerta','Esta producto ya fue entregado este mes en la dis '+entregado.Codigo+' en la fecha '+entregado.Fecha+'!']);
        response.validar = false;
        // this._subjectEntregasDobles.next(response);
        return response;
      } else {
        response.validar = true;
        // this._subjectEntregasDobles.next(response);
        return response;
      }
    } else {
      response.validar = true;
      // this._subjectEntregasDobles.next(response);
      return response;
    }
  }

  // public getMeses() {
  //   let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  //   return meses;
  // }

  // public getMes(pos) {
  //   let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  //   return meses[pos];
  // }
}
