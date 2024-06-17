import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Globales } from "@shared/globales/globales";
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
// import { IMyDrpOptions } from "mydaterangepicker";
import { TiposervicioService } from './tiposervicio.service';
import { DepartamentoService } from '../services/departamento.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// import { G } from '@fullcalendar/core/internal-common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalactaentregaComponent } from 'src/app/pages/cuentas-medicas/dispensaciones/modalactaentrega/modalactaentrega.component';
import { TablafacturacionComponent } from './tablafacturacion/tablafacturacion.component';
import { DatePipe } from '@angular/common';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { skipContentType } from 'src/app/http.context';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { DataSheetComponent } from '@shared/components/data-sheet/data-sheet.component';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';

@Component({
  standalone: true,
  imports: [
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
    TablafacturacionComponent,
    RouterModule,
    NgbPaginationModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    CardComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    ActionViewComponent,
    DataSheetComponent,
    ModalBasicComponent,
  ],
  providers: [TiposervicioService, DepartamentoService],
  selector: 'app-cmfacturacion',
  templateUrl: './cmfacturacion.component.html',
  styleUrls: ['./cmfacturacion.component.scss'],
})
export class CmfacturacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('PlantillaEstadoFacturacion')
  PlantillaEstadoFacturacion: TemplateRef<any>;
  @ViewChild('PlantillaEstadoAuditoria')
  PlantillaEstadoAuditoria: TemplateRef<any>;
  @ViewChild('PlantillaTipo') PlantillaTipo: TemplateRef<any>;
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaEstadoFacturacion')
  PlantillaEstadoFacturacion1: TemplateRef<any>;
  @ViewChild('PlantillaBotones1') PlantillaBotones1: TemplateRef<any>;
  @ViewChild('modalAsignarFacturador') modalAsignarFacturador: any;
  @ViewChild('modalAsignarFacturadorTodos') modalAsignarFacturadorTodos: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  rowsFilter = [];
  tempFilter = [];
  columns = [];

  rowsFilter1 = [];
  tempFilter1 = [];
  columns1 = [];
  selected = [];

  loadingIndicator = true;
  timeout: any;
  public Cargando = false;
  public auditores: any[] = [];
  public filtro_cod: string = '';
  public filtro_cliente: string = '';
  public filtro_tipo: string = '';
  public filtro_fecha: any = '';
  public depar: any = '';
  public filtro_facturador: string = '';
  public filtro_estado: string = '';
  public environment: any;
  // myDateRangePickerOptions: IMyDrpOptions = {
  //   width: "120px",
  //   height: "21px",
  //   selectBeginDateTxt: "Inicio",
  //   selectEndDateTxt: "Fin",
  //   selectionTxtFontSize: "10px",
  //   dateFormat: "yyyy-mm-dd",
  // };
  // myDateRangePickerOptions1: IMyDrpOptions = {
  //   width: "180px",
  //   height: "21px",
  //   selectBeginDateTxt: "Inicio",
  //   selectEndDateTxt: "Fin",
  //   selectionTxtFontSize: "10px",
  //   dateFormat: "yyyy-mm-dd",
  // };
  public filtro_cod_fact: string = '';
  public filtro_fecha_fact: any = '';
  public filtro_estado_fact: string = '';
  public Facturas: any = [];

  data_torta = {
    labels: ['Pendientes', 'Facturadas'],
    datasets: [
      {
        data: [45, 55],
        backgroundColor: ['#25A6F7', '#FB9A7D'],
        hoverBackgroundColor: ['#6cc4fb', '#ffb59f'],
      },
    ],
  };

  IdDispensacion: any;
  public Departamentos: Array<any> = [];

  Facturador_Asignado: any;
  idFacturador: any;
  seleccionados: number;
  facturador: string;
  indicadores: any = {};
  Dispensaciones: any = [];
  checked: boolean = false;
  Productos: any = [];
  public Servicios: Array<any> = [];

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  public TotalItems1: number;
  public page1 = 1;
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  datePipe = new DatePipe('es-CO');

  constructor(
    private departamentoService: DepartamentoService,
    private http: HttpClient,
    // public globales: Globales,
    private route: ActivatedRoute,
    private location: Location,
    private ruta: Router,
    private _tipoServicioService: TiposervicioService,
    private swalService: SwalService,
  ) {
    this.ListarDispensacionesAuditoria();

    // this.ListarDetallesFacturacion();
    this.GetDepartamentos();
  }

  ngOnInit() {
    this._getServiciosTipoServicio();
    this.http
      .get(environment.ruta + 'php/auditorias/lista_auditores.php')
      .subscribe((data: any) => {
        this.auditores = data.auditoria;
        this.indicadores = data.indicadores;
      });
    this.environment = environment;
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  GetDepartamentos() {
    this.departamentoService.getDepartamentos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Departamentos = data.query_result;
      } else {
        this.Departamentos = [];
      }
    });
  }

  private setCheckedItem(value?: boolean) {
    if (!value) this.selected = [];
    this.Dispensaciones.forEach((data) => {
      data['checked'] = value ?? false;
      if (value) this.selected.push(data.Id_Dispensacion);
    });
    this.seleccionados = this.selected.length;
  }

  ListarDispensacionesAuditoria() {
    this.Cargando = true;
    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_cliente = params.cliente ? params.cliente : '';
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_tipo = params.tipo ? params.tipo : '';
      this.filtro_facturador = params.facturador ? params.facturador : '';
      this.filtro_estado = params.estado ? params.estado : '';

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }

    this.http
      .get(environment.ruta + 'php/dispensaciones/lista_dispensaciones_auditoria.php' + queryString)
      .subscribe((data: any) => {
        this.Dispensaciones = data.dispensaciones;
        this.setCheckedItem();
        this.pagination.length = data.numReg;
        this.Cargando = false;
      });
  }

  private _getServiciosTipoServicio() {
    this._tipoServicioService.GetServiciosTipoServicio().subscribe((data: Array<any>) => {
      if (data.length > 0) {
        data.forEach((s) => {
          if (!s.Nombre.includes('CAPITA')) {
            this.Servicios.push(s);
          }
        });
      }
      //this.Servicios = data;
    });
  }

  onSelectAll(value) {
    this.setCheckedItem(value);
  }

  onSelect(selected) {
    let Id_Dispensacion: any = selected.target.value;

    let exist = this.selected.indexOf(Id_Dispensacion); // Ubicar elemento en el array

    if (exist == -1) {
      // Si no existe agrego el elemento en el array
      this.selected.push(Id_Dispensacion);
    } else {
      // Pero si existe, lo elimino porque quiere decir que lo deseleccionó.
      this.selected.splice(exist, 1);
    }
    // this.selected.push(Id_Dispensacion);
    this.seleccionados = this.selected.length;
  }

  paginacion() {
    let params: any = {
      pag: this.pagination.page,
    };
    this.LimpiarFiltros('facturacion');
    this.Cargando = true;

    if (this.filtro_cod != '') {
      params.cod = this.filtro_cod;
    }
    if (this.depar != '') {
      params.depar = this.depar;
    }
    if (this.filtro_cliente != '') {
      params.cliente = this.filtro_cliente;
    }
    if (this.filtro_cliente != '') {
      params.cliente = this.filtro_cliente;
    }
    if (this.filtro_fecha != '' && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha;
    }
    if (this.filtro_tipo != '') {
      params.tipo = this.filtro_tipo;
    }
    if (this.filtro_facturador != '') {
      params.facturador = this.filtro_facturador;
    }
    if (this.filtro_estado != '') {
      params.estado = this.filtro_estado;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/cmfacturacion', queryString);

    this.http
      .get(
        environment.ruta + 'php/dispensaciones/lista_dispensaciones_auditoria.php?' + queryString,
      )
      .subscribe((data: any) => {
        this.Dispensaciones = data.dispensaciones;
        this.setCheckedItem();
        this.pagination.length = data.numReg;
        this.Cargando = false;
      });
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = '';
    }

    this.filtros();
  }

  selectedDate(start, end) {
    if (start && end) {
      this.filtro_fecha =
        this.datePipe.transform(start, 'yyyy-MM-dd') +
        ' - ' +
        this.datePipe.transform(end, 'yyyy-MM-dd');
    } else this.filtro_fecha = '';
    this.filtros();
  }

  filtros() {
    let params: any = {};
    this.LimpiarFiltros('facturacion');
    this.Cargando = true;
    if (
      this.filtro_cod != '' ||
      this.filtro_fecha != '' ||
      this.filtro_tipo != '' ||
      this.filtro_facturador != '' ||
      this.filtro_estado != '' ||
      this.filtro_cliente != ''
    ) {
      params.pag = this.pagination.page;

      if (this.filtro_cod != '') {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_cliente != '') {
        params.cliente = this.filtro_cliente;
      }
      if (this.filtro_cliente != '') {
        params.cliente = this.filtro_cliente;
      }
      if (this.filtro_fecha != '' && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha;
      }
      if (this.depar != '' && this.depar != null) {
        params.depar = this.depar;
      }
      if (this.filtro_tipo != '') {
        params.tipo = this.filtro_tipo;
      }
      if (this.filtro_facturador != '') {
        params.facturador = this.filtro_facturador;
      }
      if (this.filtro_estado != '') {
        params.estado = this.filtro_estado;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/cmfacturacion', queryString);

      this.http
        .get(
          environment.ruta + 'php/dispensaciones/lista_dispensaciones_auditoria.php?' + queryString,
        )
        .subscribe((data: any) => {
          this.Dispensaciones = data.dispensaciones;
          this.setCheckedItem();
          this.pagination.length = data.numReg;
          this.Cargando = false;
        });
    } else {
      this.location.replaceState('/cmfacturacion', '');

      this.filtro_fecha = '';
      this.filtro_cod = '';
      this.filtro_cliente = '';

      this.filtro_tipo = '';
      this.filtro_facturador = '';
      this.filtro_estado = '';

      this.http
        .get(environment.ruta + 'php/dispensaciones/lista_dispensaciones_auditoria.php')
        .subscribe((data: any) => {
          this.Dispensaciones = data.dispensaciones;
          this.setCheckedItem();
          this.pagination.length = data.numReg;
          this.Cargando = false;
        });
    }
  }

  ListarDetallesFacturacion() {
    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page1 = params.pag ? params.pag : 1;
      this.filtro_cod_fact = params.cod_fact ? params.cod_fact : '';
      this.filtro_fecha_fact = params.fecha_fact ? params.fecha_fact : '';
      this.filtro_estado_fact = params.estado_fact ? params.estado_fact : '';

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }

    this.http
      .get(environment.ruta + '/php/facturasventas/detalle_factura.php' + queryString)
      .subscribe((data: any) => {
        this.Productos = data.productos;
        this.TotalItems1 = data.numReg;
      });
  }

  paginacion1() {
    let params: any = {
      pag: this.page1,
    };
    this.LimpiarFiltros('dispensacion');

    if (this.filtro_cod_fact != '') {
      params.cod_fact = this.filtro_cod_fact;
    }
    if (this.filtro_fecha_fact != '' && this.filtro_fecha_fact != null) {
      params.fecha_fact = this.filtro_fecha_fact.formatted;
    }
    if (this.filtro_estado_fact != '') {
      params.estado_fact = this.filtro_estado_fact;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/cmfacturacion', queryString);

    this.http
      .get(environment.ruta + '/php/facturasventas/detalle_factura.php?' + queryString)
      .subscribe((data: any) => {
        this.Productos = data.productos;
        this.TotalItems1 = data.numReg;
      });
  }

  dateRangeChanged1(event) {
    if (event.formatted != '') {
      this.filtro_fecha_fact = event;
    } else {
      this.filtro_fecha_fact = '';
    }

    this.filtros1();
  }

  filtros1() {
    let params: any = {};
    this.LimpiarFiltros('dispensacion');

    if (
      this.filtro_cod_fact != '' ||
      this.filtro_fecha_fact != '' ||
      this.filtro_estado_fact != ''
    ) {
      this.page1 = 1;
      params.pag = this.page1;

      if (this.filtro_cod_fact != '') {
        params.cod_fact = this.filtro_cod_fact;
      }
      if (this.filtro_fecha_fact != '' && this.filtro_fecha_fact != null) {
        params.fecha_fact = this.filtro_fecha_fact.formatted;
      }
      if (this.filtro_estado_fact != '') {
        params.estado_fact = this.filtro_estado_fact;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/cmfacturacion', queryString);

      this.http
        .get(environment.ruta + '/php/facturasventas/detalle_factura.php?' + queryString)
        .subscribe((data: any) => {
          this.Productos = data.productos;
          this.TotalItems1 = data.numReg;
        });
    } else {
      this.location.replaceState('/cmfacturacion', '');

      this.page1 = 1;
      this.filtro_fecha_fact = '';
      this.filtro_cod_fact = '';
      this.filtro_estado_fact = '';

      this.http
        .get(environment.ruta + '/php/facturasventas/detalle_factura.php')
        .subscribe((data: any) => {
          this.Productos = data.productos;
          this.TotalItems1 = data.numReg;
        });
    }
  }

  LimpiarFiltros(tabla) {
    this.location.replaceState('/cmfacturacion', '');

    if (tabla == 'dispensacion') {
      this.filtro_fecha = '';
      this.filtro_cod = '';
      this.filtro_cliente = '';
      this.filtro_tipo = '';
      this.filtro_facturador = '';
      this.filtro_estado = '';
    } else {
      this.page1 = 1;
      this.filtro_fecha_fact = '';
      this.filtro_cod_fact = '';
      this.filtro_estado_fact = '';
    }
  }

  onPage(event) {
    clearTimeout(this.timeout);
  }

  EditarDispensacion(id) {
    this.http
      .get(environment.ruta + 'php/genericos/detalle.php', {
        params: { modulo: 'Dispensacion', id: id },
      })
      .subscribe((data: any) => {
        this.IdDispensacion = id;
        this.Facturador_Asignado = data.Nombre;
        this.idFacturador = data.Facturador_Asignado;
        this.modalAsignarFacturador.show();
      });
  }

  ValidarCantidadEntregada(pos) {
    let dispensacion = this.Dispensaciones[pos];
    if (dispensacion['Pendientes'] != '0') {
      this.swalService
        .confirm(
          'La dispensacion tiene pendientes de entrega, Se creará una nueva dispensacion con los productos pendientes',
        )
        .then((result) => {
          if (result.isConfirmed) {
            let data = new FormData();
            data.append('id', dispensacion.Id_Dispensacion);
            this.http
              .post(environment.ruta + 'php/dispensaciones/crear_dis_pendientes.php', data, {
                context: skipContentType(),
              })
              .subscribe((data: any) => {
                this.ruta.navigate(['/facturacrear', dispensacion.Id_Dispensacion]);
                swal.close();
              });
          }
        });
    } else {
      this.ruta.navigate(['/facturacrear', dispensacion.Id_Dispensacion]);
    }
  }

  AsignarFuncionarios() {
    this.modalAsignarFacturadorTodos.show();
  }

  AsignarFacturador(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();

    datos.append('modulo', 'Dispensacion');
    datos.append('datos', info);
    modal.hide();
    this.http
      .post(environment.ruta + 'php/facturasventas/asignar_facturador.php', datos, {
        context: skipContentType(),
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.confirmacionSwal.title = data.title;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.type = data.tipo;
        this.confirmacionSwal.show();
      });
    this.IdDispensacion = '';
    this.http
      .get(environment.ruta + 'php/auditorias/lista_auditores.php')
      .subscribe((data: any) => {
        this.auditores = data.auditoria;
        this.indicadores = data.indicadores;
      });

    this.ListarDispensacionesAuditoria();
  }

  guardarAsignaciones(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let dispensaciones = JSON.stringify(this.selected);
    let datos = new FormData();

    datos.append('modulo', 'Dispensacion');
    datos.append('datos', info);
    datos.append('dispensaciones', dispensaciones);
    modal.hide();
    this.http
      .post(environment.ruta + '/php/facturasventas/guardar_factura_dispensacion.php', datos, {
        context: skipContentType(),
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.Dispensaciones = data;
        this.setCheckedItem();
        this.seleccionados = 0;
        this.selected = [];
        this.checked = false;

        this.http
          .get(environment.ruta + 'php/auditorias/lista_auditores.php')
          .subscribe((data: any) => {
            this.auditores = data.auditoria;
            this.indicadores = data.indicadores;
          });

        this.ListarDispensacionesAuditoria();
      });
  }

  SelectAll() {
    let selector = <HTMLInputElement>document.getElementById('SelectAll');

    if (selector.checked) {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }

  actualiza_filtro(txt, col, tipo) {
    const val = txt.toLowerCase();
    switch (val) {
      case 'todos': {
        break;
      }
      default: {
        const val = txt.toLowerCase();
        const temp = this.tempFilter.filter(function (d) {
          if (tipo === '=') {
            return d[col].toLowerCase().indexOf(val) !== -1 || !val;
          } else if (tipo === '!=') {
            return d[col].toLowerCase().indexOf(val) === -1;
          }
        });
        this.rowsFilter = temp;
        break;
      }
    }
  }

  actualiza_filtro1(txt, col, tipo) {
    const val = txt.toLowerCase();
    switch (val) {
      case 'todos': {
        break;
      }
      default: {
        const val = txt.toLowerCase();
        const temp = this.tempFilter1.filter(function (d) {
          if (tipo === '=') {
            return d[col].toLowerCase().indexOf(val) !== -1 || !val;
          } else if (tipo === '!=') {
            return d[col].toLowerCase().indexOf(val) === -1;
          }
        });
        this.rowsFilter1 = temp;
        break;
      }
    }
  }

  confirmarAsignarFacturador(FormAsignarFacturador: any, modalAsignarFacturador: any) {
    this.swalService.confirm('').then((result) => {
      if (result.isConfirmed) {
        this.AsignarFacturador(FormAsignarFacturador, modalAsignarFacturador);
      }
    });
  }

  confirmarGuardarAsignaciones(FormAsignarFacturadorTodos: any, modalAsignarFacturadorTodos: any) {
    this.swalService.confirm('').then((result) => {
      if (result.isConfirmed) {
        this.guardarAsignaciones(FormAsignarFacturadorTodos, modalAsignarFacturadorTodos);
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

  borrarFechas() {
    if (this.range.get('start').value && this.range.get('end').value) {
      this.range.setValue({
        start: null,
        end: null,
      });
      this.selectedDate(null, null);
    }
  }
}
