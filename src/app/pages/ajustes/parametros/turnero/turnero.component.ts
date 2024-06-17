import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ServicioService } from '@shared/services/sigespro/servicio.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { mapAutocomplete } from '@shared/functions/set-data-autocomplete';
import { SwalService } from '../../informacion-base/services/swal.service';
import { SearchSelectComponent } from '../../../../shared/components/search-select/search-select.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { AutocompleteMdlComponent } from '../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-turnero',
  templateUrl: './turnero.component.html',
  styleUrls: ['./turnero.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionActivateComponent,
    ActionDeactivateComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    AutocompleteMdlComponent,
    ModalComponent,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    SearchSelectComponent,
  ],
})
export class TurneroComponent implements OnInit {
  public servicios: any[];
  @ViewChild('modalNuevoTurnero') modalNuevoTurnero: any;
  @ViewChild('modalEditarTurnero') modalEditarTurnero: any;

  public PuntosSeleccionados = [];
  public Servicios: Array<any> = [];
  public ServiciosEscogidos: Array<any> = [];
  public Puntos: any[] = [];
  public Turneros: any[] = [];
  public Cargando: boolean = true;

  public Lista_Servicios: any = [];

  public ModelEditar: any = {
    Nombre: '',
    Capita: '',
    No_Pos: '',
    Direccion: '',
  };
  fecha_informe: any = '';

  turnero: any = '';

  public Filtros: any = {
    Nombre: '',
  };

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  globales = environment;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null, [Validators.required]),
    end: new FormControl<Date | string | null>(null, [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private _serviciosService: ServicioService,
    private readonly modalService: NgbModal,
    private readonly swalService: SwalService,
  ) {
    this._getServicioNgSelect();
    this.ConsultaFiltrada();
  }

  ngOnInit() {
    this.http
      .get(this.globales.ruta + 'php/funcionarios/puntos_funcionario.php')
      .subscribe((data: any) => {
        this.Puntos = mapAutocomplete(data, 'label', 'value');
      });

    this.http.get(this.globales.ruta + 'php/turneros/get_turneros.php').subscribe((data: any) => {
      this.Turneros = mapAutocomplete(data.query_result, 'label', 'value');
    });
  }

  openAddTurner(modal: TemplateRef<any>): void {
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }
  GuardarTurnero(formulario: NgForm) {
    // console.log(this.PuntosSeleccionados);

    let info = JSON.stringify(formulario.value);
    let punto = JSON.stringify(this.PuntosSeleccionados);
    let servicios = JSON.stringify(this.ServiciosEscogidos);
    let datos = new FormData();
    datos.append('datos', info);
    datos.append('puntos', punto);
    datos.append('servicios', servicios);
    // modal.hide();
    this.http
      .post(this.globales.ruta + 'php/configuracion/guardar_turnero.php', datos)
      .subscribe((data: any) => {
        this.swalService.show({
          icon: 'success',
          title: '¡Creado con éxito!',
          text: data.mensaje,
          showCancel: false,
          timer: 3000,
        });
        this.modalService.dismissAll();
        this.ConsultaFiltrada();
      });
  }

  EditarTurnero() {
    // console.log(this.PuntosSeleccionados);

    let info = JSON.stringify(this.ModelEditar);
    let punto = JSON.stringify(this.PuntosSeleccionados);
    let servicios = JSON.stringify(this.ServiciosEscogidos);
    let datos = new FormData();
    datos.append('datos', info);
    datos.append('puntos', punto);
    datos.append('servicios', servicios);
    // modal.hide();
    this.http
      .post(this.globales.ruta + 'php/configuracion/editar_turnero.php', datos)
      .subscribe((data: any) => {
        this.swalService.show({
          icon: 'success',
          title: '¡Editado con éxito!',
          text: data.mensaje,
          showCancel: false,
          timer: 3000,
        });
        this.modalService.dismissAll();
        this.ConsultaFiltrada();
        // this.resetModel();
        // this.PuntosSeleccionados = [];
      });
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.fecha_informe = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
  }

  getDetalleTurnero(id_turnero, modalEditTurnero: TemplateRef<any>) {
    this.modalService.open(modalEditTurnero, { size: 'lg' });
    this.http
      .get(this.globales.ruta + 'php/configuracion/detalle_turnero.php', {
        params: { id: id_turnero },
      })
      .subscribe((data: any) => {
        this.ModelEditar = data.turneros;
        this.PuntosSeleccionados = data.puntos;
        this.ServiciosEscogidos = data.servicios;
      });
  }

  onRemoveTurner(id: number): void {
    this.swalService
      .confirm('Se dispone a eliminar este turnero, esta acción no se puede revertir.')
      .then((res) => {
        if (res.isConfirmed) this.EliminarTurnero(id);
      });
  }

  EliminarTurnero(id) {
    let info = id;
    let datos = new FormData();
    datos.append('id_turneros', info);
    this.http
      .post(this.globales.ruta + 'php/configuracion/eliminar_turnero.php', datos)
      .subscribe((data: any) => {
        this.swalService.show({
          icon: 'success',
          title: '¡Eliminado con éxito!',
          text: data.mensaje,
          showCancel: false,
          timer: 3000,
        });
        this.ConsultaFiltrada();
      });
  }
  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pagination.pageSize;

    if (paginacion === true) {
      params.pag = this.pagination.page;
    } else {
      params.pag = this.pagination.page;
    }
    if (this.Filtros.Nombre.trim() != '') {
      params.nom = this.Filtros.Nombre;
    }

    return params;
  }

  SetFiltrosReporte() {
    let params: any = {};

    if (this.fecha_informe.trim() != '') {
      params.fechas = this.fecha_informe;
    }

    if (this.turnero.trim() != '') {
      params.id_turneros = this.turnero;
    }

    return params;
  }

  onPagination(): void {
    this.ConsultaFiltrada(true);
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    var params = this.SetFiltros(paginacion);

    this.Cargando = true;
    this.http
      .get(this.globales.ruta + 'php/configuracion/lista_turnero.php', { params: params })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Lista_Servicios = data.query_result;
          this.pagination.length = data.numReg;
        } else {
          this.Lista_Servicios = [];
        }

        this.Cargando = false;
      });
  }
  public DescargarReporte() {
    let p = this.SetFiltrosReporte();
    let queryString = Object.keys(p)
      .map((key) => key + '=' + p[key])
      .join('&');

    window.open(
      this.globales.ruta + 'php/reportes/reporte_atencion_turnero.php?' + queryString,
      '_blank',
    );
  }

  private _getServicioNgSelect() {
    this._serviciosService.getServiciosNgSelect().subscribe((data: any) => {
      this.Servicios = mapAutocomplete(data, 'label', 'value');
    });
  }
}
