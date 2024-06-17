import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, NgFor, NgIf } from '@angular/common';
import { FacturaMedicamentosService } from './factura-medicamentos.service';
import { environment } from 'src/environments/environment';
import { ModalBasicComponent } from '../../../components/modal-basic/modal-basic.component';
import { TablaFacturacionComponent } from './tabla-facturacion/tabla-facturacion.component';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-factura-medicamentos',
  templateUrl: './factura-medicamentos.component.html',
  styleUrls: ['./factura-medicamentos.component.css'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    RouterLink,
    TablaFacturacionComponent,
    ModalBasicComponent,
  ],
})
export class FacturaMedicamentosComponent implements OnInit {
  @ViewChild('PlantillaEstadoFacturacion') PlantillaEstadoFacturacion: TemplateRef<any>;
  @ViewChild('PlantillaEstadoAuditoria') PlantillaEstadoAuditoria: TemplateRef<any>;
  @ViewChild('PlantillaTipo') PlantillaTipo: TemplateRef<any>;
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaEstadoFacturacion') PlantillaEstadoFacturacion1: TemplateRef<any>;
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
  public filtro_facturador: string = '';
  public filtro_estado: string = '';

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
  Facturador_Asignado: any;
  idFacturador: any;
  seleccionados: number;
  facturador: string;
  indicadores: any = {};
  Dispensaciones: any = [];
  checked: boolean = false;
  Productos: any = [];
  public Servicios: Array<any> = [];

  public maxSize = 5;
  public TotalItems: number;
  public page = 1;
  public TotalItems1: number;
  public page1 = 1;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private _facturaMedicamento: FacturaMedicamentosService,
  ) {
    this.ListarDispensacionesAuditoria();

    this.ListarDetallesFacturacion();
  }

  ngOnInit() {
    this._getServiciosTipoServicio();
    this.http
      .get(environment.ruta + 'php/auditorias/lista_auditores.php')
      .subscribe((data: any) => {
        this.auditores = data.auditoria;
        this.indicadores = data.indicadores;
      });
  }

  private _getServiciosTipoServicio() {
    this._facturaMedicamento.GetServiciosTipoServicio().subscribe((data: Array<any>) => {
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

  ListarDispensacionesAuditoria() {
    this.Cargando = true;
    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
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
      .get(
        environment.ruta + '/php/dispensaciones/lista_dispensaciones_auditoria.php' + queryString,
      )
      .subscribe((data: any) => {
        this.Dispensaciones = data.dispensaciones;
        this.TotalItems = data.numReg;
        this.Cargando = false;
      });
  }

  paginacion() {
    let params: any = {
      pag: this.page,
    };
    this.LimpiarFiltros('facturacion');
    this.Cargando = true;

    if (this.filtro_cod != '') {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_cliente != '') {
      params.cliente = this.filtro_cliente;
    }
    if (this.filtro_fecha != '' && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha.formatted;
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
        environment.ruta + '/php/dispensaciones/lista_dispensaciones_auditoria.php?' + queryString,
      )
      .subscribe((data: any) => {
        this.Dispensaciones = data.dispensaciones;
        this.TotalItems = data.numReg;
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
      this.page = 1;
      params.pag = this.page;

      if (this.filtro_cod != '') {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_cliente != '') {
        params.cliente = this.filtro_cliente;
      }
      if (this.filtro_fecha != '' && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha.formatted;
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
          environment.ruta +
            '/php/dispensaciones/lista_dispensaciones_auditoria.php?' +
            queryString,
        )
        .subscribe((data: any) => {
          this.Dispensaciones = data.dispensaciones;
          this.TotalItems = data.numReg;
          this.Cargando = false;
        });
    } else {
      this.location.replaceState('/cmfacturacion', '');

      this.page = 1;
      this.filtro_fecha = '';
      this.filtro_cod = '';
      this.filtro_cliente = '';

      this.filtro_tipo = '';
      this.filtro_facturador = '';
      this.filtro_estado = '';

      this.http
        .get(environment.ruta + '/php/dispensaciones/lista_dispensaciones_auditoria.php')
        .subscribe((data: any) => {
          this.Dispensaciones = data.dispensaciones;
          this.TotalItems = data.numReg;
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
      this.page = 1;
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
    this.timeout = setTimeout(() => {
      // console.log('paged!', event);
    }, 100);
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

  AsignarFuncionarios() {
    this.modalAsignarFacturadorTodos.show();
  }

  AsignarFacturador(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    //let dispensaciones = JSON.stringify(this.selected);
    let datos = new FormData();

    datos.append('modulo', 'Dispensacion');
    datos.append('datos', info);
    modal.hide();
    this.http
      .post(environment.ruta + 'php/facturasventas/asignar_facturador.php', datos)
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
    // let dispensaciones:any = this.selected;
    let dispensaciones = JSON.stringify(this.selected);
    let datos = new FormData();

    datos.append('modulo', 'Dispensacion');
    datos.append('datos', info);
    datos.append('dispensaciones', dispensaciones);
    modal.hide();
    this.http
      .post(environment.ruta + '/php/facturasventas/guardar_factura_dispensacion.php', datos)
      .subscribe((data: any) => {
        formulario.reset();
        this.Dispensaciones = data;
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

  onSelect(selected) {
    //// console.log('Select Event', selected, this.selected);
    let Id_Dispensacion: any = selected.target.value;

    // this.selected.splice(0, this.selected.length);

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
        // this.fetchFilterData((data) => {
        //   this.tempFilter = [...data];
        //   this.rowsFilter = data;
        // });
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
        // this.fetchFilterData1((data) => {
        //   this.tempFilter1 = [...data];
        //   this.rowsFilter1 = data;
        // });
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
}
