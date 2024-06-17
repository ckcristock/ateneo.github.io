import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BodeganuevoService } from '../services/bodeganuevo.service';
import { GrupoestibaService } from '../services/grupoestiba.service';
import { InventariofisicoService } from '../services/inventariofisico.service';
import { environment } from 'src/environments/environment';
import { ModalformComponent } from './modalform/modalform.component';
import { UserService } from 'src/app/core/services/user.service';
import { DatePipe, NgIf, NgFor, UpperCasePipe, NgClass } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { skipContentType } from 'src/app/http.context';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-inventario-fisico',
  templateUrl: './inventario-fisico.component.html',
  styleUrls: ['./inventario-fisico.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    DatePipe,
    UpperCasePipe,
    NgClass,
  ],
})
export class InventarioFisicoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
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
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  datePipe = new DatePipe('es-CO');
  public FiltrosTabla: any = {
    Fechas: '',
    Bodega: '',
    Grupo: '',
  };
  notActions!: boolean;
  public listaBodegas: any = [];
  public listaGrupoEstibas: any = [];
  public listaSubcategorias: any = [];
  public Inventarios_Terminados = [];
  public Documentos = [];

  public funcionario = JSON.parse(localStorage.getItem('User'));
  public miPerfil = JSON.parse(localStorage.getItem('miPerfil'));

  adjInvPag = {
    page: 1,
    pageSize: 100,
    length: 0,
  };

  initDocsPag = {
    page: 1,
    pageSize: 100,
    length: 0,
  };

  public company_id: any = '';

  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  iniciado: boolean;
  Cargando: boolean = false;
  Cargando2: boolean = false;

  actualizaSwal: any = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _user: UserService,
    private inventariofisico: InventariofisicoService,
    private modalService: NgbModal,
    private _bodega: BodeganuevoService,
    private _grupoEstiba: GrupoestibaService,
    private readonly swalService: SwalService,
  ) {
    this.company_id = this._user.user.person.company_worked.id;
  }

  ngOnInit() {
    this.getInitDocs();
    this.ConsultaFiltrada();
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
    //buscar las bodegas existentes
    // this._bodega.getBodegas().subscribe(res => {
    //   if (res.Tipo == 'success') this.listaBodegas = res.Bodegas
    // })
    this.http.get(environment.base_url + '/php/bodega_nuevo/get_bodegas.php').subscribe({
      next: (data: any) => {
        if (data.Tipo == 'success') this.listaBodegas = data.Bodegas;
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this.swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this.swalService.incompleteError(formattedErrorMessage);
        }
      },
    });

    //buscar las bodegas existentes
    // this._grupoEstiba.getGrupoEstibas().subscribe(res => {
    //   if (res.Tipo == 'success') this.listaGrupoEstibas = res.Grupo_Estibas
    // })
    this.http.get(environment.base_url + '/php/grupo_estiba/get_grupo_estibas.php').subscribe({
      next: (data: any) => {
        if (data.Tipo == 'success') this.listaGrupoEstibas = data.Grupo_Estibas;
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this.swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this.swalService.incompleteError(formattedErrorMessage);
        }
      },
    });
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Cargando2 = true;
    var params = this.SetFiltros();

    this.http
      .get(environment.base_url + '/php/inventariofisico/estiba/documentos_terminados.php', {
        params,
      })
      .subscribe({
        next: (res: any) => {
          this.Inventarios_Terminados = res.data.data;
          this.adjInvPag.length = res.data.total;
          this.Cargando2 = false;
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this.swalService.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this.swalService.incompleteError(formattedErrorMessage);
          }
        },
      });
  }

  SetFiltros() {
    let params: any = {};

    params.pageSize = this.adjInvPag.pageSize;

    params.page = this.adjInvPag.page;

    if (this.FiltrosTabla.Fechas != '' && this.FiltrosTabla.Fechas != null) {
      params.fechas = this.FiltrosTabla.Fechas;
    }

    if (this.FiltrosTabla.Bodega != '') {
      params.bodega = this.FiltrosTabla.Bodega;
    }

    if (this.FiltrosTabla.Grupo != '') {
      params.grupo = this.FiltrosTabla.Grupo;
    }
    return params;
  }
  getInitDocs() {
    this.Cargando = true;
    let params = {
      ...this.initDocsPag,
    };
    delete params.length;
    return this.http
      .get(environment.base_url + '/php/inventariofisico/estiba/documentos_iniciados.php', {
        params: params,
      })
      .subscribe({
        next: (res: any) => {
          this.Documentos = res.data.data;
          this.initDocsPag.length = res.data.total;
          this.Cargando = false;
        },
        // error: (error: HttpErrorResponse) => {
        //   let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        //   if (error.error.error) {
        //     errorMessage = error.error.error;
        //     this.swalService.hardError();
        //   } else if (error.error.errors) {
        //     let errorMessages: string[] = [];
        //     for (const field in error.error.errors) {
        //       errorMessages.push(error.error.errors[field]);
        //     }
        //     const formattedErrorMessage = errorMessages.join('<br/>');
        //     this.swalService.incompleteError(formattedErrorMessage);
        //   }
        // },
      });
  }
  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.FiltrosTabla.Fechas = event.formatted;
    } else {
      this.FiltrosTabla.Fechas = '';
    }
    this.ConsultaFiltrada();
  }

  selectedDate(start, end) {
    this.FiltrosTabla.Fechas =
      this.datePipe.transform(start, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(end, 'yyyy-MM-dd');
    this.ConsultaFiltrada();
  }

  date: { year: number; month: number };

  iniciar_inventario_fisico() {
    const modalRef = this.modalService.open(ModalformComponent);
  }

  onChangeState(text: string, documento): void {
    this.CambiarEstadoDocumento(`haciendo ${text} conteo`, documento);
  }

  AccionInventario(url_api, id_modelo, Id_Funcionario_Cuenta?, Id_Funcionario_Digita?) {
    this.router.navigate([url_api, id_modelo], {
      queryParams: { company_id: this.company_id },
    });
  }
  CambiarEstadoDocumento(estado, documento) {
    let estadoNuevo;
    if (estado == 'haciendo primer conteo') {
      estadoNuevo = 'pendiente primer conteo';
    } else if (estado == 'haciendo segundo conteo') {
      estadoNuevo = 'primer conteo';
    }

    let data = new FormData();
    data.append('estado', estadoNuevo);
    data.append('idDocumento', documento.Id_Doc_Inventario_Fisico);
    data.append('Tipo', documento.Tipo);
    this.http
      .post(
        environment.base_url + '/php/inventariofisico/estiba/cambiar_estados_documentos.php',
        data,
        {
          context: skipContentType(),
        },
      )
      .subscribe({
        next: (res: any) => {
          if (res.tipo == 'success') {
            this.actualizaSwal.title = res.title;
            this.actualizaSwal.html = res.mensaje;
            this.actualizaSwal.icon = res.tipo;
            this.swalService.success(res.mensaje);
            documento.Estado = estadoNuevo;
          }
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this.swalService.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this.swalService.incompleteError(formattedErrorMessage);
          }
        },
      });
  }

  initDocsPagination(pageObject: MatPaginator): void {
    this.initDocsPag.page = Number(pageObject.page) || 1;
    this.initDocsPag.pageSize = pageObject.pageSize || 100;
    this.getInitDocs();
  }

  checkCondition(documento: any) {
    const { Estado, Tipo } = documento; // Desestructuramos el objeto documento
    const estadoLowerCase = Estado.toLowerCase();
    const tipoLowerCase = Tipo.toLowerCase();
    let actions: boolean = this.notActions;
    actions =
      (estadoLowerCase == 'pendiente primer conteo' && tipoLowerCase == 'general') ||
      (estadoLowerCase == 'segundo conteo' && tipoLowerCase == 'general') ||
      (estadoLowerCase == 'primer conteo' && tipoLowerCase == 'general') ||
      (estadoLowerCase == 'haciendo primer conteo' && tipoLowerCase == 'general') ||
      (estadoLowerCase == 'haciendo segundo conteo' && tipoLowerCase == 'general');
    if (estadoLowerCase == 'pendiente primer conteo' && tipoLowerCase == 'general') {
    }
    if (actions) {
      return false;
    } else {
      return true;
    }
  }
}
