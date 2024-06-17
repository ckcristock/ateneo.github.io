import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IngresosService } from './ingresos.service';
import { Location, NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.scss'],
  standalone: true,
  imports: [
    DatePickerComponent,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    StandardModule,
  ],
})
export class IngresosComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  environment: any;
  IdDocumento: string = '';

  pagination = {
    page: 1,
    pageSize: 100,
    length: 0,
  };

  private isProgrammaticChange = false;
  public Archivos: any[] = [];
  public Bancos: any = [];
  public Cargando: boolean = true;
  public Cliente = [];
  public Comprobante: any = {};
  public Comprobantes: any = [];
  public Cuenta = [];
  public Cuenta_Pasivos = [];
  public FormaPago: any = [];
  public Id_Cliente = '';
  public Id_Cuenta_Acredita = '';
  public Id_Cuenta_Debita = '';
  public page = 1;
  public perfilUsuario = localStorage.getItem('miPerfil');
  public ComprobanteModel: any = {
    Codigo: '',
    Concepto: '',
    Fecha: '',
    Cliente: '',
    Forma_Pago: '',
    Valor: '',
    Banco: '',
    Soporte: 'CuentasContables',
  };
  public filtro: any = {
    codigo: '',
    fechas: '',
    cliente: '',
    estado: '',
  };
  public filtros: any = {
    cli: '',
    cod: '',
    est: '',
  };
  ////////////// public Funcionario = JSON.parse(localStorage.getItem('User'));
  ////////////// id_funcionario: any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;

  constructor(
    private http: HttpClient,
    private ingresosService: IngresosService,
    private location: Location,
    private route: ActivatedRoute,
    private swalService: SwalService,
    readonly UrlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit() {
    this.loadInitialsEndpoints();
    this.ListarComprobantes();
    this.getUrlFilters();
    this.environment = environment;
  }

  loadInitialsEndpoints() {
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cliente.php')
      .subscribe((data: any) => {
        this.Cliente = data;
      });
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuenta = data.Activo;
        this.Cuenta_Pasivos = data.Pasivo;
      });

    this.http
      .get(environment.base_url + '/php/plancuentas/lista_bancos.php')
      .subscribe((data: any) => {
        this.Bancos = data;
      });
    this.http
      .get(environment.base_url + '/php/comprobantes/formas_pago.php')
      .subscribe((data: any) => {
        this.FormaPago = data;
      });
  }

  private getUrlFilters(): void {
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filtros = this.UrlFiltersService.currentFilters;
  }

  ///////// FUNCS. LLAMADAS DESDE EL HTML
  selectedDate(dates: DatePicker) {
    console.log('dates', dates);

    this.filtros = { ...this.filtros, ...dates };
    this.ListarComprobantes();
  }

  verComprobante(comprobanteId: string) {
    // this.ingresosService.verComprobante(comprobanteId).subscribe(
    //   (response: any) => {
    //     window.open(response.url, '_blank');
    //   },
    //   (error) => {
    //     console.error('Error al descargar el PDF:', error);
    //   }
    // );

    const request = (resolve: CallableFunction) => {
      this.ingresosService.verComprobante(comprobanteId).subscribe({
        next: (res: any) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10);
          let blob = new Blob([res], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'comprobante-ingreso-' + formattedDate;
          link.href = window.URL.createObjectURL(blob);
          link.download = `${filename}.pdf`;
          link.click();
          resolve(true);
          let swal = {
            icon: 'success',
            title: 'Operación exitosa',
            text: res.data,
            timer: 1000,
            showCancel: false,
          };
          this.swalService.show(swal);
        },
      });
    };
    this.swalService.swalLoading('Deseas descargar el comprobante?', request);
  }

  contabNIIF(comprobanteId: string) {
    const request = (resolve: CallableFunction) => {
      this.ingresosService.contabNIIF(comprobanteId).subscribe({
        next: (res: any) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10);
          let blob = new Blob([res], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'contabilización-' + formattedDate;
          link.href = window.URL.createObjectURL(blob);
          link.download = `${filename}.pdf`;
          link.click();
          resolve(true);
          let swal = {
            icon: 'success',
            title: 'Operación exitosa',
            text: res.data,
            timer: 1000,
            showCancel: false,
          };
          this.swalService.show(swal);
        },
        error: () => {
          this.swalService.hardError();
        },
      });
    };
    this.swalService.swalLoading('Deseas descargar la contabilización?', request);

    // this.ingresosService.contabNIIF(comprobanteId).subscribe(
    //   (response: any) => {
    //     const currentDate = new Date();
    //     const formattedDate = currentDate.toISOString().slice(0, 10);
    //     let blob = new Blob([response], { type: 'application/pdf' });
    //     let link = document.createElement('a');
    //     const filename = 'comprobante-ingreso-' + formattedDate;
    //     link.href = window.URL.createObjectURL(blob);
    //     link.download = `${filename}.pdf`;
    //     link.click();
    //   },
    //   (err: any) => {
    //   },
    //   () => {
    //   },
    // );

    // this.ingresosService.contabNIIF(comprobanteId).subscribe({
    //   next: (response: any) => {
    //     console.log('response', response);
    //     const link = document.createElement('a');
    //     link.href = response.url;
    //     link.target = '_blank';
    //     link.click();
    //   },
    //   error: (error) => {
    //     console.error('Error al descargar el PDF:', error);
    //   }
    // });
  }

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 100;
    this.ListarComprobantes();
  }
  /////////// FUNCIONES AUXILIARES PARA FUNCS. DE HTML
  ListarComprobantes() {
    this.Cargando = true;
    let queryString = '';
    let params = {
      ...this.pagination,
      ...this.filtros,
    };

    queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    this.UrlFiltersService.setUrlFilters(params);
    if (params.fecha) {
      this.getDateFromUrl(params.fecha);
    }
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_comprobantes.php' + queryString, {
        params: { tipo_comprobante: 'ingreso' },
      })
      .subscribe((res: any) => {
        this.Comprobantes = res.data.data;
        this.pagination.length = res.data.total;
        console.log('res', res);
        this.Cargando = false;
      });
  }

  getDateFromUrl(date) {
    if (date) {
      let fechas = date.split('%20-%20');
      let fechas2 = fechas[0].split(' - ');

      const fechaInicio = new Date(fechas2[0].replaceAll('-', '/'));
      const fechaFin = new Date(fechas2[1].replaceAll('-', '/'));

      if (fechaInicio && fechaFin) {
        this.isProgrammaticChange = true;
        this.filtros = {
          ...this.filtros,
          start_date: fechaInicio,
          end_date: fechaFin,
        };
        this.isProgrammaticChange = false;
      }
    }
  }

  onCancelDoc() {
    const request = () => {
      this.anularDocumento();
    };
    this.swalService.swalLoading('', request);
  }

  anularDocumento() {
    let datos: any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Recibos_Caja',
      // Identificacion_Funcionario: this.id_funcionario
    };

    this.AnularDocumentoContable(datos).subscribe(
      (data: any) => {
        let swal = {
          codigo: data.tipo,
          titulo: data.titulo,
          mensaje: data.mensaje,
        };
        this.swalService.ShowMessage(swal);

        this.ListarComprobantes();
      },
      (error) => {
        let swal = {
          codigo: 'warning',
          titulo: 'Oops!',
          mensaje:
            'Lamentablemente se ha perdido la conexión a internet. Por favor vuelve a intentarlo.',
        };
        this.swalService.ShowMessage(swal);
      },
    );
  }

  public AnularDocumentoContable(datos) {
    let info = JSON.stringify(datos);

    let data = new FormData();
    data.append('datos', info);

    return this.http.post(environment.base_url + '/php/contabilidad/anular_documento.php', data);
  }
}
