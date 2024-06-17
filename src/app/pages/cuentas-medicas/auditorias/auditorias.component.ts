import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { TiposervicioService } from '../services/tiposervicio.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { skipContentType } from 'src/app/http.context';
import { UserService } from 'src/app/core/services/user.service';
import { splineAreaChart } from './data';
import { ChartType } from './apex.model';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReporteauditoriasComponent } from './reporteauditorias/reporteauditorias.component';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';

import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { consts } from 'src/app/core/utils/consts';
import { ModalService } from 'src/app/core/services/modal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { Router } from '@angular/router';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';

@Component({
  standalone: true,
  imports: [
    NotDataSaComponent,
    HeaderButtonComponent,
    ActionButtonComponent,
    DropdownActionsComponent,
    CardComponent,
    TableComponent,
    AddButtonComponent,
    ReporteauditoriasComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgApexchartsModule,
    RouterModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    NgbDropdownModule,
    MatPaginatorModule,
    LoadImageComponent,
    ModalBasicComponent,
  ],
  providers: [],
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss'],
})
export class AuditoriasComponent implements OnInit {
  @ViewChild('studentChart') studentChart: ElementRef;
  @ViewChild('modalCorrespondencia') modalCorrespondencia: any;
  @ViewChild('FormCorrespondencia') FormCorrespondencia: NgForm;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  public auditorias: any[] = [];
  public correspondencia: any = [];
  public Regimen: any[] = [];
  public Servicio: any[] = [];

  public studentChartData: any;
  public studentChartTag: CanvasRenderingContext2D;
  private mes_preauditoria = [];
  private suma_preauditoria: number[] = [];
  private suma_auditoria: number[] = [];
  public TotalItems: number = 0;
  public page = 1;
  public maxSize = 30;

  public filtro_cod = '';
  public filtro_fecha: any = '';
  public filtro_pac = '';
  public filtro_punto = '';
  public filtro_serv = '';
  public filtro_dis = '';
  public Cargando_Dis = false;
  public Cargando: boolean = false;
  public CargandoCorresp: boolean = false;
  public funcionario: any = this.userService.user.id;
  public environment: any;
  public Modelo_Envio = {
    Cantidad_Folios: '',
    Id_Funcionario_Envia: this.funcionario,
    Punto_Envio: 1, // quemado, luego modificar
    Fecha_Envio: '',
    Fecha_Probable_Entrega: '',
    Empresa_Envio: '',
    Numero_Guia: '',
    Id_Regimen: '',
    Id_Tipo_Servicio: '',
    Observaciones_Envio: '',
  };

  public studentChartOption: any;
  public Punto_Envio = 1; // quemado, luego modificar
  public Dispensaciones: number;
  DispPendientes: any = [];
  public disp_correspondencia: any = [];
  DisEnviadas: any = [];
  public Tipo_Servicio: any = '';
  public Tipo_Regimen: any = '';
  public filtro_sin_dis: boolean = false;
  DispPendientesToFilter: any = [];

  //Paginación Correspondencia
  public TotalItems1: number;

  // paginacion Auditoria
  public TotalItemsA: number;

