import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { BodegasService } from 'src/app/pages/ajustes/informacion-base/bodegas/bodegas.service.';
import { ProductoService } from 'src/app/pages/inventario/services/producto.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { consts } from 'src/app/core/utils/consts';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CompraNacionalService } from '../compra-nacional.service';
import { TercerosService } from 'src/app/pages/ajustes/informacion-base/terceros/terceros.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ListItemsComponent } from '../../../../components/list-items/list-items.component';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { PlaceholderFormComponent } from '../../../../components/placeholder-form/placeholder-form.component';
import { CategoriasService } from 'src/app/pages/ajustes/informacion-base/empresas/company-configuration/components/categorias/categorias.service';
import { InputPositionDirective } from '@app/core/directives/input-position.directive';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProductNameComponent } from '@shared/components/product-name/product-name.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { MatPaginator } from '@angular/material/paginator';

// import { SolicitudesCompraService } from '../../solicitudes-compra/solicitudes-compra.service';
@Component({
  selector: 'app-crear-compra-nacional',
  templateUrl: './crear-compra-nacional.component.html',
  styleUrls: ['./crear-compra-nacional.component.scss'],
  standalone: true,
  imports: [
    PlaceholderFormComponent,
    NgIf,
    CabeceraComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    NgbTypeahead,
    ListItemsComponent,
    NotDataComponent,
    DecimalPipe,
    InputPositionDirective,
    NgxCurrencyDirective,
    MatAutocompleteModule,
    ProductNameComponent,
    ModalComponent,
    MatCheckboxModule,
    TableComponent,
  ],
})
export class CrearCompraNacionalComponent implements OnInit {
  reducerCosto = (accumulator, currentValue) => accumulator + parseFloat(currentValue?.Subtotal);
  reducerIva = (accumulator, currentValue) => accumulator + parseFloat(currentValue?.Valor_Iva);
  reducerTotal = (accumulator, currentValue) => accumulator + parseFloat(currentValue?.Total);

  loading: boolean;
  user: any;
  id: any;
  masks = consts;
  today = new Date();
  bodegas: any = [];
  proveedores: any = [];
  formCompra: UntypedFormGroup;
  formCategories: UntypedFormGroup;
  filteredCategories: any[] = [];
  filteredBodega: any[] = [];
  filteredProveedor: any[] = [];
  Categorias: any = [];
  Productos: any = [];
  Impuestos: any[] = [];
  datosCabecera: any = {
    Titulo: 'Nueva orden de compra',
    Fecha: this.today,
  };
  variableKeys: any[] = [];

  currentState$: Observable<any>;
  detailProduct: any;

  wantedProducts = [];
  searching: boolean;
  emitProductValue = new Subject();
  pagination: { page: number; pageSize: number; length: number } = {
    page: 1,
    pageSize: 100,
    length: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _user: UserService,
    private _proveedor: TercerosService,
    private _producto: ProductoService,
    private _categoria: CategoriasService,
    private _bodegas: BodegasService,
    public _consecutivos: ConsecutivosService,
    public _swal: SwalService,
    public _compra: CompraNacionalService,
    private fb: UntypedFormBuilder,
    private readonly _modal: NgbModal,
  ) {
    // private _solicitud: SolicitudesCompraService
    this.user = this._user?.user?.person?.id;
    this.detailProduct = this.router.getCurrentNavigation()?.extras?.state;
  }

  async ngOnInit() {
    this.loading = true;
    this.createForm();
    this.createFormCategories();
    this.getConsecutivo();
    this.getBodegas();
    this.getImpuestos();
    this.getProveedores();
    this.getAllProducts();
    await this.getCategories();
    if (this.detailProduct?.orderDetails) {
      let orderDetails = this.detailProduct?.orderDetails;
      this.getSolicitud(orderDetails);
    }
    this.loading = false;
  }

  get categoryId() {
    return this.formCategories.get('category_id');
  }

