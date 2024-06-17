import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  NavigationStart,
  Router,
  RouterLink,
} from '@angular/router';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { ModalService } from 'src/app/core/services/modal.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Observable, from } from 'rxjs';
import { filter, groupBy, map, mergeMap, toArray } from 'rxjs/operators';
import { TercerosService } from 'src/app/pages/ajustes/informacion-base/terceros/terceros.service';
import { CapitalLetterPipe } from 'src/app/core/pipes/capital-letter.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLinkButton,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { ActionViewComponent } from '../../../../shared/components/standard-components/action-view/action-view.component';
import { ActionButtonComponent } from '../../../../shared/components/standard-components/action-button/action-button.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { LoadImageComponent } from '../../../../shared/components/load-image/load-image.component';
import { NgIf, NgFor, UpperCasePipe, DecimalPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputPositionDirective } from '@app/core/directives/input-position.directive';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-solicitud-compra-ver',
  templateUrl: './solicitud-compra-ver.component.html',
  styleUrls: ['./solicitud-compra-ver.component.scss'],
  standalone: true,
  imports: [
    PlaceholderFormComponent,
    NgIf,
    NgFor,
    LoadImageComponent,
    CabeceraComponent,
    RouterLink,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    ActionViewComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbNav,
    FormsModule,
    ReactiveFormsModule,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLinkButton,
    NgbNavLinkBase,
    NgbNavContent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    NgbNavOutlet,
    MatRadioModule,
    NotDataComponent,
    CapitalLetterPipe,
    UpperCasePipe,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    InputPositionDirective,
    NgxCurrencyDirective,
  ],
})
export class SolicitudCompraVerComponent implements OnInit {
  mask = consts;
  loading: boolean;
  id: any;
  solicitud: any[] = [];
  datosCabecera: any = {};
  formCotizacionRegular: FormGroup;
  formCotizacionGeneral: FormGroup;
  proveedores: any = [];
  filteredProveedor: any[] = [];
  quotations: any[] = [];
  id_producto: any;
  loadingQuotations: boolean;
  quotationSelected: number;
  activities: any[] = [];
  permission: Permissions = {
    menu: 'Solicitudes de compra',
    permissions: {
      show: true,
      add: true,
    },
  };

  active = 1;

