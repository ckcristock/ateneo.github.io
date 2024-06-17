import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ModalactaentregaComponent } from './modalactaentrega/modalactaentrega.component';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { skipContentType } from 'src/app/http.context';
import { UserService } from 'src/app/core/services/user.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  standalone: true,
  imports: [
    NotDataComponent,
    ActionActivateComponent,
    ActionDeactivateComponent,
    HeaderButtonComponent,
    ActionButtonComponent,
    DropdownActionsComponent,
    CardComponent,
    TableComponent,
    AddButtonComponent,
    ModalactaentregaComponent,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgbDropdownModule,
    RouterModule,
    NgbPaginationModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    NgbDropdownModule,
    ModalBasicComponent,
    MatPaginatorModule,
    CapitalLetterPipe,
  ],
  providers: [],
  selector: 'app-dispensaciones',
  templateUrl: './dispensaciones.component.html',
  styleUrls: ['./dispensaciones.component.scss'],
})
export class DispensacionesComponent implements OnInit {
  public user: any;
  public AbrirModalActa: Subject<any> = new Subject();
  datePipe = new DatePipe('es-CO');

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('modalAnular') modalAnular: any;

  rowsFilter = [];
  tempFilter = [];
  loadingIndicator = true;
  timeout: any;
  Total_Dis = 0;
  Dis_Capitadas = 0;
  Dis_Eventos = 0;
  Dis_NoPos = 0;
  Dis_Pendientes = 0;
  Dis_Facturadas = 0;
  Dis_Sin_Facturadas = 0;
  Dis_Auditadas = 0;
  Dis_Sin_Auditadas = 0;
  Dis_Activas = 0;
  Dis_Anuladas = 0;
  Dispensaciones: any = [];
  public fecha_reporte: any = '';
  public Cargando = false;

  public page = 1;
  public orden = 'Fecha';

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  private isProgrammaticChange = false;
  range = new FormGroup({
    start: new FormControl<Date | string | null>(new Date()),
    end: new FormControl<Date | string | null>(new Date()),
  });

  public Indicador = [];
  public Options: any = {};

