import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../globales';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location, NgIf, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ComprobantesService } from '../comprobantes.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-notas-debito',
  templateUrl: './notas-debito.component.html',
  styleUrls: ['./notas-debito.component.scss'],
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
    MatPaginatorModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    StandardModule,
  ],
})
export class NotasDebitoComponent implements OnInit {
  public perfilUsuario: string = '';
  public funcionario: any = {};
  public filtro_cod_nota: string = '';
  public filtro_cod_factura: string = '';
  public filtro_fecha_nota: any = '';
  public filtro_funcionario: string = '';
  public filtro_cliente: string = '';
  public filtro_tipo_fact: string = '';
  public page1 = 1;
  public maxSize = 15;
  public TotalItems1: number;
  public Cargando = true;
  public Notas: any = [];
  public Servicios: any = [];
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  activeFilters = false;
  environment: any;
  public filtros: any = {
    cod_nota: '',
    cod_factura: '',
    funcionario: '',
    cliente: '',
  };
  private isProgrammaticChange = false;
  datePipe = new DatePipe('es-CO');
  public idFuncionario: any;

  constructor(
    private http: HttpClient,
    public globales: Globales,
    private route: ActivatedRoute,
    private location: Location,
    readonly UrlFiltersService: UrlFiltersService,
    private swalService: SwalService,
    private comprobantesService: ComprobantesService,
    private _user: UserService,
  ) {
    // this.perfilUsuario = localStorage.getItem('miPerfil');
    // this.funcionario = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
    // this.getServicios();
    this.idFuncionario = this._user.user.person.id;
  }

  ngOnInit() {
    this.getUrlFilters();
    this.environment = environment;
    this.ListarDetallesFacturacion();
  }

  private getUrlFilters(): void {
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filtros = this.UrlFiltersService.currentFilters;
  }

  selectedDate(dates: DatePicker) {
    this.filtros = { ...this.filtros, ...dates };
    this.ListarDetallesFacturacion();
  }

  getDateFromUrl(date) {
    if (date) {
      let fechas = date.split('%20-%20');
      let fechas2 = fechas[0].split(' - ');

      const fechaInicio = new Date(fechas2[0].replaceAll('-', '/'));
      const fechaFin = new Date(fechas2[1].replaceAll('-', '/'));

      if (fechaInicio && fechaFin) {
        this.filtros = {
          ...this.filtros,
          start_date: fechaInicio,
          end_date: fechaFin,
        };
      }
    }
  }

  ListarDetallesFacturacion() {
    this.Cargando = true;
    this.Cargando = true;
    let queryString = '';
    let params = {
      ...this.pagination,
      ...this.filtros,
    };

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
      .get(environment.base_url + '/php/notas_credito_nuevo/get_notas_creditos.php?' + queryString)
      .subscribe((res: any) => {
        this.Notas = res.data.data;
        this.pagination.length = res.data.total;
        console.log('resNotas', res);
        this.Cargando = false;
      });
  }
  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.ListarDetallesFacturacion();
  }

  getNotaCreditoPDF(idNotaCredito: string) {
    const request = (resolve: CallableFunction) => {
      this.comprobantesService.getNotaCreditoPDF(idNotaCredito).subscribe({
        next: (res: any) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10);
          let blob = new Blob([res], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'comprobante-nota-credito-' + formattedDate;
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

  getNiif(idNotaCredito: string, nomFuncionario: string) {
    const request = (resolve: CallableFunction) => {
      this.comprobantesService.getNiifNostasCredito(idNotaCredito, this.idFuncionario).subscribe({
        next: (res: any) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10);
          let blob = new Blob([res], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'NIIF//////' + nomFuncionario + formattedDate;
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
    this.swalService.swalLoading('Deseas descargar el Niif?', request);
  }
}