  public Filtros: any = {
    Punto: 1, // quemado, luego modificar
    Sin_Dis: '',
    Codigo: '',
    Disp: '',
    Paciente: '',
    Servicio: '',
    Fechas: '',
  };
  public Servicios: any = [];
  // public environment: any;
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });
  datePipe = new DatePipe('es-CO');
  splineAreaChart: ChartType;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  paginationAuditorias = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  filtro: any = {
    name: '',
  };
  form: UntypedFormGroup;
  selected: any;

  constructor(
    private _validators: ValidatorsService,
    private _modal: ModalService,
    readonly UrlFiltersService: UrlFiltersService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private _tiposervicio: TiposervicioService,
    private readonly userService: UserService,
    private _swal: SwalService,
    private router: Router,
  ) {
    this.IndicadorDispensacionesPend();
    this.ConsultaFiltrada();
    this.ConsultaFiltradaAuditoria(false, true);
    this.GetServicios();
    this.splineAreaChart = splineAreaChart;
    this.splineAreaChart.series[0].data = this.suma_preauditoria;
    this.splineAreaChart.series[1].data = this.suma_auditoria;
  }

  ngOnInit() {
    this.http
      .get(environment.ruta + 'php/correspondencia/regimen_servicio.php')
      .subscribe((data: any) => {
        this.Regimen = data.Regimen;
        this.Servicio = data.Servicio;
      });

    var bandera_mes = '';
    this.http
      .get(environment.ruta + 'php/auditorias/grafica_auditoria.php')
      .subscribe((data: any) => {
        data.forEach((element) => {
          if (bandera_mes != element.Mes) {
            bandera_mes = element.Mes;
            this.mes_preauditoria.push(element.Mes);
          }
          if (element.Estado === 'Auditado') {
            this.suma_auditoria[this.suma_auditoria.length] = parseInt(element.Cantidad);
          } else if (element.Estado === 'Pre Auditado') {
            this.suma_preauditoria[this.suma_preauditoria.length] = parseInt(element.Cantidad);
          }
        });
      });
    this.environment = environment;

    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.selectedDate(r.start, r.end);
      }
    });
  }

  // private getUrlFilters(): void {
  //   this.pagination = this.UrlFiltersService.currentPagination;
  //   this.filtro = this.UrlFiltersService.currentFilters;
  // }

  openModal(content) {
    this._modal.open(content);
    // this.form.reset();
    this.selected = 'Dispensaciones enviadas';
  }

  IndicadorDispensacionesPend() {
    let punto = 1; // quemado, luego modificar
    this.http
      .get(environment.ruta + 'php/correspondencia/lista_dispensaciones.php', {
        params: { pto: punto },
      })
      .subscribe((data: any) => {
        this.Dispensaciones = data.length;
      });
  }
  ListaAuditorias() {
    let punto = 1; // quemado, luego modificar
    let params = this.route.snapshot.queryParams;
    let queryString = '';
    this.Cargando = true;
    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      this.page = params.pag ? params.pag : 1;
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_pac = params.pac ? params.pac : '';
      this.filtro_serv = params.serv ? params.serv : '';
      this.filtro_dis = params.dis ? params.dis : '';
      this.filtro_sin_dis = params.sin_dis ? params.sin_dis : false;
      $('#sin-inventario').prop('checked', this.filtro_sin_dis);
      queryString =
        '&' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }
    this.http
      .get(environment.ruta + 'php/auditorias/lista_auditorias.php?punto=' + punto + queryString)
      .subscribe((data: any) => {
        this.Cargando = false;
        this.auditorias = data.Auditorias;
        this.paginationAuditorias.length = data.Registros;
      });
  }
  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.Filtros.Fechas = event.formatted;
    } else {
      this.Filtros.Fechas = '';
    }
    this.ConsultaFiltradaAuditoria();
  }

  selectedDate(start, end) {
    //para auditorías
    if (start && end) {
      this.Filtros.Fechas =
        this.datePipe.transform(start, 'yyyy-MM-dd') +
        ' - ' +
        this.datePipe.transform(end, 'yyyy-MM-dd');
    } else this.Filtros.Fechas = '';
    this.ConsultaFiltradaAuditoria();
  }

  // filtros() {
  //   let params: any = {};
  //   if (
  //     this.filtro_fecha != '' ||
  //     this.filtro_cod != '' ||
  //     this.filtro_pac != '' ||
  //     this.filtro_punto != '' ||
  //     this.filtro_serv != ''
  //   ) {
  //     this.page = 1;
  //     params.pag = this.page;
  //     params.func = this.funcionario;
  //     params.sin_dis = this.filtro_sin_dis;
  //     params.fecha = this.filtro_fecha;
  //     // if (this.filtro_fecha != '' && this.filtro_fecha != null) {
  //     //   params.fecha = this.filtro_fecha.formatted;
  //     // }
  //     if (this.filtro_cod != '') {
  //       params.cod = this.filtro_cod;
  //     }
  //     if (this.filtro_pac != '') {
  //       params.pac = this.filtro_pac;
  //     }
  //     if (this.filtro_punto != '') {
  //       params.punto = this.filtro_punto;
  //     }
  //     if (this.filtro_serv != '') {
  //       params.serv = this.filtro_serv;
  //     }
  //     if (this.filtro_fecha != '' && this.filtro_fecha != null) {
  //       params.fecha = this.filtro_fecha;
  //     }
  //     if (this.filtro_dis != '') {
  //       params.dis = this.filtro_dis;
  //     }

  //     let queryString = Object.keys(params)
  //       .map((key) => key + '=' + params[key])
  //       .join('&');

  //     this.location.replaceState('/cuentas-medicas/auditorias', queryString); // actualizando URL

  //     this.Cargando = true;

  //     this.http
  //       .get(environment.ruta + 'php/auditorias/lista_auditorias.php?' + queryString)
  //       .subscribe((data: any) => {
  //         this.Cargando = false;
  //         this.auditorias = data.Auditorias;
  //         this.paginationAuditorias.length = data.Registros;
  //       });
  //   } else {
  //     this.location.replaceState('/cuentas-medicas/auditorias', '');
  //     this.page = 1;
  //     this.filtro_cod = '';
  //     this.filtro_fecha = '';
  //     this.filtro_pac = '';
  //     this.filtro_punto = '';
  //     this.filtro_serv = '';
  //     this.filtro_dis = '';

  //     this.http
  //       .get(
  //         environment.ruta +
  //           'php/auditorias/lista_auditorias.php?func=' +
  //           this.funcionario +
  //           '&sin_dis=' +
  //           this.filtro_sin_dis,
  //       )
  //       .subscribe((data: any) => {
  //         this.auditorias = data.query_result;
  //         this.paginationAuditorias.length = data.numReg;
  //       });
  //   }
  // }
  paginacion() {
    let params: any = {
      pag: this.page,
      func: this.funcionario,
      sin_dis: this.filtro_sin_dis,
    };

    if (this.filtro_fecha != '' && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha.formatted;
    }
    if (this.filtro_cod != '') {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_pac != '') {
      params.pac = this.filtro_pac;
    }
    if (this.filtro_punto != '') {
      params.punto = this.filtro_punto;
    }
    if (this.filtro_serv != '') {
      params.serv = this.filtro_serv;
    }
    if (this.filtro_dis != '') {
      params.dis = this.filtro_dis;
    }
    let queryString =
      '&' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

    this.location.replaceState('/cuentas-medicas/auditorias', queryString); // actualizando URL
    this.Cargando = true;

    this.http
      .get(
        environment.ruta +
          'php/auditorias/lista_auditorias.php?func=' +
          this.funcionario +
          queryString,
      )
      .subscribe((data: any) => {
        this.Cargando = false;
        this.auditorias = data.Auditorias;
        this.paginationAuditorias.length = data.Registros;
      });
  }

  reactivarTurno(auditoria) {
    this.http
      .get(environment.ruta + 'php/auditoria/reactivar_turno.php', { params: { id: auditoria } })
      .subscribe(
        (data: any) => {
          // this.confirmacionSwal.text = data.mensaje;
          // this.confirmacionSwal.type = data.tipo;
          // this.confirmacionSwal.show();
          this._swal.show({
            icon: `${data.tipo}`,
            title: `${data?.title}` || 'N/A',
            showCancel: false,
            text: `${data.mensaje}`,
            // timer: 1000,
          });
        },
        (error) => {
          // this.confirmacionSwal.text =
          //   'Ha ocurrido un error en el proceso, si el problema persiste por favor comunicarse con soporte técnico.';
          // this.confirmacionSwal.type = 'info';
          // this.confirmacionSwal.show();
          this._swal.show({
            icon: `error`,
            title: ``,
            showCancel: false,
            text: `Ha ocurrido un error en el proceso, si el problema persiste por favor comunicarse con soporte técnico.`,
            // timer: 1000,
          });
        },
      );
  }
  AsignarValorSinDis() {
    var check = $('#sin-dis').is(':checked');
    this.Filtros.Sin_Dis = check;

    setTimeout(() => {
      this.ConsultaFiltradaAuditoria();
    }, 100);
  }

  dispPendientesCorresp() {
    this.Cargando = true;
    let punto = 1; // quemado, luego modificar
    if (this.Modelo_Envio.Id_Regimen != '' && this.Modelo_Envio.Id_Tipo_Servicio != '') {
      this.http
        .get(environment.ruta + 'php/correspondencia/lista_dispensaciones.php?pto=' + punto, {
          params: {
            regimen: this.Modelo_Envio.Id_Regimen,
            tipo: this.Modelo_Envio.Id_Tipo_Servicio,
          },
        })
        .subscribe((data: any) => {
          this.DispPendientes = data;
          this.DispPendientesToFilter = data;
          this.Dispensaciones = data.length;
          this.Cargando = false;
        });
    } else {
      this.Cargando = false;
      // this.confirmacionSwal.title = 'Faltan datos ';
      // this.confirmacionSwal.text =
      //   'Falta alguno de los siguiente datos: Régimen o Tipo de Servicio';
      // this.confirmacionSwal.type = 'error';
      // this.confirmacionSwal.show();
      this._swal.show({
        icon: 'error',
        title: 'Faltan datos',
        showCancel: false,
        text: 'Falta alguno de los siguiente datos: Régimen o Tipo de Servicio',
        // timer: 1000,
      });
    }
  }

  DispensacionesEnviadas(id_correspondencia, estado) {
    // this.Cargando = true;
    this.http
      .get(environment.ruta + 'php/correspondencia/lista_dispensaciones_enviadas.php', {
        params: { id: id_correspondencia, estado: estado },
      })
      .subscribe((data: any) => {
        this.DisEnviadas = data;
        // this.Cargando = false;
      });
  }

  addCorresp(dis) {
    $('#checkTodos').prop('checked', false);

    let exist = this.disp_correspondencia.indexOf(dis);

    if (exist < 0) {
      this.disp_correspondencia.push(dis);
    } else {
      this.disp_correspondencia.splice(exist, 1);
    }

    setTimeout(() => {}, 200);
  }
  MarcarTodos() {
    if ($('#checkTodos').is(':checked')) {
      $('.todos').prop('checked', true);

      setTimeout(() => {
        this.DispPendientes.forEach((v, i) => {
          let exist = this.disp_correspondencia.indexOf(v.Id_Dispensacion);

          if (exist < 0) {
            this.disp_correspondencia.push(v.Id_Dispensacion);
          }
        });
      }, 100);
    } else {
      $('.todos').prop('checked', false);

      this.disp_correspondencia = [];
    }
  }
  showAlert(evt: any) {
    this._swal.confirm('Te dispones a enviar esta correspondencia').then((result) => {
      // Verifica si el usuario confirmó la anulación
      if (result.isConfirmed) {
        // Llama a la función para suspender la dispensación
        this.GuardarCorrespondencia(this.FormCorrespondencia);
      }
    });
  }

  GuardarCorrespondencia(formulario: NgForm) {
    let info = JSON.stringify(this.Modelo_Envio);
    let dispensaciones = JSON.stringify(this.disp_correspondencia);
    let datos = new FormData();

    datos.append('modulo', 'Correspondencia');
    datos.append('datos', info);
    datos.append('dispensaciones', dispensaciones);
    this.http
      .post(environment.ruta + '/php/correspondencia/guardar_correspondencia.php', datos, {
        context: skipContentType(),
      })
      .subscribe((data: any) => {
        this.Modelo_Envio = {
          Cantidad_Folios: '',
          Id_Funcionario_Envia: this.funcionario,
          Punto_Envio: 1, // quemado, luego modificar
          Fecha_Envio: '',
          Fecha_Probable_Entrega: '',
          Empresa_Envio: '',
          Numero_Guia: '',
          Id_Regimen: '',
          Id_Tipo_Servicio: '',
          Observaciones_Envio: '',
        };
        this.modalCorrespondencia.hide();
        this.disp_correspondencia = [];
        this.DispPendientes = [];
        // this.confirmacionSwal.title = data.title;
        // this.confirmacionSwal.text = data.mensaje;
        // this.confirmacionSwal.type = data.tipo;
        // this.confirmacionSwal.show();
        this._swal.show({
          icon: `${data.tipo}`,
          title: `${data.title}`,
          showCancel: false,
          text: `${data.mensaje}`,
          // timer: 1000,
        });

        setTimeout(() => {
          this.funcionario = this.funcionario;

          //this.ListaCorrespondencias();
          this.IndicadorDispensacionesPend();
        }, 100);
      });
  }

  AnularAuditoria(id) {
    this.http
      .get(environment.ruta + 'php/auditoria/anular_auditoria.php', {
        params: { id: id, id_funcionario: this.funcionario },
      })
      .subscribe(
        (data: any) => {
          // this.confirmacionSwal.text = data.mensaje;
          // this.confirmacionSwal.type = data.tipo;
          // this.confirmacionSwal.show();
          this._swal.show({
            icon: `${data.tipo}`,
            title: `${data?.title}` || 'N/A',
            showCancel: false,
            text: `${data.mensaje}`,
            // timer: 1000,
          });
          this.ListaAuditorias();
        },
        (error) => {
          // this.confirmacionSwal.text =
          //   'Ha ocurrido un error en el proceso, si el problema persiste por favor comunicarse con soporte técnico.';
          // this.confirmacionSwal.type = 'info';
          // this.confirmacionSwal.show();
          this._swal.show({
            icon: `error`,
            title: ``,
            showCancel: false,
            text: `Ha ocurrido un error en el proceso, si el problema persiste por favor comunicarse con soporte técnico.`,
            // timer: 1000,
          });
        },
      );
  }

  filtrar(value) {
    if (value == '') {
      this.DispPendientesToFilter = this.DispPendientes;
    } else {
      this.DispPendientesToFilter = this.filterByValue(this.DispPendientes, value);
    }
  }

  filterByValue(array, string) {
    return array.filter((object) =>
      Object.keys(object).some((k) => object[k].toLowerCase().includes(string.toLowerCase())),
    );
  }

  isSelect(id_dis) {
    if (this.disp_correspondencia.indexOf(id_dis) >= 0) {
      return true;
    }

    return false;
  }

  SetFiltros(paginacion: boolean) {
    let punto = 1; // quemado, luego modificar
    let params: any = {};

    params.tam = this.pagination.pageSize;

    if (paginacion === true) {
      params.pag = this.pagination.page;
    } else {
      params.pag = 1; // Volver a la página 1 al filtrar
    }
    params.punto = punto;

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.CargandoCorresp = true;
    var params = this.SetFiltros(paginacion);
    this.http
      .get(environment?.ruta + 'php/auditorias/lista_correspondencia_dev.php', { params: params })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.correspondencia = data.query_result;
          this.pagination.length = data.numReg;
        } else {
          this.correspondencia = [];
        }
        this.CargandoCorresp = false;
      });
  }

  SetFiltrosAuditoria(paginacion: boolean) {
    let params: any = {};

    params.tam = this.paginationAuditorias.pageSize;
    params.id_funcionario = this.funcionario;

    if (paginacion === true) {
      params.pag = this.paginationAuditorias.page;
    } else {
      this.paginationAuditorias.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.paginationAuditorias.page;
    }
    if (this.Filtros.Punto != '') {
      params.punto = this.Filtros.Punto;
    }
    if (this.Filtros.Fechas != '') {
      params.fecha = this.Filtros.Fechas;
    }
    if (this.Filtros.Servicio != '') {
      params.serv = this.Filtros.Servicio;
    }
    if (this.Filtros.Disp != '') {
      params.dis = this.Filtros.Disp;
    }
    if (this.Filtros.Codigo != '') {
      params.cod = this.Filtros.Codigo;
    }
    if (this.Filtros.Sin_Dis != '') {
      params.sin_dis = this.Filtros.Sin_Dis;
    }
    if (this.Filtros.Paciente != '') {
      params.pac = this.Filtros.Paciente;
    }

    return params;
  }

  ConsultaFiltradaAuditoria(paginacion: boolean = false, init: boolean = false) {
    if (init) {
      let p = this.route.snapshot.queryParams;

      if (Object.keys(p).length > 3) {
        // Si existe parametros o filtros
        // actualizando la variables con los valores de los paremetros.
        this.page = p.pag ? p.pag : 1;
        this.Filtros.Codigo = p.cod ? p.cod : '';
        this.Filtros.Fechas = p.fecha ? p.fecha : '';
        this.Filtros.Disp = p.dis ? p.dis : '';
      }
    }

    var params = this.SetFiltrosAuditoria(paginacion);

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    // this.location.replaceState('/cuentas-medicas/auditorias', queryString); // actualizando URL

    this.Cargando = true;
    this.http
      .get(environment.ruta + 'php/auditorias/lista_auditorias_d.php', { params: params })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.auditorias = data.query_result;
          this.paginationAuditorias.length = data.numReg;
        } else {
          this.auditorias = [];
        }
        this.Cargando = false;
        // this.SetInformacionPaginacionAuditoria();
      });
  }

  GetServicios() {
    this._tiposervicio.GetServiciosTipoServicio().subscribe((data: any) => {
      this.Servicios = data;
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

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = pageObject.pageIndex + 1 || 1;
    this.pagination.pageSize = pageObject.pageSize || 10;
    this.ConsultaFiltrada(true);
  }

  onPaginationAuditorias(pageObject: MatPaginator): void {
    this.paginationAuditorias.page = pageObject.pageIndex + 1 || 1;
    this.paginationAuditorias.pageSize = pageObject.pageSize || 10;
    this.ConsultaFiltradaAuditoria(true);
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

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status,
    };
    this._swal
      .show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        showCancel: true,
        text:
          status === 'Inactivo'
            ? 'El tipo de ingreso se anulará'
            : 'El tipo de ingreso se activará',
      })
      .then((result) => {
        if (result.isConfirmed) {
          ///////////////////
          // this._ingressTypeService.createIngressType(data).subscribe((res) => {
          //   this.getIngressType();
          //   this._swal.show({
          //     icon: 'success',
          //     title: status === 'Inactivo' ? 'Tipo de ingreso anulado' : 'Tipo de ingreso activado',
          //     showCancel: false,
          //     text:
          //       status === 'Inactivo'
          //         ? 'El tipo de ingreso ha sido anulado con éxito.'
          //         : 'El tipo de ingreso ha sido activado con éxito.',
          //     timer: 1000,
          //   });
          // });
        }
      });
  }

  descargarMalla(ruta: string) {
    window.open(ruta, '_blank');
  }
}
