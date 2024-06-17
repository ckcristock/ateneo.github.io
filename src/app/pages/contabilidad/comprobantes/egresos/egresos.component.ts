import { Component, OnInit, ViewChild } from '@angular/core';
import { EgresosService } from './egresos.service';
import { environment } from 'src/environments/environment';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.scss'],
  standalone: true,
  imports: [
    DatePickerComponent,
    DecimalPipe,
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
export class EgresosComponent implements OnInit {
  activeFilters = false;
  alertSwal: any;
  datePipe = new DatePipe('es-CO');
  environment: any;
  filtersForm: UntypedFormGroup;
  //ComprobanteVer
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  ///////////////// revisar perfilUsuario
  perfilUsuario: any = localStorage.getItem('miPerfil');
  private isProgrammaticChange = false;
  public Bancos: any = [];
  public Cargando: boolean = true;
  public ClientesFiltrar = [];
  public Comprobantes: any = [];
  public CuentasActivos = [];
  public CuentasPasivos = [];
  public fecha = new Date();
  public FormaPago: any = [];
  public Id_Proveedor: any = '';
  public IdDocumento: string = '';
  public NombreProveedor: string = '';
  public page = 1;
  public Comprobante: any = {};
  public Proveedores: any[] = [];
  public Soporte: any = [];
  public Clientes: any = [
    { Id_Cliente: 1, Nombre_Cliente: 'Kendry Ortiz' },
    { Id_Cliente: 2, Nombre_Cliente: 'Pedro Castillo' },
    { Id_Cliente: 3, Nombre_Cliente: 'Franklin Guerra' },
    { Id_Cliente: 4, Nombre_Cliente: 'Augusto Carrillo' },
  ];
  public ComprobanteModel: any = {
    Nro_Referencia: '',
    Concepto: '',
    Fecha_Comprobante: '',
    Id_Cliente: 0,
    Id_Proveedor: '',
    Id_Forma_Pago: '',
    Monto: '',
    Id_Banco: '',
    Id_Cuenta_Acredita: 0,
    Id_Cuenta_Debita: 0,
    Observaciones: '',
    // Id_Funcionario: this.id_funcionario,
    Tipo: 'Egreso',
  };
  public filtros: any = {
    cli: '',
    cod: '',
    empresa: '',
    cheque: '',
    est: '',
  };
  constructor(
    private egresosService: EgresosService,
    private http: HttpClient,
    private swalService: SwalService,
    readonly UrlFiltersService: UrlFiltersService,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    this.environment = environment;
    this.initForms();
    this.loadInitialsEndpoints();
    this.getUrlFilters();
    this.ListarComprobantes();
  }

  private initForms(): void {
    this.filtersForm = this.fb.group({
      cod: [''],
      cli: [''],
      cheque: [''],
      est: [''],
    });
  }
  loadInitialsEndpoints() {
    this.http
      .get(environment.base_url + '/php/contabilidad/proveedor_buscar.php')
      .subscribe((data: any) => {
        this.Proveedores = data;
      });
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_proveedores.php')
      .subscribe((data: any) => {
        this.ClientesFiltrar = data;
      });

    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.CuentasActivos = data.Activo;
        this.CuentasPasivos = data.Pasivo;
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

  ListarComprobantes() {
    this.Cargando = true;
    // let filtersFormData = JSON.stringify(this.filtersForm.value);
    let queryString = '';
    let params = {
      ...this.pagination,
      ...this.filtros,
      ...this.filtersForm.value,
    };
    console.log('params', params);

    queryString =
      '' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    this.UrlFiltersService.setUrlFilters(params);
    if (params.fecha) {
      this.getDateFromUrl(params.fecha);
    }
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_egresos.php?' + queryString)
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

  selectedDate(dates: DatePicker) {
    this.filtros = { ...this.filtros, ...dates };
    this.ListarComprobantes();
  }

  onCancelDoc() {
    const request = () => {
      this.anularDocumento();
    };
    this.swalService.swalLoading('Se dispone a anular este documento', request);
  }

  anularDocumento() {
    let datos: any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Egreso',
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
          mensaje: 'Algo ha salido mal, por favor vuelve a intentarlo.',
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

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.ListarComprobantes();
  }

  descargarNIIF(comprobanteId: string) {
    const request = (resolve: CallableFunction) => {
      this.egresosService.descargarNIIF(comprobanteId).subscribe({
        next: (res: any) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10);
          let blob = new Blob([res], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'comprobante-egreso-' + formattedDate;
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
}
