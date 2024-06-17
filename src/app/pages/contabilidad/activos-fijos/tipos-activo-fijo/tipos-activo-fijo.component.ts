import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  switchMap,
  filter,
  tap,
  catchError,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbModal,
  NgbTypeaheadSelectItemEvent,
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-tipos-activo-fijo',
  templateUrl: './tipos-activo-fijo.component.html',
  styleUrls: ['./tipos-activo-fijo.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    NgFor,
    NgClass,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    NgbTypeahead,
    NotDataComponent,
  ],
})
export class TiposActivoFijoComponent implements OnInit {
  @Output() MostrarSwal: EventEmitter<any> = new EventEmitter();

  @ViewChild('ModalTipoActivo') ModalTipoActivo: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  matPanel = false;
  buscandoCuenta = {
    planCuenta: false,
    planCuentaDepreciacion: false,
    planCuentaDepreciacionCredito: false,
  };
  busquedaCuentaFallida = {
    planCuenta: false,
    planCuentaDepreciacion: false,
    planCuentaDepreciacionCredito: false,
  };
  title: any = '';
  form: UntypedFormGroup;
  accountPlan: any[] = [];

  private campoEnfocado: string;

  public Cargando: boolean = false;
  public TiposActivosFijos: Array<any> = [];
  public tipoActivosFijos: any = {};
  // public Funcionario:any = JSON.parse(localStorage['User']);
  /*  public SwalDataObj:any = {
     icon: 'warning',
     title: 'Alerta',
     msg: 'Default'
   }; */
  /* public TipoActivoModel:any = {
    Nombre_Tipo_Activo: '',
    Categoria: '',
    Vida_Util: '',
    Vida_Util_PCGA: '',
    Porcentaje_Depreciacion_Anual: '',
    Porcentaje_Depreciacion_Anual_PCGA: '',
    Id_Plan_Cuenta_Depreciacion_NIIF: '',
    Id_Plan_Cuenta_Depreciacion_PCGA: '',
    Id_Plan_Cuenta_NIIF: '',
    Id_Plan_Cuenta_PCGA: '',
    Id_Plan_Cuenta_Credito_Depreciacion_PCGA: '',
    Id_Plan_Cuenta_Credito_Depreciacion_NIIF: ''
  }; */
  public Filtros: any = {
    nombre: '',
    categoria: '',
    vida_util: '',
    depreciacion: '',
  };
  //public CuentaCreditoDepreciacionPcga:any='';
  public CuentaCreditoDepreciacionNiif: any = '';
  public CuentaDepreciacionNiif: any = '';
  //public CuentaDepreciacionPcga:any = '';
  public CuentaNiif: any = '';
  //public CuentaPcga:any = '';

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

