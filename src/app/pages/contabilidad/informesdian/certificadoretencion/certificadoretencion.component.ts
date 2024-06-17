import { Component, OnInit } from '@angular/core';
import { CertificadoRetencionModel } from './CertificadoRetencionModel';
import { Globales } from '../../globales';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-certificadoretencion',
  templateUrl: './certificadoretencion.component.html',
  styleUrls: ['./certificadoretencion.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgSelectModule,
    NgClass,
    NgbTypeahead,
  ],
})
export class CertificadoretencionComponent implements OnInit {
  public datosCabecera: any = {
    Titulo: 'Certificados de retención',
    Fecha: new Date(),
  };
  public TerceroSeleccionado: any;

  public CertificadoRetencionModel: CertificadoRetencionModel = new CertificadoRetencionModel();
  queryParams: string;
  Cuentas: any = [];
  enviromen: any;
  private _rutaBase: string = environment.base_url + '/php/terceros/';
  terceros: any[] = [];

  constructor(
    private globales: Globales,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.ListarCuentas();
    this.enviromen = environment;
    this.FiltrarTerceros().subscribe((data: any) => {
      this.terceros = data;
    });
  }

  search_tercero = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.terceros
              .filter((v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 100),
      ),
    );
  formatter_tercero = (x: { Nombre: string }) => x.Nombre;

  /*   search_tercero = (text$: Observable<string>) =>
    text$
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap( term => term.length < 4 ? [] :
        this._terceroService.FiltrarTerceros(term)
        .map(response => response)
      )
    );

  formatter_tercero = (x: { Nombre_Tercero: string }) => x.Nombre_Tercero; */

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Cuentas.filter(
              (v) => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );
  formatter1 = (x: { Codigo: string }) => x.Codigo;

  ListarCuentas() {
    this.http
      .get(environment.base_url + '/php/contabilidad/certificadoretencion/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuentas = data;
      });
    /* this.http.get(this.globales.ruta+'php/contabilidad/balanceprueba/lista_cuentas.php').subscribe((data:any)=>{
      this.Cuentas = data.Activo;
    }); */
  }

  FiltrarTerceros(): Observable<any> {
    // let p = {coincidencia:match};
    return this.http.get(this._rutaBase + 'filtrar_terceros.php');
  }

  AsignarTercero(model) {
    if (typeof model == 'object') {
      this.CertificadoRetencionModel.Nit = model.Nit;
      this.CertificadoRetencionModel.Tipo_Nit = model.Tipo;
    } else {
      this.CertificadoRetencionModel.Nit = '';
      this.CertificadoRetencionModel.Tipo_Nit = '';
    }

    this.setQueryParams();
  }

  BuscarCuenta(model, tipo) {
    if (typeof model == 'object') {
      if (tipo == 'Inicial') {
        this.CertificadoRetencionModel.Cuenta_Inicial = model.Codigo_Centro;
      } else {
        this.CertificadoRetencionModel.Cuenta_Final = model.Codigo_Centro;
      }
    }

    this.setQueryParams();
  }

  setQueryParams() {
    let params: any = {};
    if (this.CertificadoRetencionModel.Fecha_Inicial != '') {
      params.Fecha_Inicial = this.CertificadoRetencionModel.Fecha_Inicial;
    }
    if (this.CertificadoRetencionModel.Fecha_Final != '') {
      params.Fecha_Final = this.CertificadoRetencionModel.Fecha_Final;
    }
    if (this.CertificadoRetencionModel.Nit != '') {
      params.Nit = this.CertificadoRetencionModel.Nit;
    }
    if (this.CertificadoRetencionModel.Fecha_Expedicion != '') {
      params.Fecha_Expedicion = this.CertificadoRetencionModel.Fecha_Expedicion;
    }
    if (this.CertificadoRetencionModel.Cuentas.length > 0) {
      params.Cuentas = this.CertificadoRetencionModel.Cuentas.join();
    }

    this.queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }

  generarCertificado() {
    window.open(
      environment.ruta +
        'php/contabilidad/certificadoretencion/certificado.php?' +
        this.queryParams,
      '_blank',
    );
  }
}
