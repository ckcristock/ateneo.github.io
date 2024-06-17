import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { NgForm, FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FacturaMedicamentosService } from '../factura-medicamentos/factura-medicamentos.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-factura-capita',
  templateUrl: './factura-capita.component.html',
  styleUrls: ['./factura-capita.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    NgIf,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    DatePipe,
  ],
})
export class FacturaCapitaComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('formAnularFactura') formAnularFactura: NgForm;
  @ViewChild('modalAnularFactura') modalAnularFactura: any;

  matPanel = false;
  loading: boolean = true;

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }

  public Fecha_Indica = '';
  public filtro_cod_fact: string = '';
  public filtro_fecha_fact: any = '';
  public filtro_estado_fact: string = '';
  public filtro_facturador: string = '';
  public filtro_cliente: string = '';
  public filtro_tipo_fact: string = '';
  public Cargando = false;
  public Facturas: any = [];

  public maxSize = 20;
  public TotalItems1: number;
  public page1 = 1;
  Indicadores: any = [];
  public Departamentos: any = [];
  public Fechas: any = '';
  public Fechas_Facturacion: any = '';
  public Puntos: Array<String>;
  public Punto: any = '';
  public studentChartOption: any;

  public facturacionChartTag: CanvasRenderingContext2D;
  public studentChartData: any;
  public Mes = [];
  public Facturas_Mes = [];
  public Capita_Mes = [];
  Id_Factura: any = '';
  public alertOption: SweetAlertOptions = {};
  causales_anulacion: any = [];
  private Identificacion_Funcionario = 1; //quemado
  public ModelAnular: any = {
    Funcionario_Anula: this.Identificacion_Funcionario,
    Observaciones: '',
    Causal_Anulacion: '',
  };

  public Servicios: any = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private _tiposervicio: FacturaMedicamentosService,
  ) {
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Anular esta Factura',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Anular',
      showLoaderOnConfirm: true,
      focusCancel: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          this.AnularFactura(this.formAnularFactura);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };

    this.getServicios();
  }

  ngOnInit() {
    this.listaCausalAnulacion();
    this.ListarDetallesFacturacion();
    this.cargarIndicadores();
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Departamento' },
      })
      .subscribe((data: any) => {
        this.Departamentos = data;
      });

    this.http
      .get(environment.ruta + 'php/tablero_jefe_facturacion/grafica_facturas.php')
      .subscribe((data: any) => {
        data.forEach((element) => {
          this.Mes.push(element.Mes);
          this.Facturas_Mes.push(element.Subtotal);
          this.Capita_Mes.push(element.Capita);
        });
        setTimeout(() => {
          const def = this.facturacionChartTag.createLinearGradient(500, 0, 100, 0);
          def.addColorStop(0, '#3999a0');
          def.addColorStop(1, '#012a2d');

          this.studentChartData = {
            labels: this.Mes,
            datasets: [
              {
                label: 'Facturas',
                backgroundColor: '#3999a0',
                pointBorderColor: '#fff',
                pointBackgroundColor: def,
                pointHoverBackgroundColor: '#3999a0',
                pointHoverBorderColor: def,
                pointBorderWidth: 2,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 1,
                pointRadius: 5,
                fill: true,
                borderWidth: 2,
                data: this.Facturas_Mes,
              },
              {
                label: 'Facturas Capita',
                backgroundColor: '#656565',
                pointBorderColor: '#fff',
                pointBackgroundColor: def,
                pointHoverBackgroundColor: '#3999a0',
                pointHoverBorderColor: def,
                pointBorderWidth: 2,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 1,
                pointRadius: 5,
                fill: true,
                borderWidth: 2,
                data: this.Capita_Mes,
              },
            ],
          };
          this.Cargando = true;
        }, 10);
      });
  }

  cargarIndicadores() {
    this.http
      .get(environment.ruta + 'php/tablero_jefe_facturacion/indicadores_jefe_facturacion.php')
      .subscribe((data: any) => {
        this.Indicadores = data;
      });
  }

  ListarDetallesFacturacion() {
    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page1 = params.pag ? params.pag : 1;
      this.filtro_cod_fact = params.cod_fact ? params.cod_fact : '';
      this.filtro_fecha_fact = params.fecha_fact ? params.fecha_fact : '';
      this.filtro_estado_fact = params.estado_fact ? params.estado_fact : '';
      this.filtro_facturador = params.facturador ? params.facturador : '';
      this.filtro_cliente = params.cliente ? params.cliente : '';

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }

    this.http
      .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php' + queryString)
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg;
      });
  }
  paginacion() {
    let params: any = {
      pag: this.page1,
    };

    if (this.filtro_cod_fact != '') {
      params.cod_fact = this.filtro_cod_fact;
    }
    if (this.filtro_fecha_fact != '' && this.filtro_fecha_fact != null) {
      params.fecha_fact = this.filtro_fecha_fact;
    }
    if (this.filtro_estado_fact != '') {
      params.estado_fact = this.filtro_estado_fact;
    }
    if (this.filtro_facturador != '') {
      params.facturador = this.filtro_facturador;
    }
    if (this.filtro_cliente != '') {
      params.cliente = this.filtro_cliente;
    }
    if (this.filtro_tipo_fact != '') {
      params.tipo = this.filtro_tipo_fact;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/tablero', queryString);

    this.http
      .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?' + queryString)
      .subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg;
      });
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.Fecha_Indica = event.formatted;
    } else {
      this.Fecha_Indica = '';
    }
  }

  dateRangeChanged1(event) {
    if (event.formatted != '') {
      this.filtro_fecha_fact = event.formatted;
    } else {
      this.filtro_fecha_fact = '';
    }
    this.filtros1();
  }

  filtros1() {
    let params: any = {};

    if (
      this.filtro_cod_fact != '' ||
      this.filtro_fecha_fact != '' ||
      this.filtro_estado_fact != '' ||
      this.filtro_facturador != '' ||
      this.filtro_cliente != '' ||
      this.filtro_tipo_fact != ''
    ) {
      this.page1 = 1;
      params.pag = this.page1;

      if (this.filtro_cod_fact != '') {
        params.cod_fact = this.filtro_cod_fact;
      }
      if (this.filtro_fecha_fact != '' && this.filtro_fecha_fact != null) {
        params.fecha_fact = this.filtro_fecha_fact;
      }
      if (this.filtro_estado_fact != '') {
        params.estado_fact = this.filtro_estado_fact;
      }
      if (this.filtro_facturador != '') {
        params.facturador = this.filtro_facturador;
      }
      if (this.filtro_cliente != '') {
        params.cliente = this.filtro_cliente;
      }
      if (this.filtro_tipo_fact != '') {
        params.tipo = this.filtro_tipo_fact;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/tablero', queryString);

      this.http
        .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?' + queryString)
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.TotalItems1 = data.numReg;
        });
    } else {
      this.location.replaceState('/tablero', '');

      this.page1 = 1;
      this.filtro_fecha_fact = '';
      this.filtro_cod_fact = '';
      this.filtro_estado_fact = '';
      this.filtro_facturador = '';
      this.filtro_cliente = '';
      this.filtro_tipo_fact = '';

      this.http
        .get(environment.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php')
        .subscribe((data: any) => {
          this.Facturas = data.Facturas;
          this.TotalItems1 = data.numReg;
        });
    }
  }
  dateRangeChanged2(event) {
    this.Fechas = event.formatted;
  }
  cargarPuntos(id_dep) {
    if (id_dep != '') {
      this.http
        .get(environment.ruta + 'php/reportes/puntos.php', { params: { id_dep: id_dep } })
        .subscribe((data: any) => {
          this.Puntos = data;
        });
    }
  }

  downloadReporte() {
    let Departamento = (document.getElementById('Departamento') as HTMLInputElement).value;
    let Punto = this.Punto;
    let Funcionario = (document.getElementById('Funcionario') as HTMLInputElement).value;
    let Paciente = (document.getElementById('Paciente') as HTMLInputElement).value;
    let Tipo = (document.getElementById('Tipo_Servicio') as HTMLInputElement).value;
    let Pendientes = (document.getElementById('Pendientes') as HTMLInputElement).value;
    let Dispensacion = (document.getElementById('Dispensacion') as HTMLInputElement).value;
    let Cliente = (document.getElementById('Cliente') as HTMLInputElement).value;
    let params: any = {};

    if (this.Fechas != '') {
      params.fechas = this.Fechas.replace('-', '%2D');
    }
    if (Departamento != '') {
      params.dep = Departamento;
    }
    if (Punto != '') {
      params.pto = Punto;
    }
    if (Funcionario != '') {
      params.func = Funcionario;
    }
    if (Paciente != '') {
      params.pac = Paciente;
    }
    if (Tipo != '') {
      params.tipo = Tipo;
    }
    if (Pendientes != '') {
      params.pend = Pendientes;
    }
    if (Dispensacion != '') {
      params.dis = Dispensacion;
    }
    if (Cliente != '') {
      params.cte = Cliente;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    window.open(
      environment.ruta + 'php/dispensaciones/reporte_disp_excel.php' + queryString,
      '_blank',
    );
  }

  dateRangeChanged3(event) {
    this.Fechas_Facturacion = event.formatted;
  }
  downloadReporteFacturacion() {
    let Funcionario = (document.getElementById('Funcionario_Factura') as HTMLInputElement).value;
    let Tipo = (document.getElementById('Tipo_Servicio_Factura') as HTMLInputElement).value;
    let Cliente = (document.getElementById('Cliente_Factura') as HTMLInputElement).value;
    let Estado = (document.getElementById('Estado') as HTMLInputElement).value;
    let Tipo_Reporte = (document.getElementById('Tipo_Factura') as HTMLInputElement).value;

    let params: any = {};

    if (this.Fechas_Facturacion != '') {
      params.fechas = this.Fechas_Facturacion.replace('-', '%2D');
    }

    if (Funcionario != '') {
      params.func = Funcionario;
    }
    if (Tipo != '') {
      params.tipo = Tipo;
    }
    if (Cliente != '') {
      params.cliente = Cliente;
    }
    if (Estado != '') {
      params.estado = Estado;
    }
    if (Tipo_Reporte != '') {
      params.tipo_reporte = Tipo_Reporte;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    window.open(
      environment.ruta + 'php/tablero_jefe_facturacion/reporte_facturacion.php' + queryString,
      '_blank',
    );
  }

  listaCausalAnulacion() {
    this.http
      .get(environment.ruta + 'php/tablero_jefe_facturacion/lista_causal_anulacion.php')
      .subscribe((data: any) => {
        this.causales_anulacion = data;
      });
  }

  AnularFactura(formulario) {
    let info = 'environment.normalize(JSON.stringify(this.ModelAnular))';

    let datos = new FormData();
    datos.append('id', this.Id_Factura);
    datos.append('datos', info);

    this.http
      .post(environment.ruta + 'php/tablero_jefe_facturacion/anular_factura.php', datos)
      .subscribe((data: any) => {
        this.ModelAnular = {
          Funcionario_Anula: this.Identificacion_Funcionario,
          Observaciones: '',
          Causal_Anulacion: '',
        };

        this.modalAnularFactura.hide();

        this.ListarDetallesFacturacion();
      });
  }

  isAdmin() {
    let miPerfil = localStorage.getItem('miPerfil');

    if (miPerfil == '16' || miPerfil == '33') {
      return true;
    }

    return false;
  }
  getServicios() {
    this._tiposervicio.GetServiciosTipoServicio().subscribe((data: any) => {
      this.Servicios = data;
    });
  }
}
