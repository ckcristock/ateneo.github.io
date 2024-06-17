import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { Location, NgClass } from '@angular/common';
import { PuntodispensacionService } from '../services/puntosdispensacion/puntodispensacion.service';
import { environment } from 'src/environments/environment';
import { SwalService } from '../services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { AutocompleteMdlComponent } from 'src/app/components/autocomplete-mdl/autocomplete-mdl.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import {
  DepartmentMunicipalityComponent,
  MunDep,
} from '@shared/components/department-municipality/department-municipality.component';
import { ServiceTypesService } from '../../tipos/tiposervicios/service-types.service';

@Component({
  selector: 'app-puntodispensacion',
  templateUrl: './puntodispensacion.component.html',
  styleUrls: ['./puntodispensacion.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    ModalComponent,
    MatInputModule,
    AutocompleteMdlComponent,
    NgSelectModule,
    NgClass,
    StatusBadgeComponent,
    DepartmentMunicipalityComponent,
  ],
})
export class PuntodispensacionComponent implements OnInit {
  public puntodispensacion: any = [];

  confirmacionSwal: any;
  @ViewChild('modalPuntoDispensacionEditar') modalPuntoDispensacionEditar: any;
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  PuntoDispensacion: any = [];
  public Control: boolean = false;

  //Variables para filtros
  public filtro_punto_dispensacion: any = '';
  public filtro_departamento: any = '';
  public filtro_tipo_dispensacion: any = '';
  public filtro_direccion: any = '';
  public filtro_telefono: any = '';
  public filtro_no_pos: any = '';
  public filtro_turnero: any = '';
  public filtro_wacom: any = '';
  public filtro_entrega: any = '';
  public filtro_tipo_entrega: any = '';

  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  //Variables nuevas para servicio y tipo de servicio
  public Servicios: Array<any> = [];
  public TipoServicios: Array<any> = [];

  public ServiciosEscogidos: Array<any> = [];
  public TipoServiciosEscogidos: Array<any> = [];
  public Bodegas: Array<any> = [];

  pagination = {
    pageSize: 25,
    page: 1,
    length: 0,
  };

  constructor(
    private http: HttpClient,
    private location: Location,
    private _swalService: SwalService,
    private puntoDispesancionService: PuntodispensacionService,
    private _modal: ModalService,
    private serviceTypeService: ServiceTypesService,
  ) {
    this.GetServicioNgSelect();
  }
  public IdPuntoDispensacion: any = '';

  rowsFilter = [];
  tempFilter = [];
  columns = [];
  loadingIndicator: boolean;
  timeout: any;
  serviceTypes: any[] = [];
  munDepValue!: MunDep;

  ngOnInit() {
    this.getBodegasDespacho();
    this.getPoints();
    this.columns = [
      //#	Código	Nombre
      { prop: 'Nombre' },
      { prop: 'NombreDepartamento' },
      { prop: 'Tipo' },
      { prop: 'Direccion' },
      { prop: 'Telefono' },
      { prop: 'No_Pos', name: 'No Pos' },
      { prop: 'Turnero' },
      { prop: 'Wacom' },
      {
        cellTemplate: this.PlantillaBotones,
        prop: 'Id_Punto_Dispensacion',
        name: 'Acciones',
        sortable: false,
        maxWidth: '100',
      },
    ];
  }

  openModal(content) {
    this._modal.open(content, 'lg');
    this.getServiceTypes();
  }

  getServiceTypes() {
    this.serviceTypeService.getServiceTypes().subscribe((res: any) => {
      this.serviceTypes = res.data;
    });
  }

  changeMundep(values: MunDep): void {
    this.munDepValue = values;
  }

  getPoints() {
    this.loadingIndicator = true;
    this.http
      .get(environment.ruta + 'php/puntodispensacion/detalle_punto_dispensacion.php')
      .subscribe((data: any) => {
        this.puntodispensacion = data.query_result;
        this.loadingIndicator = false;
        this.pagination.length = data.numReg;
      });
  }

