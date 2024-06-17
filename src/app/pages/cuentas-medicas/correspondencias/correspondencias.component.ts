import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { PuntodispensacionService } from '../services/puntodispensacion.service';
import { TiposervicioService } from '../services/tiposervicio.service';
import { DepartamentoService } from '../services/departamento.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';
import { ModalactaentregaComponent } from '../dispensaciones/modalactaentrega/modalactaentrega.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { HeaderComponent } from '@shared/components/standard-components/header/header.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

@Component({
  standalone: true,
  imports: [
    LoadImageComponent,
    ActionActivateComponent,
    ActionDeactivateComponent,
    ActionButtonComponent,
    DropdownActionsComponent,
    CardComponent,
    TableComponent,
    AddButtonComponent,
    NotDataSaComponent,
    ModalactaentregaComponent,
    CommonModule,
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
    ModalBasicComponent,
    MatPaginatorModule,
    HeaderComponent,
  ],
  providers: [PuntodispensacionService, TiposervicioService, DepartamentoService],
  selector: 'app-correspondencias',
  templateUrl: './correspondencias.component.html',
  styleUrls: ['./correspondencias.component.scss'],
})
export class CorrespondenciasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('PlantillaFoto') PlantillaFoto: TemplateRef<any>;
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('modalCorrespondenciaEditar') modalCorrespondenciaEditar: any;
  @ViewChild('modalCorrespondencia') modalCorrespondencia: any;
  public Cargando: boolean = false;
  public CargandoDispenEnv: boolean = false;

  public TotalItems: number;
  // public page = 1;
  // public maxSize = 10;
  // public pageSize = 20;
  timeout: any;
  user: any;
  public Punto_Envio: any;
  public Id_Funcionario_Envia: any;
  public Detalles: any = {};
  public Dispensaciones: any = {};
  public disabled: boolean = false;
  selected = [];
  public correspondencias: any = [];
  public environment: any;
  DisEnviadas: any = [];
  public filtro_fecha: any = '';
  public filtro_cod: string = '';
  public filtro_guia: string = '';
  public filtro_est: string = '';
  public filtro_disp: string = '';
  public listaPuntoDispensacion: Array<any>;
  public tiposServicios: any = [];
  public Departamentos: any = [];
  private isProgrammaticChange = false;
  public ReporteModel: any = {
    fecha: '',
    Punto_Dispensacion: '',
    Tipo_Servicio: '',
    Departamento: '',
    Estado: '',
  };
  rangeReportes = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  rangeFiltroFechasCorrespo = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  datePipe = new DatePipe('es-CO');
  length = 0;

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  public filtros: any = {
    disp: '',
    fecha: '',
    cod: '',
    guia: '',
    est: '',
  };
  activeFilters = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private puntoDispensacionService: PuntodispensacionService,
    private tipoServicioService: TiposervicioService,
    private departamentosService: DepartamentoService,
    private readonly userService: UserService,
    readonly UrlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit() {
    this.environment = environment;
    this.user = this.userService.user;
    this.Punto_Envio = 1; //quemado en 1 por ahora
    this.Id_Funcionario_Envia = this.user.Identificacion_Funcionario;
    this.getUrlFilters();
    this.ListaCorrespondencias();
    this.datesListeners();
    this.getListaPuntosDispensacion();
    this.getListaTiposServicios();
    this.getListaDepartamentos();
  }

  datesListeners() {
    this.rangeReportes.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end, this.ReporteModel);
      }
    });
    this.rangeFiltroFechasCorrespo.valueChanges.subscribe((r) => {
      if (r.start && r.end && !this.isProgrammaticChange) {
        this.selectedDate(r.start, r.end, this.filtros);
        this.ListaCorrespondencias();
      }
    });
  }

  DispensacionesEnviadas(id_correspondencia, estado) {
    this.CargandoDispenEnv = true;
    this.http
      .get(environment.ruta + 'php/correspondencia/lista_dispensaciones_enviadas.php', {
        params: { id: id_correspondencia, estado: estado },
      })
      .subscribe((data: any) => {
        this.DisEnviadas = data;
        this.CargandoDispenEnv = false;
      });
  }

  private getUrlFilters(): void {
    this.pagination = this.UrlFiltersService.currentPagination;
    this.filtros = this.UrlFiltersService.currentFilters;
  }

  ListaCorrespondencias() {
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

    // tomar fecha de url y asignarla al <mat-date-range />
    if (params.fecha) {
      let fechas = params.fecha.split('%20-%20');
      let fechas2 = fechas[0].split(' - ');

      const fechaInicio = new Date(fechas2[0].replaceAll('-', '/'));
      const fechaFin = new Date(fechas2[1].replaceAll('-', '/'));

      if (fechaInicio && fechaFin) {
        this.isProgrammaticChange = true;
        this.rangeFiltroFechasCorrespo.setValue(
          {
            start: fechaInicio,
            end: fechaFin,
          },
          { emitEvent: false },
        );
        this.isProgrammaticChange = false;
      }
    }

    this.http
      .get(environment.base_url + '/php/correspondencia/lista_correspondencia.php' + queryString)
      .subscribe((data: any) => {
        this.Cargando = false;
        this.correspondencias = data.Correspondencia;
        this.pagination.length = data.numReg;
      });
  }

  getListaPuntosDispensacion() {
    this.puntoDispensacionService.getPuntosDispensacion().subscribe((data: any) => {
      this.listaPuntoDispensacion = data;
    });
  }

  getListaTiposServicios() {
    this.tipoServicioService.getTiposAll().subscribe((data: any) => {
      this.tiposServicios = data.query_result;
    });
  }

  getListaDepartamentos() {
    this.departamentosService.getDepartamentos().subscribe((data: any) => {
      this.Departamentos = data.query_result;
    });
  }

  transformDate(start, end) {
    if (start && end) {
      return (
        this.datePipe.transform(start, 'yyyy-MM-dd') +
        ' - ' +
        this.datePipe.transform(end, 'yyyy-MM-dd')
      );
    } else {
      return '';
    }
  }

  selectedDate(start, end, targetModel: any) {
    targetModel.fecha = this.transformDate(start, end);
  }

  getQueryStringReporte() {
    let params: any = {};

    if (this.ReporteModel.fecha != '' && this.ReporteModel.fecha != null) {
      params.fechas = this.ReporteModel.fecha;
    }
    if (this.ReporteModel.Punto_Dispensacion != '') {
      params.punto = this.ReporteModel.Punto_Dispensacion;
    }
    if (this.ReporteModel.Tipo_Servicio != '') {
      params.tipo_servicio = this.ReporteModel.Tipo_Servicio;
    }
    if (this.ReporteModel.Departamento != '') {
      params.departamento = this.ReporteModel.Departamento;
    }
    if (this.ReporteModel.Estado != '') {
      params.estado = this.ReporteModel.Estado;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    return queryString;
  }

  downloadReporte() {
    let queryString = this.getQueryStringReporte();

    window.open(
      environment.ruta + 'php/correspondencia/descargar_reporte.php' + queryString,
      '_blank',
    );
  }

  borrarFechas(range, targetModel, loadCorresp?: boolean) {
    if (range.get('start').value && range.get('end').value) {
      range.setValue({
        start: null,
        end: null,
      });
      this.selectedDate(null, null, targetModel);
      if (loadCorresp) {
        this.ListaCorrespondencias();
      }
    }
  }

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.ListaCorrespondencias();
  }
}
