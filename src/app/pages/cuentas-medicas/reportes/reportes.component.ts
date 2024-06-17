import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TiposervicioService } from './tiposervicio.service';
import { GeneralService } from 'src/app/services/general.service';
import { UserService } from 'src/app/core/services/user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteMdlComponent } from '../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    AutocompleteMdlComponent,
    MatInputModule,
    MatPaginatorModule,
    NotDataComponent,
    DatePipe,
  ],
})
export class ReportesComponent implements OnInit {
  myDateRangePickerOptions: any = {
    width: '170px',
    height: '22px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '14px',
    dateFormat: 'yyyy-mm-dd',
  };
  public Fechas: any = '';
  public Departamentos: any = [];
  public Eps: any = [];
  public Puntos: Array<any>;
  public Reporte: any = '';
  public Cargando: boolean = false;
  public Punto: any = '';

  public page = 1;
  public TotalItems: number;
  public maxSize = 20;
  public pageSize = 20;
  public Dispensaciones: any = [];
  public Servicios: any = {};
  public Nit_Eps: any = '';
  public Tipo: string = 'Producto';
  public funcionario: any;

  Departamento = '';
  Funcionario = '';
  Paciente = '';
  Pendientes = '';
  Dispensacion = '';
  Producto = '';
  Factura = '';
  Codigo_Cum = '';
  Servicio = '';
  Estado_Dis = '';

  @ViewChild('messageSwal') messageSwal: any;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  globales = environment;

  constructor(
    private http: HttpClient,
    private router: ActivatedRoute,
    private _tipoServicioService: TiposervicioService,
    private _GeneralService: GeneralService,
    private readonly userService: UserService,
  ) {
    this.funcionario = userService.user.person.identifier;
  }

  ngOnInit() {
    this._getServiciosTipoServicio();
    this.http
      .get(this.globales.ruta + 'php/reportes/eps_departamentos.php')
      .subscribe((data: any) => {
        this.Departamentos = data.Departamento;
        this.Eps = data.Eps;
      });
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.Fechas = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
  }

  private _getServiciosTipoServicio() {
    this._tipoServicioService.GetServicios().subscribe((data: Array<any>) => {
      this.Servicios = data;
    });
  }

  cargarPuntos(id_dep) {
    if (id_dep != '') {
      this.http
        .get(this.globales.ruta + 'php/reportes/puntos.php', {
          params: { id_dep: id_dep },
        })
        .subscribe((data: any) => {
          this.Puntos = data;
        });
    }
  }

  dateRangeChanged(event) {
    this.Fechas = event.formatted;
  }
  tipoReporte = '';
  botones = false;
  mostrarBotonesReportes(tipo) {
    this.botones = !this.botones;
    this.tipoReporte = tipo;
  }

  verReporte(tipo) {
    this.botones = false;
    if (
      this.Fechas != '' ||
      this.Departamento != '' ||
      this.Punto != '' ||
      this.Funcionario != '' ||
      this.Paciente != '' ||
      this.Tipo != '' ||
      this.Pendientes != '' ||
      this.Dispensacion != '' ||
      this.Producto != '' ||
      this.Factura != '' ||
      this.Codigo_Cum != '' ||
      this.Servicio != '' ||
      this.Estado_Dis != ''
    ) {
      let params: any = {};
      let queryParams = '';

      if (this.Fechas != '') {
        params.fechas = this.Fechas.replace('-', '%2D');
      }
      if (this.Departamento != '') {
        params.dep = this.Departamento;
      }
      if (this.Punto != '') {
        params.pto = this.Punto;
      }
      if (this.Funcionario != '') {
        params.func = this.Funcionario;
      }
      if (this.Paciente != '') {
        params.pac = this.Paciente;
      }
      if (this.Tipo != '') {
        params.tipo = this.Tipo;
      }
      if (this.Pendientes != '') {
        params.pend = this.Pendientes;
      }
      if (this.Dispensacion != '') {
        params.dis = this.Dispensacion;
      }
      if (this.Producto != '') {
        params.prod = this.Producto;
      }
      if (this.Nit_Eps != '') {
        params.nit = this.Nit_Eps;
      }
      if (this.Factura != '') {
        params.estado_facturacion = this.Factura;
      }
      if (this.Codigo_Cum != '') {
        params.cum = this.Codigo_Cum;
      }
      if (this.Servicio != '') {
        params.servicio = this.Servicio;
      }
      if (this.Estado_Dis != '') {
        params.estado_disp = this.Estado_Dis;
      }

      this.Cargando = true;

      queryParams =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');

      if (tipo == 'Producto') {
        this.http
          .get(this.globales.ruta + 'php/dispensaciones/reporte_disp.php' + queryParams)
          .subscribe((data: any) => {
            this.Cargando = false;
            this.Reporte = data.dispensaciones;
            this.TotalItems = data.numReg;
            this.Tipo = 'Producto';
          });
      } else {
        this.http
          .get(this.globales.ruta + 'php/dispensaciones/reporte_dispensaciones.php' + queryParams)
          .subscribe((data: any) => {
            this.Cargando = false;
            this.Reporte = JSON.parse(JSON.stringify(data.dispensaciones));
            this.TotalItems = data.numReg;
            this.Tipo = 'Dispensacion';
          });
      }
    } else {
      this.messageSwal.title = 'Campos Vacíos';
      this.messageSwal.text = 'Debes filtrar al menos por un campo.';
      this.messageSwal.type = 'warning';
      this.messageSwal.show();
    }
  }

