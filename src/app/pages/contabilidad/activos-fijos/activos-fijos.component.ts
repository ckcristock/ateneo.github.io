import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivoFijoModel } from './activo-fijo-model';
import { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ActivosFijosService } from './activos-fijos.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { DatePipe, NgFor, NgIf, NgClass, DecimalPipe } from '@angular/common';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-activos-fijos',
  templateUrl: './activos-fijos.component.html',
  styleUrls: ['./activos-fijos.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    NgIf,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    MatDatepickerModule,
    ReactiveFormsModule,
    NotDataComponent,
    DecimalPipe,
  ],
})
export class ActivosFijosComponent implements OnInit {
  env = environment;
  datePipe = new DatePipe('es-CO');
  date: { year: number; month: number };
  @ViewChild('ModalActivoFijo') ModalActivoFijo: any;
  @ViewChild('ModalActivoFijoAdiccion') ModalActivoFijoAdiccion: any;
  @ViewChild('alertSwal') alertSwal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
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
  public ActivoFijoModel: ActivoFijoModel = new ActivoFijoModel();
  public Cargando: boolean = false;

  public ActivosFijos: Array<any> = [];
  public TipoActivos: Array<any> = [];
  public Crear: boolean = true;
  public Filtros: any = {
    nombre: '',
    codigo: '',
    tipo: '',
    costo_niif: '',
    Id_Empresa: '',
  };