  constructor(
    private route: ActivatedRoute,
    private _solicitudesCompra: SolicitudesCompraService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _proveedor: TercerosService,
    private router: Router,
    private _permission: PermissionService,
    private _consecutivos: ConsecutivosService,
    private _swal: SwalService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.getData();
    });
  }
  //Modal de cargar cotizaciones
  openModal(content, id, general) {
    this.getProveedores();
    this.createFormCotizacion(id, general);
    this.getConsecutivo();
    this._modal.open(content, 'lg');
  }

  //Modal aprobar cotizaciones
  openModal2(content, id, size, type) {
    this.quotationSelected = undefined;
    this.getQuotationPurchaserequest(id, type);
    this._modal.open(content, size);
  }

  //Funcion que permite convetir en modal de aprobar a ver
  validate() {
    return this.quotations.some((x) => x.status == 'Aprobada');
  }
  // Cargar informacion en el componente ver una vez modales se cierren
  reloadData() {
    this.getData();
  }

  //Formulario de cargar cotizaciones
  createFormCotizacion(id, general) {
    this.formCotizacionRegular = this.fb.group({
      items: this.fb.array([]),
    });
    for (let index = 0; index < 3; index++) {
      let item = this.fb.group({
        third_party_id: [null],
        code: [''],
        total_price: [''],
        format_code: [''],
        product_purchase_request_id: [!general ? id : null],
        purchase_request_id: general ? id : null,
        file: ['', index == 0 ? Validators.required : ''],
      });
      item.get('file').valueChanges.subscribe((value) => {
        if (value) {
          item.get('total_price').setValidators(Validators.required);
          item.get('third_party_id').setValidators(Validators.required);
        }
      });
      this.items.push(item);
    }
  }

  //Funcion que trae los proveedores al formulario de cargar cotizaciones
  getProveedores() {
    this._proveedor.getThirdPartyProvider({}).subscribe((res: any) => {
      this.proveedores = res.data;
      this.filteredProveedor = res.data.slice();
    });
  }

  //Funcion que re dirige a el usuario a crear el proveedor sino existe en el formulario
  redirectTercero() {
    window.open('/ajustes/informacion-base/terceros/crear-tercero', '_blank');
  }

  // Crear consecutivos de las cotizaciones
  async getConsecutivo() {
    await this._consecutivos
      .getConsecutivo('quotation_purchase_requests')
      .toPromise()
      .then((r: any) => {
        let con = this._consecutivos.construirConsecutivo(r.data);
        this.items.controls.forEach((element, index) => {
          element.patchValue({
            code: con + '-' + (index + 1),
            format_code: r.data.format_code,
          });
        });
      });
  }

  //Funcion de guardar cotizaciones individuales
  saveQuotation() {
    if (this.formCotizacionRegular.valid) {
      let cont = 0;
      this.items.value.forEach((item) => {
        if (item.file) {
          cont++;
        }
      });
      if (cont == 1) {
        this.items.removeAt(2);
        this.items.removeAt(1);
      } else if (cont == 2) {
        this.items.removeAt(2);
      }
      let word = cont == 1 ? ' cotización.' : ' cotizaciones.';
      const request = () => {
        this._solicitudesCompra
          .saveQuotationsPurchaseRequest(this.formCotizacionRegular.value)
          .subscribe((res: any) => {
            this._swal.show({
              title: 'Operación exitosa',
              text: '¡Cotización(es) agregadas con éxito!',
              icon: 'success',
              showCancel: false,
              timer: 1000,
            });
            this._modal.close();
            this.formCotizacionRegular.reset();
            this.items.clear();
            this.getData();
          });
      };
      this._swal.swalLoading('Vamos a guardar ' + cont + word, request);
    } else {
      this._swal.incompleteError();
    }
  }

  //Funcion que valida el pdf de la cotizacion y lo transforma a base 64
  onFileChanged(event, i) {
    if (event.target.files.length == 1) {
      let file = event.target.files[0];
      const types = ['application/pdf'];
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido',
        });
        return null;
      }
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        let item = this.items.controls[i];
        item.patchValue({
          file: base64,
        });
      });
    }
  }
  appstate$: Observable<object>;
  //Funcion que trae la informacion del la solicitud a la tabla del componente ver
  getData() {
    this.loading = true;
    this._solicitudesCompra.getDataPurchaseRequest(this.id).subscribe((res: any) => {
      this.solicitud = res.data;
      this.activities = res.data.activity;
      this.datosCabecera = {
        Fecha: res.data.created_at,
        Codigo: res.data.code,
        Titulo: res.data.status,
        CodigoFormato: res.data.format_code,
      };
      this.loading = false;
      if (res.data.status == 'Aprobada') {
        this.validateOrders(res.data);
        this.appstate$ = this.router.events.pipe(
          filter((e) => e instanceof NavigationStart),
          map(() => {
            const currentState = this.router.getCurrentNavigation();
            return currentState.extras.state;
          }),
        );
      }
    });
  }

  //Funcion que crear el form array de los productos
  get items() {
    return this.formCotizacionRegular.get('items') as FormArray;
  }

  orders: any[] = [];
  validateOrders(data) {
    let orders: any[] = [];
    if (data.product_purchase_request.length > 0) {
      data.product_purchase_request.forEach((product) => {
        product.quotation.forEach((quotation) => {
          if (quotation.status == 'Aprobada') {
            quotation.product_info = product;
            orders.push(quotation);
          }
        });
      });
    }
    from(orders)
      .pipe(
        groupBy((order) => order.third_party_id),
        mergeMap((group) => group.pipe(toArray())),
      )
      .subscribe((result) => this.orders.push(result));
  }

  //Funcion que selecciona una cotizacion especifica al hacer clic en  el radio button
  selectedQuotation(id) {
    this.quotationSelected = id;
  }

  sendOrder(order) {
    let params = {
      products: order,
      data: this.solicitud,
    };
    let objToSend: NavigationExtras = {
      queryParams: params,
    };
    this.router.navigate(['/compras/crear-nacional'], { state: { orderDetails: objToSend } });
  }

  //funcion que trae todas las ctoizaciones de un producto especifico
  getQuotationPurchaserequest(id, type) {
    this.loadingQuotations = true;
    this._solicitudesCompra.getQuotationPurchaserequest(id, type).subscribe((res: any) => {
      this.quotations = res.data;
      this.loadingQuotations = false;
    });
  }

  // Funcion que guarda cual cotizacion fue aprobada y por medio del back cambia su status a aprobada y las demas a rechazadas
  saveQuotationApproved() {
    if (this.quotationSelected) {
      const request = () => {
        this._solicitudesCompra
          .saveQuotationApproved(this.quotationSelected)
          .subscribe((res: any) => {
            this._swal.show({
              title: 'Operación exitosa',
              text: '¡Cotización aprobada con éxito!',
              icon: 'success',
              showCancel: false,
              timer: 2000,
            });
            this._modal.close();
            this.reloadData();
          });
      };
      this._swal.swalLoading('', request);
    } else {
      this._swal.incompleteError();
    }
  }
}
