import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TiposervicioService } from 'src/app/pages/ajustes/informacion-base/services/tiposervicio/tiposervicio.service';
import { DepartamentosService } from 'src/app/pages/ajustes/configuracion/localidades/services/departamentos.service';
import { GeneralService } from 'src/app/services/general.service';
import { RegimenService } from 'src/app/services/regimen.service';
import { RadicacionService } from '../radicacion.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { environment } from 'src/environments/environment'; // Reemplaza a Globales
import {
  NgbModal,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule } from '@angular/forms';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgFor, NgIf, NgClass, SlicePipe, DatePipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-tabla-radicaciones',
  templateUrl: './tabla-radicaciones.component.html',
  styleUrls: ['./tabla-radicaciones.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    NgIf,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    SlicePipe,
    DatePipe,
  ],
})
export class TablaRadicacionesComponent implements OnInit {
  @ViewChild('modalRadicacion') modalRadicacion: any;
  @Output() MostrarSwal: EventEmitter<any> = new EventEmitter();
  @Output() ActualizarEstadisticas: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  selected: any = '';
  closeResult = '';
  formRadicacion: UntypedFormGroup;

  public eventsSubject: Subject<any> = new Subject<any>();

  public cargando: boolean = false;
  public Funcionario: any = /*  JSON.parse(localStorage['User']) */ 1;
  public SwalDataObj: any = {
    type: 'warning',
    title: 'Alerta',
    msg: 'Default',
  };

  public Filtros: any = {
    consecutivo: '',
    codigo: '',
    num_rad: '',
    fecha_radicacion: '',
    nombre_cliente: '',
    departamento: '',
    regimen: '',
    tipo_servicio: '',
    estado: '',
    factura: '',
  };

  public Departamentos: Array<any> = [];
  public Regimenes: Array<any> = [];
  public TiposServicio: Array<any> = [];