  constructor(
    // private tipoActivoService:TipoactivofijoService,
    // private generalService:GeneralService,
    // private planService:PlancuentaService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
    private modalService: NgbModal,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.ConsultaFiltrada();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      Id_Tipo_Activo_Fijo: [this.tipoActivosFijos.Id_Tipo_Activo_Fijo],
      Nombre_Tipo_Activo: ['', Validators.required],
      Categoria: ['Seleccione', Validators.required],
      Vida_Util: ['', Validators.required],
      Vida_Util_PCGA: ['', Validators.required],
      Porcentaje_Depreciacion_Anual: ['', Validators.required],
      Porcentaje_Depreciacion_Anual_PCGA: ['', Validators.required],
      Id_Plan_Cuenta_Depreciacion_NIIF: ['', Validators.required],
      Id_Plan_Cuenta_Depreciacion_PCGA: ['', Validators.required],
      Id_Plan_Cuenta_NIIF: ['', Validators.required],
      Id_Plan_Cuenta_PCGA: ['', Validators.required],
      Id_Plan_Cuenta_Credito_Depreciacion_NIIF: ['', Validators.required],
      Id_Plan_Cuenta_Credito_Depreciacion_PCGA: ['', Validators.required],
      //Id_Plan_Cuenta_Debito_Depreciacion_NIIF: ['', Validators.required],
      //Id_Plan_Cuenta_Debito_Depreciacion_PCGA: ['', Validators.required]
    });
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }

  selCampoEnfocado(tipo) {
    this.campoEnfocado = tipo;
  }

  gettipoActivosFijos(tipoActivosFijos) {
    this.tipoActivosFijos = { ...tipoActivosFijos };
    this.form.patchValue({
      Id_Tipo_Activo_Fijo: this.tipoActivosFijos.Id_Tipo_Activo_Fijo,
      Nombre_Tipo_Activo: this.tipoActivosFijos.Nombre_Tipo_Activo,
      Categoria: this.tipoActivosFijos.Categoria,
      Vida_Util: this.tipoActivosFijos.Vida_Util,
      Vida_Util_PCGA: this.tipoActivosFijos.Vida_Util,
      //Vida_Util_PCGA: this.tipoActivosFijos.Vida_Util_PCGA,
      Porcentaje_Depreciacion_Anual: this.tipoActivosFijos.Porcentaje_Depreciacion_Anual,
      Porcentaje_Depreciacion_Anual_PCGA: this.tipoActivosFijos.Porcentaje_Depreciacion_Anual,
      //Porcentaje_Depreciacion_Anual_PCGA: this.tipoActivosFijos.Porcentaje_Depreciacion_Anual_PCGA,
      Id_Plan_Cuenta_Depreciacion_NIIF: this.tipoActivosFijos.Id_Plan_Cuenta_Depreciacion_NIIF,
      Id_Plan_Cuenta_Depreciacion_PCGA: this.tipoActivosFijos.Id_Plan_Cuenta_Depreciacion_NIIF,
      //Id_Plan_Cuenta_Depreciacion_PCGA: this.tipoActivosFijos.Id_Plan_Cuenta_Depreciacion_PCGA,
      Id_Plan_Cuenta_NIIF: this.tipoActivosFijos.Id_Plan_Cuenta_NIIF,
      Id_Plan_Cuenta_PCGA: this.tipoActivosFijos.Id_Plan_Cuenta_NIIF,
      //Id_Plan_Cuenta_PCGA: this.tipoActivosFijos.Id_Plan_Cuenta_PCGA,
      Id_Plan_Cuenta_Credito_Depreciacion_NIIF:
        this.tipoActivosFijos.Id_Plan_Cuenta_Credito_Depreciacion_NIIF,
      Id_Plan_Cuenta_Credito_Depreciacion_PCGA:
        this.tipoActivosFijos.Id_Plan_Cuenta_Credito_Depreciacion_NIIF,
      //Id_Plan_Cuenta_Credito_Depreciacion_PCGA: this.tipoActivosFijos.Id_Plan_Cuenta_Credito_Depreciacion_PCGA
    });
    this.CuentaNiif = this.tipoActivosFijos.Cuenta_Niif;
    this.CuentaDepreciacionNiif = this.tipoActivosFijos.Cuenta_Depreciacion_NIIF;
    this.CuentaCreditoDepreciacionNiif = this.tipoActivosFijos.Cuenta_Credito_Niif;
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
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
    this.form.reset();
    this.CuentaNiif = '';
    this.CuentaCreditoDepreciacionNiif = '';
    this.CuentaDepreciacionNiif = '';
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  activateOrInactivate(tipoActivo, estado) {
    let dataEstadoTipo = {
      Id_Tipo_Activo_Fijo: tipoActivo.Id_Tipo_Activo_Fijo,
      Estado: estado,
    };
    let data = new FormData();
    data.append('modelo', this.normalize(JSON.stringify(dataEstadoTipo)));

    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text:
          tipoActivo.Estado == 'activo'
            ? '¡El tipo de activo será desactivado!'
            : '¡El tipo de activo será activado',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.http
            .post(environment.base_url + '/php/tipoactivo/guardar_tipo_activo.php', data)
            .subscribe((r: any) => {
              this._swal.show({
                icon: 'success',
                title: 'Tarea completada con éxito!',
                text:
                  tipoActivo.Estado == 'activo'
                    ? 'El tipo de activo ha sido desactivado con éxito.'
                    : 'El tipo de activo ha sido activado con éxito.',
                timer: 1000,
                showCancel: false,
              });
              this.ConsultaFiltrada(true, this.page);
            });
        }
      });
  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç\n\r'",
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNncc--*',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++) {
      mapping[from.charAt(i)] = to.charAt(i);
    }

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      return ret.join('');
    };
  })();

  calcularPorcentajeDepreciacion() {
    let porcentaje = (100 / parseInt(this.form.value.Vida_Util)).toFixed(4);
    this.form.patchValue({
      Porcentaje_Depreciacion_Anual_PCGA: porcentaje,
      Porcentaje_Depreciacion_Anual: porcentaje,
      Vida_Util_PCGA: this.form.value.Vida_Util,
    });
  }

  GuardarTipoActivo() {
    let data = new FormData();
    let modelo = this.normalize(JSON.stringify(this.form.value));
    data.append('modelo', modelo);

    this.http
      .post(environment.base_url + '/php/tipoactivo/guardar_tipo_activo.php', data)
      .subscribe((r: any) => {
        if (r.codigo == 'success') {
          this._swal.show({
            icon: 'success',
            title: 'Tarea completada con éxito!',
            text: 'El tipo de activo ha sido registrado con éxito.',
            timer: 1000,
            showCancel: false,
          });
          this.ConsultaFiltrada(true, this.page);
          this.closeModal();
        }
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

    if (this.Filtros.nombre.trim() != '') {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.categoria.trim() != '') {
      params.categoria = this.Filtros.categoria;
    }

    if (this.Filtros.vida_util.trim() != '') {
      params.vida_util = this.Filtros.vida_util;
    }

    if (this.Filtros.depreciacion.trim() != '') {
      params.depreciacion = this.Filtros.depreciacion;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
    return queryString;
  }

  ConsultaFiltrada(paginacion: boolean = false, event = 1) {
    this.page = event;
    var params = this.SetFiltros(paginacion);

    if (params === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this.http
      .get(environment.base_url + '/php/tipoactivo/get_lista_tipo_activo.php?' + params)
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.TiposActivosFijos = data.query_result;
          this.TotalItems = data.numReg;
        } else {
          this.TiposActivosFijos = [];
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

  //formatter1 = (x: { Nombre_Cuenta: string }) => x.Nombre_Cuenta;
  formatter2 = (x: { Nombre_Niif: string }) => x.Nombre_Niif;
  search_cuenta_niif = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.buscandoCuenta[this.campoEnfocado] = true)),
      switchMap((term) =>
        this.http
          .get<readonly string[]>(environment.base_url + '/php/plancuentas/filtrar_cuentas.php', {
            params: { coincidencia: term, tipo: 'niif' },
          })
          .pipe(
            tap(() => (this.busquedaCuentaFallida[this.campoEnfocado] = false)),
            catchError(() => {
              this.busquedaCuentaFallida[this.campoEnfocado] = true;
              return of([]);
            }),
          ),
      ),
      tap(() => (this.buscandoCuenta[this.campoEnfocado] = false)),
    );

  AsignarCuenta(e: NgbTypeaheadSelectItemEvent, tipo: string) {
    this.form.get(tipo + '_NIIF').setValue(e.item.Id_Plan_Cuentas);
    this.form.get(tipo + '_PCGA').setValue(e.item.Id_Plan_Cuentas);
  }
}

/* import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposActivoFijoService } from './tipos-activo-fijo.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-tipos-activo-fijo',
  templateUrl: './tipos-activo-fijo.component.html',
  styleUrls: ['./tipos-activo-fijo.component.scss']
})
export class TiposActivoFijoComponent implements OnInit {
  @ViewChild('modal') modal;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  form: FormGroup;
  loading: boolean = false;
  fixedAssets: any[] = [];
  fixedAsset: any = {};
  accountPlan: any[] = [];
  title: any = '';
  pagination: any = {
    page: 1,
    pageSize: 6,
    collectionSize: 0
  }
  filtros: any = {
    name: '',
    category: '',
    useful_life_niif: '',
    depreciation: ''
  }
  constructor(
    private fb: FormBuilder,
    private _tipoActivoFijo: TiposActivoFijoService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getFixedAssetTypes();
    this.createForm();
    this.getAccountPlan();
  }

  openModal() {
    this.modal.show();

  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }

  closeModal() {
    this.modalService.dismissAll();

  }

  createForm() {
    this.form = this.fb.group({
      id: [this.fixedAsset.id],
      name: ['', Validators.required],
      category: ['Seleccione', Validators.required],
      useful_life_niif: ['', Validators.required],
      annual_depreciation_percentage_niif: ['', Validators.required],
      useful_life_pcga: ['', Validators.required],
      annual_depreciation_percentage_pcga: ['', Validators.required],
      //niif_depreciation_account_plan_id: ['', Validators.required],
      //pcga_depreciation_account_plan_id: ['', Validators.required],
      niif_account_plan_id: ['', Validators.required],
      pcga_account_plan_id: ['', Validators.required],
      niif_account_plan_credit_depreciation_id: ['', Validators.required],
      pcga_account_plan_credit_depreciation_id: ['', Validators.required],
      pcga_account_plan_debit_depreciation_id: ['', Validators.required],
      niif_account_plan_debit_depreciation_id: ['', Validators.required]
    });
  }

  inputFormatBandListValue(value: any) {
    if (value.code)
      return value.code
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.code;
  }

  // formatter = (x: { code }) => x.code;
  search: OperatorFunction<string, readonly { code }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.accountPlan
          .filter((state) => new RegExp(term, 'mi').test(state.code))
          .slice(0, 10)
      )
    );

  // formatterNiif = (x: { niif_code }) => x.niif_code;
  searchNiif: OperatorFunction<string, readonly { niif_code }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.accountPlan
          .filter((state) => new RegExp(term, 'mi').test(state.niif_code))
          .slice(0, 10)
      )
    );

  inputFormatListValueNiif(value: any) {
    if (value.niif_code)
      return value.niif_code
    return value;
  }

  resultFormatListValueNiif(value: any) {
    return value.niif_code;
  }

  getAccountPlan() {
    this._tipoActivoFijo.getAccountPlan().subscribe((r: any) => {
      this.accountPlan = r.data;
    })
  }

  getTipo() {
    let value = this.form.get('pcga_account_plan_id').value;
  }

  getFixedAsset(fixedAsset) {
    this.fixedAsset = { ...fixedAsset };
    this.form.patchValue({
      id: this.fixedAsset.id,
      name: this.fixedAsset.name,
      category: this.fixedAsset.category,
      useful_life_niif: this.fixedAsset.useful_life_niif,
      useful_life_pcga: this.fixedAsset.useful_life_niif,
      //useful_life_pcga: this.fixedAsset.useful_life_pcga,
      annual_depreciation_percentage_niif: this.fixedAsset.annual_depreciation_percentage_niif,
      annual_depreciation_percentage_pcga: this.fixedAsset.annual_depreciation_percentage_niif,
      //annual_depreciation_percentage_pcga: this.fixedAsset.annual_depreciation_percentage_pcga,
      //niif_depreciation_account_plan_id: this.fixedAsset.niif_depreciation_account_plan,
      //pcga_depreciation_account_plan_id: this.fixedAsset.pcga_depreciation_account_pland,
      niif_account_plan_id: this.fixedAsset.niif_account_plan,
      pcga_account_plan_id: this.fixedAsset.niif_account_plan,
      //pcga_account_plan_id: this.fixedAsset.pcga_account_plan,
      niif_account_plan_credit_depreciation_id: this.fixedAsset.niif_account_plan_credit_depreciation,
      pcga_account_plan_credit_depreciation_id: this.fixedAsset.niif_account_plan_credit_depreciation,
      //pcga_account_plan_credit_depreciation_id: this.fixedAsset.pcga_account_plan_credit_depreciation,
      pcga_account_plan_debit_depreciation_id: this.fixedAsset.niif_account_plan_debit_depreciation,
      niif_account_plan_debit_depreciation_id: this.fixedAsset.niif_account_plan_debit_depreciation
    });
  }

  getFixedAssetTypes(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._tipoActivoFijo.getFixedAssetType(params).subscribe((r: any) => {
      this.fixedAssets = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  calculateDepreciationPercentage(tipo) {
    if (tipo == 'pcga') {
      /* let porcentaje = (100 / parseInt(this.form.value.useful_life_pcga)).toFixed(4);
      this.form.patchValue({
        annual_depreciation_percentage_pcga: porcentaje
      })
    } else {
      let porcentaje = (100 / parseInt(this.form.value.useful_life_niif)).toFixed(4);
      this.form.patchValue({
        annual_depreciation_percentage_niif: porcentaje,
        annual_depreciation_percentage_pcga: porcentaje
      })
    }
  }

  save() {
    let niif_account_plan_credit_depreciation_id = this.form.value.niif_account_plan_credit_depreciation_id.id;
    let niif_account_plan_debit_depreciation_id = this.form.value.niif_account_plan_debit_depreciation_id.id;
    let niif_account_plan_id = this.form.value.niif_account_plan_id.id;
    /* let pcga_account_plan_credit_depreciation_id = this.form.value.pcga_account_plan_credit_depreciation_id.id;
    let pcga_account_plan_debit_depreciation_id = this.form.value.pcga_account_plan_debit_depreciation_id.id;
    let pcga_account_plan_id = this.form.value.pcga_account_plan_id.id;
    this.form.patchValue({
      niif_account_plan_credit_depreciation_id,
      niif_account_plan_debit_depreciation_id,
      niif_account_plan_id,
      pcga_account_plan_credit_depreciation_id: niif_account_plan_credit_depreciation_id,
      pcga_account_plan_debit_depreciation_id: niif_account_plan_debit_depreciation_id,
      pcga_account_plan_id: niif_account_plan_id
    });
    this._tipoActivoFijo.updateOrCreateFixedAssetType(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getFixedAssetTypes();
      this._swal.show({
        icon: 'success',
        title: 'Proceso finalizado',
        text: 'El tipo de activo se ha creado satisfactoriamente.',
        timer: 1000,
        showCancel: false
      })
    })
  }

  activateOrInactivate(tipo_activo, state) {
    let data = {
      id: tipo_activo.id,
      state
    }
    this._swal.show({
      icon: 'question',
      showCancel: true,
      title: '¿Estás seguro(a)?',
      text: (data.state == 'Inactivo' ? '¡El tipo de activo fijo se anulará!' : '¡El tipo de activo fijo se activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._tipoActivoFijo.updateOrCreateFixedAssetType(data).subscribe((r) => {
          this.getFixedAssetTypes();
          this._swal.show({
            title: (data.state === 'Inactivo' ? '¡Tipo de activo fijo inhabilitado!' : '¡Tipo de activo fijo activada!'),
            text: (data.state === 'Inactivo' ? 'El tipo de activo fijo ha sido inhabilitado con éxito.' : 'El tipo de activo fijo ha sido activado con éxito.'),
            icon: 'success',
            showCancel: false,
            timer: 1000
          })
        })
      }
    });
  }

}
 */