  onPagination(pageObj: MatPaginator): void {
    this.page = (pageObj?.pageIndex ?? 0) + 1;
    this.paginacion();
  }

  paginacion() {
    let params: any = {
      pag: this.page,
    };

    params.funcionario = this.funcionario;
    if (this.Fechas != '') {
      params.fechas = this.Fechas.replace('-', '%2D');
    }
    if (this.Departamento != '') {
      params.dep = this.Departamento;
    }
    if (this.Punto != '') {
      params.pto = this.Punto;
    }
    if (this.Funcionario != '') {
      params.func = this.Funcionario;
    }
    if (this.Paciente != '') {
      params.pac = this.Paciente;
    }
    if (this.Tipo != '') {
      params.tipo = this.Tipo;
    }
    if (this.Pendientes != '') {
      params.pend = this.Pendientes;
    }
    if (this.Dispensacion != '') {
      params.dis = this.Dispensacion;
    }
    if (this.Producto != '') {
      params.prod = this.Producto;
    }
    if (this.Nit_Eps != '') {
      params.nit = this.Nit_Eps;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    this.Cargando = true;

    this.http
      .get(this.globales.ruta + 'php/dispensaciones/reporte_disp.php' + queryString)
      .subscribe((data: any) => {
        this.Cargando = false;
        this.Reporte = data.dispensaciones;
        this.TotalItems = data.numReg;
      });
  }

  downloadReporte(tipo) {
    // this.botones=false;

    let params: any = {};

    params.funcionario = this.funcionario;
    if (this.Fechas != '') {
      params.fechas = this.Fechas.replace('-', '%2D');
    }
    if (this.Departamento != '') {
      params.dep = this.Departamento;
    }
    if (this.Punto != '') {
      params.pto = this.Punto;
    }
    if (this.Funcionario != '') {
      params.func = this.Funcionario;
    }
    if (this.Paciente != '') {
      params.pac = this.Paciente;
    }
    if (this.Tipo != '') {
      params.tipo = this.Tipo;
    }
    if (this.Pendientes != '') {
      params.pend = this.Pendientes;
    }
    if (this.Dispensacion != '') {
      params.dis = this.Dispensacion;
    }
    if (this.Producto != '') {
      params.prod = this.Producto;
    }
    if (this.Nit_Eps != '') {
      params.nit = this.Nit_Eps;
    }
    if (this.Factura != '') {
      params.estado_facturacion = this.Factura;
    }
    if (this.Codigo_Cum != '') {
      params.cum = this.Codigo_Cum;
    }
    if (this.Servicio != '') {
      params.servicio = this.Servicio;
    }
    if (this.Estado_Dis != '') {
      params.estado_disp = this.Estado_Dis;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    if (tipo == 'Txt') {
      window.open(
        this.globales.ruta + 'php/dispensaciones/reporte_disp_plano.php' + queryString,
        '_blank',
      );
    } else if (tipo == 'Excel') {
      this.descargarExcelProductos(queryString);
      // window.open(this.globales.ruta+'php/dispensaciones/reporte_disp_excel.php'+queryString, '_blank');
    } else if (tipo == 'Dispensacion') {
      window.open(
        this.globales.ruta + 'php/dispensaciones/reporte_dispensaciones_excel.php' + queryString,
        '_blank',
      );
    } else if (tipo == 'TxtDispensacion') {
      window.open(
        this.globales.ruta + 'php/dispensaciones/reporte_dispensaciones_plano.php' + queryString,
        '_blank',
      );
    }
  }
  public cargandoReporte = false;

  descargarExcelProductos(query) {
    this.cargandoReporte = true;
    this.http
      .get(this.globales.ruta + 'php/dispensaciones/reporte_disp_excel.php' + query)
      .subscribe(
        (data: any[]) => {
          console.log(data);
          // if (data.length>0) this._excel.exportAsExcelFile(data, "Reporte Dispensacion");
          this.cargandoReporte = false;
        },
        (e) => {
          console.log(e);
          this.cargandoReporte = false;
        },
        () => {},
      );
  }
}