  //Paginación
  public maxSize = 4;
  public pageSize = 4;
  public TotalItems = 5;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0,
  };
  private radicacion: any = {};
  public radicaciones: Array<any> = [];

  constructor(
    private radicacionService: RadicacionService,
    private departamentosService: DepartamentosService,
    private regimenService: RegimenService,
    private tipoServicioService: TiposervicioService,
    public router: Router,
    public generalService: GeneralService,
    private _toastService: ToastService,
    private _swalService: SwalService,
    private _generalService: GeneralService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.GetDepartamentos();
    this.GetRegimenes();
    this.GetServicios();
    this.ConsultaFiltrada();
    this.createForm();
  }

  createForm() {
    this.formRadicacion = this.fb.group({
      codigo: [this.radicacion.Codigo],
      consecutivo: ['', Validators.required],
      numeroRadicado: ['', Validators.required],
      fechaRadicado: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      nombreDepartamento: ['', Validators.required],
      nombreRegimen: ['', Validators.required],
      servicioTipoServicio: ['', Validators.required],
      facturasRadicadas: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  openClose() {
    this.matPanel == false ? this.accordion.openAll() : this.accordion.closeAll();
    this.matPanel = !this.matPanel;
  }

  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this.modalService
      .open(confirm, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'md',
        scrollable: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }
  private getDismissReason(reason: any) {
    //this.formradicacion.reset();
  }

  AbrirModalRadicado(idRadicado: string) {
    let p = {
      idRadicado: idRadicado,
      idFuncionario: this.Funcionario.Identificacion_Funcionario,
    };
    this.eventsSubject.next(p);
  }

  getRadicacion(data) {
    this.radicacion = { ...data };
    this.formRadicacion.patchValue({
      codigo: this.radicacion.Codigo,
      consecutivo: this.radicacion.Consecutivo,
      numeroRadicado: this.radicacion.Numero_Radicado,
      fechaRadicado: this.radicacion.Fecha_Radicado,
      nombreCliente: this.radicacion.Nombre_Cliente,
      nombreDepartamento: this.radicacion.Nombre_Departamento,
      nombreRegimen: this.radicacion.Nombre_Regimen,
      servicioTipoServicio: this.radicacion.ServicioTipoServicio,
      facturasRadicadas: this.radicacion.Facturas_Radicadas,
      estado: this.radicacion.Estado,
    });
  }

  GetDepartamentos() {
    //this.departamentoService.getDepartamentos().subscribe((data:any) => {
    //this.departamentosService.getDepartmentPaginate().subscribe((data: any) => {
    this.departamentosService.getDepartments().subscribe((data: any) => {
      if (data.code == 200) {
        this.Departamentos = data.data;
      } else {
        this.Departamentos = [];
      }
    });
  }

  GetRegimenes() {
    /* this.regimenService.getRegimenes() */
    this.http
      .get(environment.ruta + 'php/GENERALES/regimen/get_regimenes.php')
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.Regimenes = data.query_result;
        } else {
          this.Regimenes = [];
        }
      });
  }

  GetTipos() {
    /* 
    this.http.get(environment.ruta + 'php/GENERALES/tiposervicio/get_tipos_servicio.php') */
    this.tipoServicioService.getTipos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.TiposServicio = data.query_result;
      } else {
        this.TiposServicio = [];
      }
    });
  }

  GetServicios(): void {
    /* this.tipoServicioService
      .GetServiciosTipoServicio() */
    this.http
      .get(environment.ruta + 'php/dispensaciones/get_servicios.php')
      .subscribe((data: any) => {
        this.TiposServicio = data;
      });
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

    if (this.Filtros.consecutivo.trim() != '') {
      params.consecutivo = this.Filtros.consecutivo;
    }

    if (this.Filtros.codigo.trim() != '') {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.num_rad.trim() != '') {
      params.num_rad = this.Filtros.num_rad;
    }

    if (this.Filtros.fecha_radicacion.trim() != '') {
      params.fecha_radicacion = this.Filtros.fecha_radicacion;
    }

    if (this.Filtros.nombre_cliente.trim() != '') {
      params.nombre_cliente = this.Filtros.nombre_cliente;
    }

    if (this.Filtros.departamento.trim() != '') {
      params.departamento = this.Filtros.departamento;
    }

    if (this.Filtros.regimen.trim() != '') {
      params.regimen = this.Filtros.regimen;
    }

    if (this.Filtros.tipo_servicio.trim() != '') {
      params.tipo_servicio = this.Filtros.tipo_servicio;
    }

    if (this.Filtros.estado.trim() != '') {
      params.estado = this.Filtros.estado;
    }

    if (this.Filtros.factura.trim() != '') {
      params.factura = this.Filtros.factura;
    }

    let queryString = Object.keys(params)
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

    this.cargando = true;
    this.http
      .get(environment.ruta + 'php/radicados/get_lista_radicados.php?' + params)
      //this.radicacionService.getRadicados(params)
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          //this.radicaciones = data.query_result;
          this.radicaciones =
            parseInt(data.numReg) > 0
              ? data.query_result
              : [
                  {
                    Codigo: 1,
                    Consecutivo: 11,
                    Numero_Radicado: 44,
                    Fecha_Radicado: '2022-05-08',
                    Nombre_Cliente: 'Cesar Adrián',
                    Nombre_Departamento: 'Santander',
                    Nombre_Regimen: 'Ni idea',
                    ServicioTipoServicio: 'De algún tipo',
                    Facturas_Radicadas: ['a', 'b', 'c'],
                    Estado: 'Radicada',
                  },
                  {
                    Codigo: 1,
                    Consecutivo: 11,
                    Numero_Radicado: 44,
                    Fecha_Radicado: '2022-05-08',
                    Nombre_Cliente: 'Cesar Adrián',
                    Nombre_Departamento: 'Santander',
                    Nombre_Regimen: 'Ni idea',
                    ServicioTipoServicio: 'De algún tipo',
                    Facturas_Radicadas: ['a', 'b', 'c'],
                    Estado: 'Cerrada',
                  },
                  {
                    Codigo: 1,
                    Consecutivo: 11,
                    Numero_Radicado: 44,
                    Fecha_Radicado: '2022-05-08',
                    Nombre_Cliente: 'Cesar Adrián',
                    Nombre_Departamento: 'Santander',
                    Nombre_Regimen: 'Ni idea',
                    ServicioTipoServicio: 'De algún tipo',
                    Facturas_Radicadas: ['a', 'b', 'c'],
                    Estado: 'Radicada',
                  },
                  {
                    Codigo: 1,
                    Consecutivo: 11,
                    Numero_Radicado: 44,
                    Fecha_Radicado: '2022-05-08',
                    Nombre_Cliente: 'Cesar Adrián',
                    Nombre_Departamento: 'Santander',
                    Nombre_Regimen: 'Ni idea',
                    ServicioTipoServicio: 'De algún tipo',
                    Facturas_Radicadas: ['a', 'b', 'c'],
                    Estado: 'Anulada',
                  },
                  {
                    Codigo: 1,
                    Consecutivo: 11,
                    Numero_Radicado: 44,
                    Fecha_Radicado: '2022-05-08',
                    Nombre_Cliente: 'Cesar Adrián',
                    Nombre_Departamento: 'Santander',
                    Nombre_Regimen: 'Ni idea',
                    ServicioTipoServicio: 'De algún tipo',
                    Facturas_Radicadas: ['a', 'b', 'c'],
                    Estado: 'PreRadicada',
                  },
                ];
          //this.TotalItems = data.numReg;
        } else {
          this.radicaciones = [];
        }
        this.cargando = false;
        this.TotalItems = this.radicaciones.length;
        this.SetInformacionPaginacion();
      });
  }

  EmitirMensaje(swalObj) {
    this.MostrarSwal.emit(swalObj);
  }

  EliminarRadicacion(idRadicacion: string, tipoServicio: string) {
    let data = new FormData();
    data.append('id_radicacion', idRadicacion);
    data.append('tipo_servicio', tipoServicio);
    data.append('id_funcionario', this._generalService.FuncionarioData.Identificacion_Funcionario);

    this.radicacionService.eliminarRadicacion(data).subscribe((data: any) => {
      if (data.codigo == 'success') {
        let toastObj = {
          textos: [data.titulo, data.mensaje],
          tipo: data.codigo,
          duracion: 4000,
        };
        /* this._toastService.ShowToast(toastObj); */
        this.ConsultaFiltrada();
        this.ActualizarEstadisticas.emit();
      } else {
        this._swalService.ShowMessage(data);
      }
    });
  }

  ActualizarTabla() {
    //console.log("actualizando");

    this.ConsultaFiltrada();
  }

  ResetValues() {
    this.Filtros = {
      consecutivo: '',
      codigo: '',
      num_rad: '',
      fecha_radicacion: '',
      nombre_cliente: '',
      departamento: '',
      regimen: '',
      tipo_servicio: '',
    };
  }

  SetInformacionPaginacion() {
    var calculoHasta = this.page * this.pageSize;
    console.log(calculoHasta, this.page, this.TotalItems, this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }
}