  id_funcionario;
  public Campo_Centro_Costo = '';
  public Campo_Rete_Ica = '';
  public Campo_Contrapartida = '';
  public Campo_Rete_Fuente = '';

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };

  public Ruta = '/php/activofijo/filtrar.php';
  public typeahead: any = {
    placeholder: 'Centro Costo',
    name: 'Centro_Costo',
    id: 'Centro_Costo',
    Requerido: true,
  };
  public Ruta_Cuentas = '/php/activofijo/cuentas.php';
  public Ruta_Cuenta_Renteciones = '/php/activofijo/cuentas_retenciones.php';
  public typeahead_Cuenta: any = {
    placeholder: 'Contrapartida',
    name: 'Contrapartida',
    id: 'Contrapartida',
    Requerido: true,
  };
  public typeahead_Rete_Iva: any = {
    placeholder: 'Cuenta Rete Iva',
    name: 'Rete_Iva',
    id: 'Rete_Iva',
    Requerido: false,
  };
  public typeahead_Rete_Fuente: any = {
    placeholder: 'Cuenta Rete Iva',
    name: 'Rete_Fuente',
    id: 'Rete_Fuente',
    Requerido: false,
  };

  public Codigo: any = '';
  public TerceroSeleccionado: any = '';
  public Retenciones: any = [];
  public Identificacion_Funcionario = this._user.user.person.id;
  public company_id: any = this._user.user.person.company_worked.id;
  IdDocumento: string = '';
  // id_funcionario: any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  alertOption: SweetAlertOptions;
  // perfilUsuario:any = localStorage.getItem('miPerfil');

  public ReporteModel: any = {
    Fechas: '',
    Tipo_Reporte: 'Compras',
    Centro_Costo: '',
    Tipo_Activo: '',
  };
  public listaTipoActivo: Array<any>;
  public listaCentroCosto: Array<any>;
  constructor(
    private swalService: SwalService,
    private http: HttpClient,
    private _activoFijo: ActivosFijosService,
    private _user: UserService,
  ) {
    this.id_funcionario = this._user.user.person.identifier;
    this.GetTipoActivos();
    this.ConsultaFiltrada();
    this.GetRetenciones();
    this.loadListasDatosReporte();
  }

  ngOnInit() {
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  GuardarActivoFijo() {
    if (!this.ValidateBeforeSubmit()) {
      return;
    }
    let data = new FormData();
    let modelo = this._activoFijo.normalize(JSON.stringify(this.ActivoFijoModel));
    data.append('modelo', modelo);
    this.http
      .post(environment.base_url + '/php/activofijo/guardar_activo_fijo_adicion.php', data)
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.CerrarModal();
          this.ConsultaFiltrada();
          // window.open(environment.base_url+'/php/contabilidad/movimientoscontables/movimientos_activo_fijo_pdf.php?id_registro='+data.Id+'&id_funcionario_elabora='+this.ActivoFijoModel.Identificacion_Funcionario,'_blank');
          setTimeout(() => {
            this.LimpiarModelo();
          }, 200);
        }

        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      });
  }
  GuardarAdicionActivoFijo() {
    if (!this.ValidateBeforeSubmit()) {
      return;
    }
    let data = new FormData();
    let modelo = this._activoFijo.normalize(JSON.stringify(this.ActivoFijoModel));
    data.append('modelo', modelo);
    this.http
      .post(environment.base_url + '/php/activofijo/guardar_activo_fijo_adicion.php', data)
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.CerrarModal();
          this.ConsultaFiltrada();
          // window.open(environment.base.url+'/php/contabilidad/movimientoscontables/movimientos_activo_fijo_pdf.php?id_registro='+data.Id+'&id_funcionario_elabora='+this.ActivoFijoModel.Identificacion_Funcionario,'_blank');
          setTimeout(() => {
            this.LimpiarModelo();
          }, 200);
        }

        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      });
  }

  ValidateBeforeSubmit() {
    if (this.ActivoFijoModel.Costo_NIIF == 0) {
      this.ShowSwal('warning', 'Alerta', 'El costo no puede ser 0, verifique el costo NIIF!');
      return false;
    } else if (this.ActivoFijoModel.Id_Centro_Costo == '') {
      this.ShowSwal('warning', 'Alerta', 'No ha agregado un centro de costo!');
      return false;
    } else {
      return true;
    }
  }

  GetTipoActivos() {
    this.http
      .get(environment.base_url + '/php/tipoactivo/get_tipo_activos.php')
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.TipoActivos = data.query_result;
        } else {
          this.TipoActivos = [];
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }
      });
  }
  GetRetenciones() {
    this.http
      .get(environment.base_url + '/php/activofijo/retenciones.php')
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.Retenciones = data;
        } else {
          this.Retenciones = [];
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }
      });
  }

  LimpiarModelo() {
    this.ActivoFijoModel = new ActivoFijoModel();
    this.Campo_Centro_Costo = '';
    this.Campo_Contrapartida = '';
    this.Campo_Rete_Fuente = '';
    this.Campo_Rete_Ica = '';
    this.TerceroSeleccionado = '';
  }
  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.codigo.trim() != '') {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.nombre.trim() != '') {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.tipo.trim() != '') {
      params.tipo = this.Filtros.tipo;
    }

    if (this.Filtros.costo_niif.trim() != '') {
      params.costo_niif = this.Filtros.costo_niif;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    return queryString;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    var params = this.SetFiltros(paginacion);

    if (params === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this.http
      .get(environment.base_url + '/php/activofijo/get_lista_activo_fijo.php' + params, {
        params: { company_id: this._user.user.person.company_worked.id },
      })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.ActivosFijos = data.query_result;
          this.TotalItems = data.numReg;
        } else {
          this.ActivosFijos = [];
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }

        this.Cargando = false;
        this.SetInformacionPaginacion();
      });
  }

  ResetValues() {
    this.Filtros = {
      nombre: '',
      categoria: '',
      vida_util: '',
      depreciacion: '',
    };
  }

  SetInformacionPaginacion() {
    var calculoHasta = this.page * this.pageSize;
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  CerrarModal() {
    this.ModalActivoFijo.hide();
    this.LimpiarModelo();
  }

  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  AsignarTercero() {
    if (typeof this.TerceroSeleccionado == 'object') {
      this.ActivoFijoModel.Nit = this.TerceroSeleccionado.Nit;
      this.ActivoFijoModel.Tipo = this.TerceroSeleccionado.Tipo;
    } else {
      this.ActivoFijoModel.Nit = '';
    }
  }
  AsignarConcepto() {
    this.ActivoFijoModel.Concepto =
      this.ActivoFijoModel.Nombre + ' ' + this.ActivoFijoModel.Documento;
  }

  CrearActivoFijo() {
    this.http
      .get(environment.base_url + '/php/activofijo/get_codigo.php')
      .subscribe((data: any) => {
        this.Codigo = data.consecutivo;
        this.ModalActivoFijo.show();
      });
  }
  CapturarIdCentroCosto(id: string, tipo: string) {
    if (tipo == 'Centro') {
      this.ActivoFijoModel.Id_Centro_Costo = id;
    } else if (tipo == 'Rete_Ica') {
      this.ActivoFijoModel.Id_Cuenta_Rete_Ica = parseInt(id);
      if (id != '') {
        let pos = this.Retenciones.findIndex((x) => x.Id_Plan_Cuenta === id);
        if (pos >= 0) {
          this.ActivoFijoModel.Costo_Rete_Ica =
            (this.Retenciones[pos].Porcentaje / 100) * this.ActivoFijoModel.Base;
        }
      }
    } else if (tipo == 'Rete_Fuente') {
      this.ActivoFijoModel.Id_Cuenta_Rete_Fuente = parseInt(id);
      if (id != '') {
        let pos = this.Retenciones.findIndex((x) => x.Id_Plan_Cuenta === id);
        if (pos >= 0) {
          this.ActivoFijoModel.Costo_Rete_Fuente =
            (this.Retenciones[pos].Porcentaje / 100) * this.ActivoFijoModel.Base;
        }
      }
    }
  }
  AsignarValor() {
    let valor =
      parseFloat(this.ActivoFijoModel.Base.toString()) +
      parseFloat(this.ActivoFijoModel.Iva.toString());
    this.ActivoFijoModel.Costo_NIIF = valor;
    this.RecalcularRetenciones();
  }
  AdicionActivo(id) {
    let p = { id_activo: id };
    this.http
      .get(environment.base_url + '/php/activofijo/get_activo_fijo_adiccion.php', { params: p })
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.ActivoFijoModel.Id_Activo_Fijo = data.Id_Activo_Fijo;
          this.Codigo = data.Codigo;
          this.ActivoFijoModel.Codigo = data.Codigo;
          this.ActivoFijoModel.Tipo_Activo = data.Tipo_Activo;
          this.ActivoFijoModel.Id_Tipo_Activo_Fijo = data.Id_Tipo_Activo_Fijo;
          this.ActivoFijoModel.Id_Centro_Costo = data.Id_Centro_Costo;
          this.ActivoFijoModel.Centro_Costo = data.Centro_Costo;
          this.Crear = false;
          this.ModalActivoFijo.show();
        } else {
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }
      });
  }
  RecalcularRetenciones() {
    if (parseFloat(this.ActivoFijoModel.Id_Cuenta_Rete_Fuente.toString()) != 0) {
      let pos = this.Retenciones.findIndex(
        (x) => x.Id_Plan_Cuenta === this.ActivoFijoModel.Id_Cuenta_Rete_Fuente,
      );

      if (pos >= 0) {
        this.ActivoFijoModel.Costo_Rete_Fuente =
          (this.Retenciones[pos].Porcentaje / 100) * this.ActivoFijoModel.Base;
      }
    }
    if (parseFloat(this.ActivoFijoModel.Id_Cuenta_Rete_Ica.toString()) != 0) {
      let pos = this.Retenciones.findIndex(
        (x) => x.Id_Plan_Cuenta === this.ActivoFijoModel.Id_Cuenta_Rete_Ica,
      );
      if (pos >= 0) {
        this.ActivoFijoModel.Costo_Rete_Ica =
          (this.Retenciones[pos].Porcentaje / 100) * this.ActivoFijoModel.Base;
      }
    }
  }

  anularDocumento(id) {
    let datos: any = {
      Id_Registro: id,
      Tipo: 'Activo_Fijo',
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

        this.ConsultaFiltrada();
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

    return this.http.post(environment.base_url + '/php/contabilidad/anular_documento.php', data);
  }

  dateRangeChanged2(event) {
    this.ReporteModel.Fechas = event.target.value;
  }
  selectedDate(start, end) {
    this.ReporteModel.Fechas =
      this.datePipe.transform(start, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(end, 'yyyy-MM-dd');
  }

  loadListasDatosReporte() {
    this.http
      .get(environment.base_url + '/php/activofijo/datos_reporte.php', {
        params: { company_id: this._user.user.person.company_worked.id },
      })
      .subscribe((data: any) => {
        this.listaTipoActivo = data.Tipos_Activos;
        this.listaCentroCosto = data.Centro_Costos;
      });
  }

  getQueryString() {
    let params: any = {};

    if (this.ReporteModel.Fechas != '') {
      params.Fechas = this.ReporteModel.Fechas;
    }
    if (this.ReporteModel.Tipo_Reporte != '') {
      params.Tipo_Reporte = this.ReporteModel.Tipo_Reporte;
    }
    if (this.ReporteModel.Centro_Costo != '') {
      params.Centro_Costo = this.ReporteModel.Centro_Costo;
    }
    if (this.ReporteModel.Tipo_Activo != '') {
      params.Tipo_Activo = this.ReporteModel.Tipo_Activo;
    }

    let queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    return queryString;
  }

  verReporte() {
    let queryString = this.getQueryString();

    window.open(environment.base_url + '/php/activofijo/reportes.php' + queryString, '_blank');
  }

  CambiarEstado(id) {
    this.swalService
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a cambiar el estado del activo fijo.',
        icon: 'question',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this.anularDocumento(id);
          //alert('En proceso')
        }
      });
  }
}
