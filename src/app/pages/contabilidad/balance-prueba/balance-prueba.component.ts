import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, debounceTime, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CabeceraComponent } from 'src/app/components/cabecera/cabecera.component';
import { AutocompleteMdlComponent } from 'src/app/components/autocomplete-mdl/autocomplete-mdl.component';

@Component({
  selector: 'app-balance-prueba',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule,
    NgSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CabeceraComponent,
    AutocompleteMdlComponent,
  ],
  templateUrl: './balance-prueba.component.html',
  styleUrl: './balance-prueba.component.scss',
})
export class BalancePruebaComponent implements OnInit {
  public datosCabecera: any = {
    Titulo: 'Balance de prueba',
    Fecha: new Date(),
  };

  public Parametros: any = {
    Fecha_Inicial: '',
    Fecha_Corte: '',
    Discriminado: '',
    Centro_Costo: '',
    Cuenta_Inicial: '',
    Cuenta_Final: '',
    Tipo_Reporte: 'Pcga',
    Nivel: '8',
  };

  public Centro_Costos: Array<any>;
  public Centro_Costo: any = '';

  public Cuenta: any = {
    Inicial: '',
    Final: '',
  };

  public Tipo: string = '';
  public Niveles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  Cuentas: any = [];
  Cuenta_Inicial: any = '';
  Cuenta_Final: any = '';
  Discriminado: any = '';
  public queryParams: any = '';
  globales = environment;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.ListarCentroCostos();
    this.ListarCuentas();
  }

  BuscarCuenta(model, tipo) {
    if (tipo == 'Inicial') {
      if (typeof model == 'object') {
        this.Parametros.Cuenta_Inicial = model.Codigo_Centro;
      } else {
        this.Parametros.Cuenta_Inicial = '';
      }
    } else {
      if (typeof model == 'object') {
        this.Parametros.Cuenta_Final = model.Codigo_Centro;
      } else {
        this.Parametros.Cuenta_Final = '';
      }
    }

    setTimeout(() => {
      this.getQueryParams();
    }, 100);
  }

  verBalance(form) {
    let data = this.Parametros;

    switch (data.Discriminado) {
      case 'General':
        this.Tipo = 'General';
        break;

      case 'Nits':
        this.Tipo = 'Nits';
        break;

      case 'Tipo':
        this.Tipo = 'Tipo';
        break;
    }
  }

  ListarCuentas() {
    this.http
      .get(this.globales.base_url + '/php/contabilidad/balanceprueba/lista_cuentas.php')
      .pipe(
        map((res) =>
          res['Activo'].map((data) => ({
            ...data,
            value: data['Id_Plan_Cuentas'],
            text: data['Codigo'],
          })),
        ),
      )
      .subscribe({
        next: (data) => {
          this.Cuentas = data;
        },
      });
  }

  ListarCentroCostos() {
    this.http
      .get(this.globales.base_url + '/php/contabilidad/balanceprueba/lista_centro_costos.php')
      .subscribe((data: any) => {
        this.Centro_Costos = data;
        this.Centro_Costos.unshift({ value: 'Todos', label: 'Todos' });
      });
  }

  getQueryParams() {
    let params: any = {
      tipo: this.Parametros.Discriminado,
      fecha_ini: this.Parametros.Fecha_Inicial,
      fecha_fin: this.Parametros.Fecha_Corte,
      tipo_reporte: this.Parametros.Tipo_Reporte,
      nivel: this.Parametros.Nivel,
    };

    if (this.Parametros.Centro_Costo != '') {
      params.centro_costo = this.Parametros.Centro_Costo;
    }
    if (this.Parametros.Cuenta_Inicial != '') {
      params.cta_ini = this.Parametros.Cuenta_Inicial;
    }
    if (this.Parametros.Cuenta_Final != '') {
      params.cta_fin = this.Parametros.Cuenta_Final;
    }

    this.queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }
}