  getSolicitud(orderDetails) {
    this.formCategories.patchValue({
      category_id: orderDetails?.queryParams?.data?.category_id,
    });
    this.formCompra.patchValue({
      Fecha_Entrega_Probable: orderDetails?.queryParams?.data?.expected_date,
      Id_Proveedor: orderDetails?.queryParams?.products[0]?.third_party_id,
    });
    orderDetails?.queryParams?.products.forEach((product) => {
      let prod = this.fb.group({
        Id_Producto_Orden_Compra_Nacional: [''],
        Nombre_Comercial: [product?.product_info?.product?.Nombre_Comercial],
        Embalaje_id: [product?.product_info?.product?.Embalaje_id],
        Embalaje_nombre: [product?.product_info?.product?.packaging?.name],
        Presentacion: [product?.product_info?.product?.Presentacion],
        Id_Producto: [product?.product_info?.product?.Id_Producto],
        Cantidad: [product?.product_info?.ammount, Validators.min(1)],
        Costo: [product?.total_price / product?.product_info?.ammount, Validators.min(1)],
        impuesto_id: [product?.product_info?.product?.impuesto_id, Validators.required],
        Total: [0],
        Subtotal: [0],
        Valor_Iva: [0],
      });
      this.subscribeProductsForm(prod);
      this.products.push(prod);
    });
  }

