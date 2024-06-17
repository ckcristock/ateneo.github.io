import { Component, OnInit, ViewChild } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { skipContentType } from 'src/app/http.context';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-tabladepreciacion',
  templateUrl: './tabladepreciacion.component.html',
  styleUrls: ['./tabladepreciacion.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NgFor,
    MatOptionModule,
    NgIf,
    NgClass,
  ],
})
export class TabladepreciacionComponent implements OnInit {
  alertSwal: any;
  enviromen: any = {};
  public DepreciacionModel: any = {
    Mes: '',
    Inicio: '',
    Fin: '',
    Tipo: 'NIIF',
    Identificacion_Funcionario: '1',
    // Identificacion_Funcionario: JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario
  };
  public alertOption: SweetAlertOptions = {};
  public queryParams: string = '';
  public Fecha: any = new Date();
  public Depreciacion: Array<any> = [];
  public Cargando: boolean = false;
  public Meses: Array<string> = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  public Years: Array<string> = [];

  public mesActual: number = this.getMesActual();
  public yearActual: number = this.getYearActual();

  constructor(
    private http: HttpClient,
    private _swal: SwalService,
  ) {}

  ngOnInit() {
    this.enviromen = environment;
    let year_ini = 2022;
    let year_fin = this.Fecha.getFullYear();
    for (let i = year_ini; i <= year_fin; i++) {
      this.Years.push(i.toString());
      this.Years.reverse();
    }
  }

  onGenerateDepreciation() {
    const request = () => {
      this.GuardarDepreciacion();
    };
    this._swal.swalLoading('Te dispones a generar la depreciación', request);
  }

  GuardarDepreciacion() {
    let info = JSON.stringify(this.DepreciacionModel);
    let datos = new FormData();
    datos.append('datos', info);
    this.http
      .post(environment.base_url + '/php/depreciacion/guardar_depreciacion.php', datos, {
        context: skipContentType(),
      })
      .subscribe(
        (data: any) => {
          if (data.tipo == 'success') {
            window.open(
              environment.base_url +
                'php/contabilidad/movimientoscontables/movimientos_depreciacion_pdf.php?id_registro=' +
                data.Id +
                '&id_funcionario_elabora=' +
                this.DepreciacionModel.Identificacion_Funcionario,
              '_blank',
            );

            window.open(
              environment.base_url +
                'php/contabilidad/movimientoscontables/movimientos_depreciacion_pdf.php?id_registro=' +
                data.Id +
                '&id_funcionario_elabora=' +
                this.DepreciacionModel.Identificacion_Funcionario +
                '&tipo_valor=Niif',
              '_blank',
            );
            this._swal.show({
              title: data.titulo,
              text: data.mensaje,
              icon: data.tipo,
              showCancel: false,
            });
            // this.ShowSwal(data.tipo, data.titulo, data.mensaje);
          } else {
            this._swal.show({
              title: data.titulo,
              text: data.mensaje,
              icon: data.tipo,
              showCancel: false,
            });
            // this.ShowSwal(data.tipo, data.titulo, data.mensaje);
          }
        },
        (error) => {
          /* let response = {
        tipo: 'error',
        mensaje: 'Ha ocurrido un error en la conexión. Por favor vuelve a intentarlo',
        titulo: 'Oops!'
      }; */
          this._swal.show({
            title: 'ERROR',
            text: 'Ha ocurrido un error en la conexión. Por favor vuelve a intentarlo',
            icon: 'error',
            showCancel: false,
          });
          // this.ShowSwal(response.tipo, response.titulo, response.mensaje);
        },
      );
  }

  setQueryParams() {
    let params: any = {};

    /*
    Original
    if (this.DepreciacionModel.Mes != '') {
      params.Mes = this.DepreciacionModel.Mes;

      if (this.DepreciacionModel.Tipo != '') {
        params.Tipo = this.DepreciacionModel.Tipo;
      }

    }
    */

    if (this.DepreciacionModel.Mes != '' && this.DepreciacionModel.Year != '') {
      params.Mes = this.DepreciacionModel.Mes;
      params.Year = this.DepreciacionModel.Year;

      if (this.DepreciacionModel.Tipo != '') {
        params.Tipo = this.DepreciacionModel.Tipo;
      }
    }

    this.queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }

  ShowSwal(tipo, titulo: string, msg: string) {
    this.alertSwal.icon = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this._swal.show(this.alertSwal);
  }

  getMesActual(): number {
    let fecha = new Date();
    let mes = fecha.getMonth().toString();

    if (mes == '0') {
      mes = '12';
    }

    return parseInt(mes);
  }
  getYearActual(): number {
    let fecha = new Date();
    let year = fecha.getFullYear().toString();
    return parseInt(year);
  }
}
