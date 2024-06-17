import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe, NgFor } from '@angular/common';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-balance-general',
  templateUrl: './balance-general.component.html',
  styleUrls: ['./balance-general.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
  ],
})
export class BalanceGeneralComponent implements OnInit {
  public datosCabecera: any = {
    Titulo: 'Balance general',
    Fecha: new Date(),
  };

  public Centro_Costos: Array<any>;
  public Centro_Costo: any = '';

  public Cuenta: any = {
    Inicial: '',
    Final: '',
  };

  public Parametros: any = {
    Fecha_Corte: '',
    Tipo_Reporte: 'Niif',
    Nivel: 8,
    Centro_Costo: '',
  };

  public Tipo: string = '';
  public Niveles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  Cuentas: any = [];
  Cuenta_Inicial: any = '';
  Cuenta_Final: any = '';
  Discriminado: any = '';
  queryParams: string = '';
  envirom: any;
  datePipeString: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private _swal: SwalService,
  ) {}

  ngOnInit() {
    this.ListarCentroCostos();
    this.envirom = environment;
  }

  ListarCentroCostos() {
    this.http
      .get(environment.base_url + '/php/contabilidad/balanceprueba/lista_centro_costos.php')
      .subscribe((data: any) => {
        this.Centro_Costos = data;
      });
  }

  getQueryParams() {
    this.datePipeString = this.datePipe.transform(this.Parametros.Fecha_Corte, 'yyyy-MM-dd');
    let params: any = {
      tipo: this.Parametros.Tipo_Reporte,
      fecha_corte: this.datePipeString,
      nivel: this.Parametros.Nivel,
    };
    if (this.Parametros.Centro_Costo != '') {
      params.centro_costo = this.Parametros.Centro_Costo;
    }
    this.queryParams = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }

  openNewTab(route) {
    if (Object.keys(this.Parametros).every((key) => this.Parametros[key])) {
      const url = `${environment.base_url}${route}${this.queryParams}`;
      window.open(url, '_blank');
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: 'Completa toda la información.',
        showCancel: false,
      });
    }
  }
}
