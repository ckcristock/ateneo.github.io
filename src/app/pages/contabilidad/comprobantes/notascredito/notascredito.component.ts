import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ComprobantesService } from '../comprobantes.service';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Globales } from '../../globales';
import { HttpClient } from '@angular/common/http';
import { Location, NgIf, NgFor, DatePipe } from '@angular/common';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-notascredito',
  templateUrl: './notascredito.component.html',
  styleUrls: ['./notascredito.component.scss'],
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
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    StandardModule,
  ],
})
export class NotascreditoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  activeFilters = false;
  datePipe = new DatePipe('es-CO');
  environment: any;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  private isProgrammaticChange = false;
  public Cargando = true;
  public idFuncionario: any;
  public Notas: any = [];
  public perfilUsuario: string = '';
  public filtros: any = {
    cod_nota: '',
    funcionario: '',
    cliente: '',
    cod_factura: '',
  };

  constructor(
    private _user: UserService,
    private comprobantesService: ComprobantesService,
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private swalService: SwalService,
    public globales: Globales,
    readonly UrlFiltersService: UrlFiltersService,
  ) {
    ///////////////// this.perfilUsuario = localStorage.getItem('miPerfil');
    ///////////////// this.idFuncionario = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
    this.idFuncionario = this._user.user.person.id;
  }

  ngOnInit() {
    this.getUrlFilters();
    this.ListarDetallesFacturacion();
    this.environment = environment;
  }

  private getUrlFilters(): void {
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filtros = this.UrlFiltersService.currentFilters;
  }

  ListarDetallesFacturacion() {
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

  ///////// FUNCS. LLAMADAS DESDE EL HTML
  selectedDate(dates: DatePicker) {
    this.filtros = { ...this.filtros, ...dates };
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

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.ListarDetallesFacturacion();
  }
}