  addProduct(product, input) {
    if (!this.products?.value?.some((x) => x.Id_Producto == product.Id_Producto)) {
      let prod = this.fb.group({
        Nombre_Comercial: [product?.Nombre_Comercial],
        Nombre_General: [product?.Nombre_General],
        Id_Producto_Orden_Compra_Nacional: [''],
        Embalaje_id: [product?.Embalaje_id],
        Embalaje_nombre: [product?.packaging?.name],
        Presentacion: [product?.Presentacion],
        Id_Producto: [product?.Id_Producto],
        Cantidad: [1, Validators.min(1)],
        Costo: [product?.Precio, Validators.min(1)],
        variables: [product?.variables],
        impuesto_id: [product?.impuesto_id, Validators.required],
        Total: [0],
        Subtotal: [0],
        Valor_Iva: [0],
      });
      this.subscribeProductsForm(prod);
      this.products.push(prod);
      if (this.products && this.products.length > 0) {
        const firstProduct = this.products.at(0).value;
        if (firstProduct && firstProduct.variables) {
          this.variableKeys = this.getKeys(firstProduct.variables);
        }
      }
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Elemento duplicado',
        text: 'Ya has agregado este producto',
        showCancel: false,
      });
    }
    input.value = '';
  }

  createForm() {
    this.formCompra = this.fb.group({
      Id_Orden_Compra_Nacional: [null],
      Fecha_Entrega_Probable: ['', Validators.required],
      Identificacion_Funcionario: [this.user],
      Id_Bodega_Nuevo: ['', Validators.required],
      Id_Proveedor: [null, Validators.required],
      Tipo: ['Recurrente'],
      Observaciones: [''],
      Subtotal: [0],
      Iva: [0],
      Total: [0],
      format_code: [''],
      Productos: this.fb.array([], [Validators.required]),
    });
  }

  async getCategories() {
    await this._categoria
      .getCategorias()
      .toPromise()
      .then((res: any) => {
        this.Categorias = res?.data;
        this.filteredCategories = res?.data?.slice();
      });
  }

  getProveedores() {
    this._proveedor.getThirdPartyProvider({}).subscribe((res: any) => {
      this.proveedores = res?.data;
      this.filteredProveedor = res?.data?.slice();
    });
  }

  getBodegas() {
    this._bodegas.getAllBodegas().subscribe((res: any) => {
      this.bodegas = res?.data;
      this.filteredBodega = res?.data?.slice();
    });
  }

  getSearchProduct(value: string) {
    this.searching = true;
    this.emitProductValue.next(value);
  }

  getAllProducts() {
    this.emitProductValue.pipe(debounceTime(500)).subscribe({
      next: (val) => {
        this._compra
          .getProducts({ search: val, category_id: this.formCategories.get('category_id').value })
          .subscribe({
            next: (res) => {
              this.wantedProducts = res.productos;
              this.searching = false;
            },
          });
      },
    });
  }

  getImpuestos() {
    this.http.get(environment.base_url + '/impuestos').subscribe((res: any) => {
      this.Impuestos = res?.data;
    });
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('Orden_Compra_Nacional').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data?.format_code;
      this.formCompra.patchValue({ format_code: this.datosCabecera?.CodigoFormato });
      let con = this._consecutivos.construirConsecutivo(r.data);
      this.datosCabecera.Codigo = con;
    });
  }

  subscribeProductsForm(prod) {
    let total = prod?.get('Total');
    let subtotal = prod?.get('Subtotal');
    let iva = prod?.get('Valor_Iva');
    let costo = prod?.get('Costo');
    let cantidad = prod?.get('Cantidad');
    let impuesto_id = prod?.get('impuesto_id');
    let impuesto = this.Impuestos?.find((x) => x?.Id_Impuesto == impuesto_id?.value);
    let valorIva = (cantidad?.value * costo?.value * impuesto?.Valor) / 100;
    let subtotalItem = cantidad?.value * costo?.value;
    let totalItem = valorIva + subtotalItem;
    this.updateTotals();
    prod.patchValue({
      Total: totalItem,
      Subtotal: subtotalItem,
      Valor_Iva: valorIva,
    });
    cantidad.valueChanges.subscribe((value) => {
      let costo = prod.get('Costo');
      let impuesto_id = prod.get('impuesto_id');
      let impuesto = this.Impuestos.find((x) => x.Id_Impuesto == impuesto_id.value);
      let valorIva = (value * costo.value * impuesto.Valor) / 100;
      let subtotal = value * costo.value;
      let total = valorIva + subtotal;
      prod.patchValue({
        Total: total,
        Subtotal: subtotal,
        Valor_Iva: valorIva,
      });
    });
    costo.valueChanges.subscribe((value) => {
      let cantidad = prod.get('Cantidad');
      let impuesto_id = prod.get('impuesto_id');
      let impuesto = this.Impuestos.find((x) => x.Id_Impuesto == impuesto_id.value);
      let valorIva = (value * cantidad.value * impuesto?.Valor) / 100;
      let subtotal = value * cantidad.value;
      let total = valorIva + subtotal;
      prod.patchValue({
        Total: total,
        Subtotal: subtotal,
        Valor_Iva: valorIva,
      });
    });
    impuesto_id.valueChanges.subscribe((value) => {
      let cantidad = prod.get('Cantidad');
      let costo = prod.get('Costo');
      let impuesto = this.Impuestos.find((x) => x.Id_Impuesto == value);

      let valorIva = (costo.value * cantidad.value * impuesto?.Valor) / 100;
      let subtotal = costo.value * cantidad.value;
      let total = valorIva + subtotal;
      prod.patchValue({
        Total: total,
        Subtotal: subtotal,
        Valor_Iva: valorIva,
      });
    });
    total.valueChanges.subscribe((value) => {
      this.updateTotals();
    });
    subtotal.valueChanges.subscribe((value) => {
      this.updateTotals();
    });
    iva.valueChanges.subscribe((value) => {
      this.updateTotals();
    });
  }

  updateTotals() {
    setTimeout(() => {
      let subtotal = parseFloat(this.formCompra.value.Productos.reduce(this.reducerCosto, 0));
      let iva = parseFloat(this.formCompra.value.Productos.reduce(this.reducerIva, 0));
      let total = parseFloat(this.formCompra.value.Productos.reduce(this.reducerTotal, 0));
      this.formCompra.patchValue({
        Iva: iva,
        Subtotal: subtotal,
        Total: total,
      });
    }, 500);
  }

  createFormCategories() {
    this.formCategories = this.fb.group({
      category_id: ['', Validators.required],
    });
    this.formCategories.get('category_id').valueChanges.subscribe((v) => {
      this.validateProducts();
    });
  }

  get products(): UntypedFormArray {
    return this.formCompra.get('Productos') as UntypedFormArray;
  }

  validateProducts() {
    if (this.products.controls.length > 0) {
      this._swal
        .show({
          icon: 'warning',
          title: 'Productos en lista',
          text: 'Ya has agregado productos a la lista, si cambias este valor se vaciará la lista de productos.',
        })
        .then((r) => {
          if (r.isConfirmed) {
            this.products.clear();
          }
        });
    }
  }

  getProducts(value) {
    let params = {
      subcategoria: value,
    };
    this._producto.getProductos(params).subscribe((res: any) => {
      this.Productos = res.data;
    });
  }

  GuardarCompra() {
    if (this.formCompra.valid) {
      const formData = {
        ...this.formCompra.value,
        PurchaseRequestIds: this.selectedPurchaseRequests,
      };
      const request = () => {
        this._compra.save(formData).subscribe(
          (res: any) => {
            this._swal.show({
              title: 'Creación de orden de compras.',
              text: res.data,
              icon: 'success',
              timer: 1000,
              showCancel: false,
            });
            this.formCompra.reset();
            this.router.navigate(['/compras/nacional']);
          },
          (error) => {
            this._swal.hardError();
          },
        );
      };
      this._swal.swalLoading('Vamos a guardar una nueva orden de compra.', request);
    } else {
      this._swal.incompleteError();
    }
  }

  deleteProduct(posicion?, event?) {
    if (posicion && event) {
      if (event.screenX != 0) {
        this.products.removeAt(posicion);
      }
    } else {
      this.products.clear();
    }
    this.updateTotals();
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  openModal(modal) {
    this._modal.open(modal, { size: 'lg' });
    this.getPurchaseRequests();
  }

  purchaseRequests: any[] = [];
  loadingPurchaseRequests: boolean = false;
  getPurchaseRequests() {
    this.loadingPurchaseRequests = true;
    this._compra.getPurchaseRequests(this.pagination).subscribe((res: any) => {
      this.purchaseRequests = res.data.data;
      this.pagination.length = res.data.total;
      this.loadingPurchaseRequests = false;

      console.log('this.purchaseRequests', this.purchaseRequests);
    });
  }

  selectedPurchaseRequests: number[] = [];

  selectPurchaseRequest(event: MatCheckboxChange, id: number) {
    if (event.checked) {
      this.selectedPurchaseRequests.push(id);
    } else {
      const index = this.selectedPurchaseRequests.indexOf(id);
      if (index > -1) {
        this.selectedPurchaseRequests.splice(index, 1);
      }
    }
  }

  onPagination(pageObject: MatPaginator): void {
    this.pagination.page = Number(pageObject.page) || 1;
    this.pagination.pageSize = pageObject.pageSize || 100;
    this.getPurchaseRequests();
  }
}