  GetTipoServicioNgSelect() {
    if (this.ServiciosEscogidos.length > 0) {
      let ids = JSON.stringify(this.ServiciosEscogidos);

      let p = { id_servicio: ids };
      this.http
        .get(environment.ruta + 'php/GENERALES/tiposervicio/get_tipos_servicio_ng_select.php', {
          params: p,
        })
        .subscribe((data: any) => {
          // if (data.codigo == 'success') {
          this.TipoServicios = data.map((typeSer) => ({ text: typeSer.label, ...typeSer }));
          //   } else {
          //  this.TipoServicios = [];
          //  }
        });
    } else {
      this.TipoServicios = [];
    }
  }

  GetServicioNgSelect() {
    this.http
      .get(environment.ruta + 'php/servicio/servicios_ng_select.php')
      .subscribe((data: any) => {
        this.Servicios = data.map((service) => ({ text: service.label, ...service }));
      });
  }

  changeTipo(tipo) {
    if (tipo == 'Radicacion') {
      this.Control = true;
    } else {
      this.Control = false;
    }
  }
  GuardarPuntoDispensacionNuevo(formulario: NgForm, modal) {
    const request = () => {
      if (!this._validateBeforeSubmit()) {
        return;
      } else {
        let info = JSON.stringify(formulario.value);
        info['Municipio'] = this.munDepValue.municipality_id;
        info['Departamento'] = this.munDepValue.department_id;
        let servicios = JSON.stringify(this.ServiciosEscogidos);
        let tipos_servicios = JSON.stringify(this.TipoServiciosEscogidos);
        let datos = new FormData();
        datos.append('modulo', 'Punto_Dispensacion');
        datos.append('servicios', servicios);
        datos.append('tipos_servicio', tipos_servicios);
        datos.append('modelo', info);
        this.http
          .post(environment.ruta + 'php/genericos/guardar_generico.php', datos)
          .subscribe((data: any) => {
            if (data.type == 'success') {
              this.confirmacionSwal.title = data.title;
              this.confirmacionSwal.html = data.mensaje;
              this.confirmacionSwal.icon = data.type;
              this._swalService.show(this.confirmacionSwal);
              formulario.reset();
              modal.hide();
              this.LimpiarModelo();
              this.filtros();
            } else {
              this.confirmacionSwal.title = 'Oops!';
              this.confirmacionSwal.html = data.mensaje;
              this.confirmacionSwal.icon = data.tipe;
              this._swalService.show(this.confirmacionSwal);
            }
          });
      }
    };
    this._swalService.swalLoading('Se dispone a guardar este punto de dispensación', request);
  }

  EdicionPuntoDispensacion(formulario: NgForm, modal) {
    const request = (resolve) => {
      if (formulario.invalid) {
        this._swalService.incompleteError();
        return;
      } else {
        let info = JSON.stringify(formulario.value);
        let servicios = JSON.stringify(this.ServiciosEscogidos);
        let tipos_servicios = JSON.stringify(this.TipoServiciosEscogidos);
        let datos = new FormData();
        datos.append('modulo', 'Punto_Dispensacion');
        datos.append('servicios', servicios);
        datos.append('tipos_servicio', tipos_servicios);
        datos.append('modelo', info);
        this.puntoDispesancionService.EdicionPuntosDispensacion(datos).subscribe((data: any) => {
          if (data.codigo == 'success') {
            modal.hide();
            setTimeout(() => {
              this.filtros(this.pagination.page > 1);
            }, 1000);
          } else {
            this._swalService.ShowMessage(data);
          }
          resolve(true);
        });
      }
    };
    this._swalService.swalLoading('Se dispone a guardar este punto de dispensación', request);
  }