  public Disp: any = {
    Cod_Disp: '',
    Id_Dispensacion: '',
    Motivo_Anulacion: '',
  };
  public Servicios: any = [];
  public environment: any;
  selected: any;
  public filtros: any = {
    cod: '',
    fecha: '',
    tipo: '',
    pers: '',
    punto: '',
    dep: '',
    pend: '',
    fact: '',
    auditoria: '',
    est: '',
    orden: 'Fecha',
  };
  activeFilters = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private swalService: SwalService,
    private readonly _user: UserService,
    private _modal: ModalService,
    readonly UrlFiltersService: UrlFiltersService,
  ) {
    this.getUrlFilters();
    this.ListarDispensaciones();
    this.getServicios();
  }

  ngOnInit() {
    this.filtros.orden = 'Fecha';

    let ruta = this.route.snapshot.queryParams;
    this.environment = environment;

    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end && !this.isProgrammaticChange) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }

  openModal(content) {
    this._modal.open(content);
    this.selected = 'Dispensaciones enviadas';
  }

  private getUrlFilters(): void {
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filtros = this.UrlFiltersService.currentFilters;
  }

  ListarDispensaciones() {
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

    // let miPerfil = localStorage.getItem('miPerfil');

    // if (this.perfilDispensador()) {
    //   if (queryString != '') {
    //     queryString += '&id_punto='+localStorage.getItem('Punto');
    //   } else {
    //     queryString = '?id_punto='+localStorage.getItem('Punto');
    //   }
    // }

    this.UrlFiltersService.setUrlFilters(params);

    if (params.fecha) {
      let fechas = params.fecha.split('%20-%20');
      let fechas2 = fechas[0].split(' - ');

      const fechaInicio = new Date(fechas2[0].replaceAll('-', '/'));
      const fechaFin = new Date(fechas2[1].replaceAll('-', '/'));

      if (fechaInicio && fechaFin) {
        this.isProgrammaticChange = true;
        this.range.setValue(
          {
            start: fechaInicio,
            end: fechaFin,
          },
          { emitEvent: false },
        );
        this.isProgrammaticChange = false;
      }
    }
    // this.setFiltrosUrlDispensaciones();
    this.getIndicadores(queryString); //obtiene indicadores con logos
    this.http
      .get(environment.base_url + '/php/dispensaciones/lista_dispensaciones.php?' + queryString)
      .subscribe((data: any) => {
        this.Dispensaciones = data.dispensaciones;
        this.Indicadores(data.indicadores);
        this.pagination.length = data.numReg;
        this.Cargando = false;
      });
  }

  selectedDate(start, end) {
    if (start && end) {
      this.filtros.fecha =
        this.datePipe.transform(start, 'yyyy-MM-dd') +
        ' - ' +
        this.datePipe.transform(end, 'yyyy-MM-dd');
    } else {
      this.filtros.fecha = '';
    }
    this.ListarDispensaciones();
  }

  // perfilDispensador() {
  //   let miPerfil = localStorage.getItem('miPerfil');
  //   let miPerfil;

  //   if (miPerfil == '15' || miPerfil == '25') {
  //     return true;
  //   }
  //   return false;
  // }

  Indicadores(data) {
    this.Dis_Capitadas = data?.Dis_Capitadas;
    this.Dis_Eventos = data?.Dis_Eventos;
    this.Dis_NoPos = data?.Dis_NoPos;
    this.Dis_Pendientes = data?.Dis_Pendientes ? data?.Dis_Pendientes : 0;
    this.Dis_Facturadas = data?.Dis_Facturadas;
    this.Total_Dis = data?.Dis_Totales;
  }

  SuspenderDispensacion() {
    // params
    let datos = new FormData();
    datos.append('modulo', 'Dispensacion');
    datos.append('funcionario', this._user.user.person.identifier);
    datos.append('Id_Dispensacion', this.Disp.Id_Dispensacion);
    datos.append('Motivo_Anulacion', this.Disp.Motivo_Anulacion);

    const request = (resolve: CallableFunction) => {
      this.http
        .post(environment.base_url + '/php/dispensaciones/eliminar_dispensacion.php', datos, {
          context: skipContentType(),
        })
        .subscribe({
          next: () => {
            this._modal.close();
            this.ListarDispensaciones();
            resolve(true);
            let swal = {
              icon: 'success',
              title: 'Dispensacion anulada',
              text: 'Se ha anulado correctamente la dispensación',
              timer: null,
              showCancel: false,
            };
            this.swalService.show(swal);
          },
        });
    };
    this.swalService.swalLoading(
      'Al anular esta dispensación estas bajo juramento ejecutando esta accion y tú te haces responsable de que todos los productos esten en perfecto estado y completos',
      request,
    );
  }

  motivoAnulacion(modal, pos) {
    this.openModal(modal);

    this.Disp.Cod_Disp = this.Dispensaciones[pos]?.Codigo;
    this.Disp.Id_Dispensacion = this.Dispensaciones[pos]?.Id_Dispensacion;
  }

  public AbrirModalActaEntrega(dispensacion: string = '') {
    let data = { Id_Dispensacion: dispensacion, tipo: 'Guardar_Acta' };
    this.AbrirModalActa.next(data);
  }

  LimpiarModelo(tipo = null) {
    this.ListarDispensaciones();
  }

  getIndicadores(queryString) {
    this.http
      .get(environment.base_url + '/php/dispensaciones/indicadores.php?' + queryString)
      .subscribe((data: any) => {
        this.Indicador = data;
        this.Indicadores(data.indicadores);
      });
  }
  getServicios() {
    let queryString = '';
    // if (this.perfilDispensador()) {
    //   if (queryString != '') {
    //     queryString += '&id_punto='+localStorage.getItem('Punto');
    //   } else {
    //     queryString = '?id_punto='+localStorage.getItem('Punto');
    //   }
    // }

    this.http
      .get(environment.base_url + '/php/dispensaciones/get_servicios.php?' + queryString)
      .subscribe((data: any) => {
        this.Servicios = data;
        data.forEach((cd) => {
          if (this.Options[cd.Id_Tipo_Servicio] == undefined) {
            this.Options[cd.Id_Tipo_Servicio] = cd.Nombre;
          }
        });
      });
  }

  ValidarValorFactura(valor) {
    let Valor = parseFloat(valor);
    if (Valor <= 300000) {
      return true;
    } else {
      return false;
    }
  }

  confirmarAnulacion() {
    this.swalService
      .confirm(
        'Al anular esta dispensación estas bajo juramento ejecutando esta accion y tú te haces responsable de que todos los productos esten en perfecto estado y completos',
      )
      .then((result) => {
        // Verifica si el usuario confirmó la anulación
        if (result.isConfirmed) {
          // Llama a la función para suspender la dispensación
          this.SuspenderDispensacion();
        }
      });
  }

  borrarFechas() {
    if (this.range.get('start').value && this.range.get('end').value) {
      this.range.setValue({
        start: null,
        end: null,
      });
      this.selectedDate(null, null);
    }
  }

  openPages(route: string) {
    window.open(route, '_blank');
  }

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.ListarDispensaciones();
  }
}