//!Las funciones que siguen no se están usando en este momento dado que son funciones que se ejecutan cuando el componente recibe parametros, funcionalidad que aún no está disponible

//**esto va en el guardar
/**
 * let params = this.route.snapshot.queryParams;
 * if (params.Pre_Compra) {
              let datos = new FormData();
              datos.append('id_pre_compra', params.Pre_Compra);
              this.http
                .post(
                  environment.base_url +
                  '/php/rotativoscompras/actualizar_estado',
                  datos
                )
                .subscribe((data: any) => { });
            }
             if (this.id && this.precompra) {
                  const proveedor = this.precompra.find(
                    (lista) => lista.Id_Proveedor === this.id
                  );
                  const index = this.precompra.indexOf(proveedor);
                  this.precompra.splice(index, 1);
                  localStorage.setItem(
                    'Compra',
                    JSON.stringify(this.precompra)
                  );
                }
 */

/*
public listaProductos: any[] = [];
public listaProductosPorAgregar: any = [];
public precompra = JSON.parse(localStorage.getItem('Compra'));
public Id_Proveedor: any = '';
public Rotativo = false;
public NombreProveedor: string = '';
public Tipo: any = '';
pushCompra() {
  if (this.id && this.precompra) {
    this.Rotativo = true;
    const proveedor = this.precompra.find(
      (lista) => lista.Id_Proveedor === this.id
    );
    const index = this.precompra.indexOf(proveedor);
    var idProveedor = this.precompra[index].Id_Proveedor;
    this.Id_Proveedor = idProveedor;
    var productos = this.precompra[index].Productos;
    productos.forEach((element) => {
      if (element != null) {
        this.listaProductosPorAgregar.push({
          producto: element,
          Total: parseFloat(element.Costo) * parseFloat(element.Cantidad),
          Rotativo: 0,
          Iva_Disa: true,
        });

        this.products.push(
          this.fb.group({
            Id_Producto: [element.Id_Producto, Validators.required],
            Costo: [parseFloat(element.Costo), Validators.min(1)],
            Cantidad: [element.Cantidad, [Validators.min(1)]],
            Iva: [element.Iva, Validators.required],
            Total: [parseFloat(element.Costo) * parseFloat(element.Cantidad)],
          })
        );
      }
    });
    this.updateTotals();
  }
}

getRotativosCompra(params) {
  if (params.Pre_Compra) {
    this.http
      .get(
        environment.base_url +
        '/php/rotativoscompras/detalle_pre_compra/' +
        params.Pre_Compra
      )
      .subscribe((res: any) => {
        this.listaProductosPorAgregar = res.data.Productos;
        this.products.push(this.fb.group(res.data.Productos));
        this.Id_Proveedor = res.data.Datos.Id_Proveedor;
        this.listaProductosPorAgregar.push({
          producto: '',
          Total: 0,
          Rotativo: 0,
          Iva_Disa: true,
          Presentacion: 0,
          Iva_Acu: 0,
        });

        this.products.push(
          this.fb.group({
            Costo: 0,
            Total: 0,
            Cantidad: 1,
            Iva: 0,
            Id_Producto: '',
          })
        );

        this.NombreProveedor = res.data.Proveedor;
        this.updateTotals();
        this.Tipo = 'Recurrente';
      });
  }
}
*/
