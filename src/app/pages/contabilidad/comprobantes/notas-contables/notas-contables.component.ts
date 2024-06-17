import { Component, OnInit } from '@angular/core';
import { ComprobantesService } from '../comprobantes.service';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { skipContentType } from 'src/app/http.context';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-notas-contables',
  templateUrl: './notas-contables.component.html',
  styleUrls: ['./notas-contables.component.scss'],
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
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    StandardModule,
  ],
})
export class NotasContablesComponent implements OnInit {
  activeFilters = false;
  companies: any[] = [];
  datePipe = new DatePipe('es-CO');
  environment: any;
  id_funcionario: any;
  IdDocumento: string = '';
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  public Cargando: boolean = true;
  public NotasContables: any = [];
  public filtros: any = {
    codigo: '',
    fechas: '',
    tercero: '',
    estado: '',
    empresa: '', //Id de la empresa
  };
  //////////// perfilUsuario:any = localStorage.getItem('miPerfil');

  constructor(
    private _user: UserService,
    private comprobantesService: ComprobantesService,
    private http: HttpClient,
    private swalService: SwalService,
    readonly UrlFiltersService: UrlFiltersService,
  ) {
    this.id_funcionario = this._user.user.person.id;
    this.environment = environment;
  }

  ngOnInit() {
    this.getUrlFilters();
    this.getCompaniesList();
    this.ListarNotasContables();
  }

  private getUrlFilters(): void {
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filtros = this.UrlFiltersService.currentFilters;
    if (this.filtros.empresa === undefined) this.filtros.empresa = '';
    if (this.filtros.estado === undefined) this.filtros.estado = '';
  }

  getCompaniesList() {
    this.http.get(environment.base_url + '/company').subscribe((res: any) => {
      this.companies = res.data;
    });
  }

  ListarNotasContables() {
    this.Cargando = true;
    let queryString = '';
    let params = {
      ...this.pagination,
      ...this.filtros,
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
      .get(environment.base_url + '/php/contabilidad/notascontables/lista_notas_contables.php', {
        params: params,
      })
      .subscribe((res: any) => {
        console.log('res', res);

        this.NotasContables = res.data.data;
        console.log('NotasContables', this.NotasContables);

        this.pagination.length = res.data.total;
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
        this.filtros = {
          ...this.filtros,
          start_date: fechaInicio,
          end_date: fechaFin,
        };
      }
    }
  }

  ///////// FUNCS. LLAMADAS DESDE EL HTML
  selectedDate(dates: DatePicker) {
    this.filtros = { ...this.filtros, ...dates };
    this.ListarNotasContables();
  }

  onCancelDoc() {
    const request = () => {
      this.anularDocumento();
    };
    this.swalService.swalLoading('Vamos a anular el documento', request);
  }

  getNIIF(idDocumentoContable) {
    //   this.comprobantesService.getPCGAOrNIIFNostasContables(idDocumentoContable).subscribe(
    //     (response: any) => {

    //       const currentDate = new Date();
    //       const formattedDate = currentDate.toISOString().slice(0, 10);
    //       let blob = new Blob([response], { type: 'application/pdf' });
    //       let link = document.createElement('a');
    //       const filename = 'documento-contable-' + formattedDate;
    //       link.href = window.URL.createObjectURL(blob);
    //       link.download = `${filename}.pdf`;
    //       link.click();
    //     },
    //     (err: any) => {},
    //     () => {},
    //   );

    // this.comprobantesService.getPCGAOrNIIFNostasContables(idDocumentoContable).subscribe({
    //   next: (response: any) => {
    //     const currentDate = new Date();
    //     const formattedDate = currentDate.toISOString().slice(0, 10);
    //     let blob = new Blob([response], { type: 'application/pdf' });
    //     let link = document.createElement('a');
    //     const filename = 'documento-contable-' + formattedDate;
    //     link.href = window.URL.createObjectURL(blob);
    //     link.download = `${filename}.pdf`;
    //     link.click();
    //   },
    //   error: (error) => {
    //     console.error('Error al descargar el PDF:', error);
    //   }
    // });

    const request = (resolve: CallableFunction) => {
      this.comprobantesService.getNiifNostasContables(idDocumentoContable).subscribe({
        next: (res: any) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 10);
          let blob = new Blob([res], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'documento-contable-' + formattedDate;
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

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.ListarNotasContables();
  }

  /////////// FUNCIONES AUXILIARES PARA FUNCS. DE HTML
  anularDocumento() {
    let datos: any = {
      Id_Registro: this.IdDocumento,
      Tipo: 'Notas_Contables',
      Identificacion_Funcionario: this.id_funcionario,
    };

    this.AnularDocumentoContable(datos).subscribe(
      (data: any) => {
        let swal = {
          codigo: data.tipo,
          titulo: data.titulo,
          mensaje: data.mensaje,
        };
        this.swalService.ShowMessage(swal);

        this.ListarNotasContables();
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

    return this.http.post(environment.base_url + '/php/contabilidad/anular_documento.php', data, {
      context: skipContentType(),
    });
  }
}