  EditarPuntoDispensacionNuevo(id, edit) {
    this.http
      .get(environment.ruta + 'php/puntodispensacion/get_detalle_punto_dispensacion.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        //this.puntoDispesancionService.GetDetallePuntoDispensacion(id).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.IdPuntoDispensacion = id;
          this.PuntoDispensacion = data.query_result;
          this.ServiciosEscogidos = data.servicios;
          this.TipoServiciosEscogidos = data.tipos_servicio;

          setTimeout(() => {
            this.GetTipoServicioNgSelect();
          }, 300);

          this._modal.open(edit, 'lg');
        } else {
          this._swalService.ShowMessage(data);
        }
      });
  }

  EliminarPuntoDispensacion(id, estado) {
    let datos = new FormData();
    datos.append('modulo', 'Punto_Dispensacion');
    datos.append('estado', estado);
    datos.append('id', id);
    const text = 'El punto de aplicación';
    const request = () => {
      this.http
        .post(environment.ruta + 'php/genericos/eliminar_generico.php', datos)
        .subscribe((res) => {
          this.limpiarFiltros();
          this.filtros();
          this.getPoints();
          this._swalService.activateOrInactivateSwalResponse(estado, text);
        });
    };
    this._swalService.activateOrInactivateSwal(estado, text, request);
  }

  actualiza_filtro(txt, col, tipo) {
    const val = txt.target.value.toLowerCase();
    const temp = this.tempFilter.filter(function (d) {
      if (tipo === '=') {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === '!=') {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
    // this.table.offset = 0;
  }

  //Setear filtros
  SetFiltros(paginacion: boolean = false) {
    let params: any = {};

    if (paginacion === true) {
      params.pag = this.pagination.page;
    } else {
      this.pagination.page = 1;
      params.pag = this.pagination.page;
    }

    if (this.filtro_punto_dispensacion != '') {
      params.nombre_punto_dispensacion = this.filtro_punto_dispensacion;
    }
    if (this.filtro_departamento != '') {
      params.id_departamento = this.filtro_departamento;
    }
    if (this.filtro_tipo_dispensacion != '') {
      params.tipo_dispensacion = this.filtro_tipo_dispensacion;
    }
    if (this.filtro_direccion != '') {
      params.direccion = this.filtro_direccion;
    }
    if (this.filtro_telefono != '') {
      params.telefono = this.filtro_telefono;
    }
    if (this.filtro_no_pos != '') {
      params.no_pos = this.filtro_no_pos;
    }
    if (this.filtro_turnero != '') {
      params.turnero = this.filtro_turnero;
    }
    if (this.filtro_wacom != '') {
      params.wacom = this.filtro_wacom;
    }
    if (this.filtro_entrega != '') {
      params.entrega = this.filtro_entrega;
    }
    if (this.filtro_tipo_entrega != '') {
      params.tipo_entrega = this.filtro_tipo_entrega;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    return queryString;
  }

  //Aplicar filtros en la tabla
  filtros(paginacion: boolean = false) {
    this.loadingIndicator = true;
    var params = this.SetFiltros(paginacion);
    this.location.replaceState('/base/puntosdispensacion', params);
    this.http
      .get(environment.ruta + 'php/puntodispensacion/detalle_punto_dispensacion.php' + params)
      .subscribe((data: any) => {
        this.puntodispensacion = data.query_result;
        this.loadingIndicator = false;
        this.pagination.length = data.numReg;
        this.SetInformacionPaginacion();
      });
  }

  //Limpia los inputs de filtros en la cabecera de la tabla
  limpiarFiltros() {
    this.filtro_departamento = '';
    this.filtro_direccion = '';
    this.filtro_no_pos = '';
    this.filtro_punto_dispensacion = '';
    this.filtro_telefono = '';
    this.filtro_tipo_dispensacion = '';
    this.filtro_turnero = '';
    this.filtro_wacom = '';
    this.filtro_tipo_entrega = '';
  }

  LimpiarVariablesEditar() {
    this.PuntoDispensacion = [];
    this.IdPuntoDispensacion = '';
    this.LimpiarModelo();
  }

  SetInformacionPaginacion() {
    var calculoHasta = this.pagination.page * this.pagination.pageSize;
    var desde = calculoHasta - this.pagination.pageSize + 1;
    var hasta = calculoHasta > this.pagination.length ? this.pagination.length : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.pagination.length;
  }

  private _validateBeforeSubmit(): boolean {
    if (this.ServiciosEscogidos.length == 0) {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe escoger uno o mas servicios para este punto!',
      ]);
      return false;
    } else if (this.ServiciosEscogidos.length == 0) {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe escoger uno o mas tipos de servicio para este punto!',
      ]);
      return false;
    } else {
      return true;
    }
  }

  public LimpiarModelo() {
    this.ServiciosEscogidos = [];
    this.TipoServiciosEscogidos = [];
    this.TipoServicios = [];
  }

  getBodegasDespacho() {
    this.http.get(environment.ruta + 'php/despacho/get_bodegas.php').subscribe((data: any) => {
      this.Bodegas = data.data.map((winery) => ({ text: winery.label, ...winery }));
      this.pagination.length = data.data.total;
      this.SetInformacionPaginacion();
    });
  }
}
