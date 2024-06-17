import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs';
// import { GeneralService } from '../../services/general/general.service';
// import { SwalService } from '../../services/swal/swal.service';
// import { ToastService } from '../../services/toasty/toast.service';
// import { ProductoService } from '../../services/productos/producto.service';
// import { RemisionModel } from '../../modelos/RemisonModel';
// import { ProductoRemisionModel } from '../../modelos/ProductoRemisionModel';
// import { ProductoCargarRemision } from '../../modelos/ProductoCargarRemision';
// import { DispensacionService } from '../../services/dispensacion/dispensacion.service';
// import { RemisionnuevoService } from '../../services/remisionnuevo/remisionnuevo.service';
// import { RemisionModelNuevo } from '../../modelos/RemisonModelNuevo';
import { RemisionModelNuevo } from '../RemisonModelNuevo';
import { ProductoRemisionModel } from '../ProductoRemisionModel';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ProductoService } from '../../services/producto.service';
import { RemisionnuevoService } from '../../services/remisionnuevo.service';
import { DispensacionService } from '../../services/dispensacion.service';
import { ProductoCargarRemision } from '../ProductoCargarRemision';
import { GeneralService } from '../../services/general.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { skipContentType } from 'src/app/http.context';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass, LowerCasePipe } from '@angular/common';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CategoriasService } from '@app/pages/ajustes/informacion-base/empresas/company-configuration/components/categorias/categorias.service';

@Component({
  selector: 'app-modalproductoremisionnuevo',
  templateUrl: './modalproductoremisionnuevo.component.html',
  styleUrls: ['./modalproductoremisionnuevo.component.scss'],
  standalone: true,
  imports: [
    ModalBasicComponent,
    NgIf,
    FormsModule,
    NgFor,
    NgClass,
    NgbTooltip,
    ModalComponent,
    AutomaticSearchComponent,
    TableComponent,
    LowerCasePipe,
  ],
})
export class ModalproductoremisionnuevoComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('ModalProductosRemision') ModalProductosRemision: any;

  @Input() AbrirModal: Observable<any> = new Observable();
  @Input() Pendiente: boolean = false;
  @Input() RemisionModel: RemisionModelNuevo;
  @Output() AgregarProductos: EventEmitter<any> = new EventEmitter();
  @Output() LimpiarCodBarras: EventEmitter<any> = new EventEmitter();

  public ListaProductos: Array<any> = [];
  public ListaAgregados: Array<any> = [];
  public Id_Inventarios: Array<any> = [];
  public ProductosAgregar: Array<any> = [];
  private _productoAgregar: ProductoRemisionModel;
  public ProductosExcluir: Array<string> = [];
  public ProductosEntregasDobles: Array<string> = []; //Esta lista solo se usa para validar entregas dobles en dispensacion
  public SelectedProducts: number = 0;
  public TCols: number = 7;
  public Tipo: string = '';
  public InformacionPunto: any = null;
  public Nit_Eps: string = '';
  public Codigo_Barras: string = '';
  public Id_Tipo_Servicio: string = '';
  public Id_Punto = localStorage.getItem('Punto');

  public Filtros: any = {
    nombre: '',
    cum: '',
    lab_com: '',
    Inv: '',
  };

  dynamicColumns = [];

  fieldFilter = {};

  categoryId = 0;

  public Cargando: boolean = false;

  public openSubscription: any;

  constructor(
    private generalService: GeneralService,
    private _swalService: SwalService,
    private http: HttpClient,
    // private _toastService: ToastService,
    private _productoService: ProductoService,
    private _dispensacion: DispensacionService,
    private _remisionNuevoService: RemisionnuevoService,
    private readonly modalService: NgbModal,
    readonly categoryService: CategoriasService,
  ) {}

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: any) => {
      this.Tipo = data.tipo;
      this.categoryId = data.remision_model.Category;
      if (data.tipo == 'Remision') {
        this.RemisionModel = data.remision_model;
        if (data.pendientes.length > 0) {
          this.ListaProductos = data.pendientes;
          this.Pendiente = true;
          this.TCols = 8;
        } else {
          this.ListaProductos = [];
          this.Pendiente = false;
          this.TCols = 7;
        }
      } else {
        this.ProductosEntregasDobles = data.productos_entregados;
        this.InformacionPunto = data.punto_dispensacion;
        this.Nit_Eps = data.nit_eps;
        this.Id_Tipo_Servicio = data.tipo_servicio;
        this.Codigo_Barras = data.cod_barras;
        this.ListaProductos = [];
        this.Pendiente = false;
        this.TCols = 8;

        if (data.cod_barras != '') {
          $('#sin-inventario').prop('checked', false);
          setTimeout(() => {
            this.ConsultaFiltrada();
          }, 300);
        }
      }
      this.ListaAgregados = data.agregados;
      this.Id_Inventarios = data.inventarios;
      this.modalService.open(this.ModalProductosRemision, { size: 'lg' });
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.RemisionModel.previousValue != undefined) {
    //   this.RemisionModel = changes.RemisionModel.currentValue;
    // }
  }

  ConsultaFiltrada(idField?: number) {
    const dynamics = [];
    Object.keys(this.fieldFilter).forEach((key) => {
      dynamics.push({
        category_variable_id: key,
        value: this.fieldFilter[key],
      });
    });

    this.AsignarValorSinInventario();
    var params = this.SetFiltros();
    params.id_categoria = this.categoryId;

    if (dynamics.length) params.dinamic = JSON.stringify(dynamics);
    else delete params.dinamic;

    this.Cargando = true;
    if (this.Tipo == 'Remision') {
      this.http
        .get(environment.base_url + '/php/remision_nuevo/get_productos_inventario.php', {
          params: params,
          context: skipContentType(),
        })
        .subscribe((data: any) => {
          this.ListaProductos = data.data.productos as Array<ProductoCargarRemision>;
          this.dynamicColumns = data.data.variables;
          this.Cargando = false;
        });
    } else if (this.Tipo == 'Dispensacion') {
      this._dispensacion.GetListaProductosInventario(params).subscribe((data: any) => {
        this.ListaProductos = data.Productos;
        this.Cargando = false;
      });
    }
  }

  SetFiltros() {
    let params: any = {};
    if (this.Tipo == 'Remision') {
      params.modelo = this.RemisionModel.Modelo;
      params.tiporemision = this.RemisionModel.Tipo;
      params.id_origen = this.RemisionModel.Id_Origen;
      params.mes = this.RemisionModel.Meses;

      if (this.RemisionModel.Grupo.Id_Grupo) {
        params.grupo = JSON.stringify(this.RemisionModel.Grupo);
      }
      if (this.RemisionModel.Tipo == 'Cliente') {
        params.id_destino = this.RemisionModel.Id_Destino;
        if (this.RemisionModel.Id_Destino == 0 || this.RemisionModel.Id_Destino == undefined) {
          this._swalService.ShowMessage([
            'error',
            'Sin Destino Seleccionado',
            'Debe seleccionar un destino para realizaar la busqueda!',
          ]);
          return;
        }
      } else if (this.RemisionModel.Tipo == 'Contrato') {
        params.id_destino = this.RemisionModel.Id_Destino;
        if (this.RemisionModel.Id_Destino == 0 || this.RemisionModel.Id_Destino == undefined) {
          this._swalService.ShowMessage([
            'error',
            'Sin Destino Seleccionado',
            'Debe seleccionar un destino para realizaar la busqueda!',
          ]);
          return;
        }
      }
    } else if (this.Tipo == 'Dispensacion') {
      params.id_punto = this.Id_Punto;
      params.id_tipo_servicio = this.Id_Tipo_Servicio;
      params.eps = this.Nit_Eps;
      params.cod_barras = this.Codigo_Barras;
    }

    if (this.Filtros.nombre.trim() != '') {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.cum.trim() != '') {
      params.cum = this.Filtros.cum;
    }
    if (this.Filtros.lab_com.trim() != '') {
      params.lab_com = this.Filtros.lab_com;
    }
    if (this.Filtros.Inv != '') {
      params.inv = this.Filtros.Inv;
    }

    return params;
  }

  SeleccionarProducto(seleccionado: any, idProducto: any, producto: any, posProducto: any) {
    let inventario = producto.Id_Inventario_Nuevo;

    if (seleccionado == '0') {
      if (!this.VerificarAgregados(idProducto, inventario)) {
        return;
      } else {
        let prd = {};
        producto.Lotes_Visuales = new Array<string>();

        if (this.Tipo == 'Dispensacion') {
          let p = {
            id_tipo_servicio: this.Id_Tipo_Servicio,
            eps: this.Nit_Eps,
            id_producto: idProducto,
            id_punto: this.Id_Punto,
          };

          this.http
            .get(environment.base_url + '/php/tablero_dispensacion/validar_producto.php', {
              params: p,
            })
            .subscribe((data: any) => {
              if (data.codigo == 'success') {
                producto.Costo = data.Costo;
                let validacion = this.generalService.ValidarEntregasDobles(
                  this.InformacionPunto,
                  this.ProductosEntregasDobles,
                  idProducto,
                );
                if (!validacion.validar) {
                  this._swalService.ShowMessage([
                    'warning',
                    'Alerta',
                    'Esta producto ya fue entregado este mes en la dis ' +
                      validacion.codigo +
                      ' en la fecha ' +
                      validacion.fecha +
                      '!',
                  ]);
                  return;
                } else {
                  prd = this.SetearProductoDispensacion(producto);
                }
                if (!functionsUtils.IsObjEmpty(prd)) {
                  this.ProductosAgregar.push(prd);
                }
                this.ListaAgregados.push(idProducto);
                this.Id_Inventarios.push(inventario);
                this.ListaProductos[posProducto].Seleccionado = '1';
              } else {
                this._swalService.ShowMessage(data);
              }
            });
        } else {
          prd = this.SetearProducto(producto);
          if (!functionsUtils.IsObjEmpty(prd)) {
            this.ProductosAgregar.push(prd);
          }
          this.ListaProductos[posProducto].Seleccionado = '1';
        }
      }
    } else {
      let index = this.ProductosAgregar.findIndex((x) => x.Id_Producto == idProducto);
      this.ProductosAgregar.splice(index, 1);

      let inv = this.Id_Inventarios.findIndex((x) => x == inventario);
      this.Id_Inventarios.splice(inv, 1);

      this.ListaProductos[posProducto].Seleccionado = '0';
    }
  }

  private VerificarAgregados(idProducto: string, idInventario: string): boolean {
    let exist = this.ListaAgregados.filter((x) => x == idProducto);

    if (this.Tipo == 'Remision') {
      if (exist.length > 0) {
        this._swalService.ShowMessage([
          'warning',
          'Alerta',
          'Ya este producto ha sido agregado a la lista!',
        ]);
        return false;
      } else {
        return true;
      }
    } else {
      let exit_id = this.Id_Inventarios.filter((x) => x == idInventario);
      if (exist.length > 0 && exit_id.length > 0) {
        this._swalService.ShowMessage([
          'warning',
          'Alerta',
          'Ya este producto ha sido agregado a la lista!',
        ]);
        return false;
      } else {
        return true;
      }
    }
  }
  private SetearProductoDispensacion(p: any) {
    let producto = {
      Id_Producto: p.Id_Producto,
      Nombre: p.Nombre,
      Nombre_Comercial: p.Nombre_Comercial,
      Lote: p.Lote,
      Fecha_Vencimiento: p.Fecha_Vencimiento,
      Codigo_Cum: p.Codigo_Cum,
      Cantidad_Disponible: p.Cantidad_Disponible,
      Cantidad_Formulada: null,
      Cantidad_Entregada: null,
      Cantidad_Minima: p.Cantidad_Minima,
      Costo: p.Costo,
      Id_Inventario_Nuevo: p.Id_Inventario_Nuevo,
    };

    return producto;
  }

  AgregarProductosTabla() {
    if (this.ProductosAgregar.length == 0) {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe escoger un producto de la lista primero!',
      ]);
      return;
    } else {
      this.AgregarProductos.emit({
        productList: this.ProductosAgregar,
        dynamicList: this.dynamicColumns,
      });
      this.CerrarModal();
    }
  }

  private SetearProducto(producto: any) {
    let product: any = new ProductoCargarRemision();

    for (var key in producto) {
      if (key != 'Codigo_Cum' && key != 'Seleccionado' && key != 'Cantidad_Requerida') {
        if (key == 'Lotes') {
          product[key] = this.SetearLotes(producto[key]);
        } else if (key == 'Cantidad') {
          if (producto[key] == '') {
            product[key] = null;
          } else {
            product[key] = parseInt(producto[key]);
          }
        } else {
          if (!isNaN(parseInt(producto[key]))) {
            product[key] = producto[key];
          } else {
            product[key] = producto[key];
          }
        }
      } else {
        product[key] = producto[key];
      }
    }
    return product;
  }

  private SetearLotes(lotes: Array<any>) {
    let lotes_nuevos = new Array<any>();

    lotes.forEach((lote) => {
      let lote_nuevo = {};

      for (var key in lote) {
        if (key != 'Fecha_Vencimiento' && key != 'Lote') {
          lote_nuevo[key] = parseInt(lote[key]);
        } else {
          lote_nuevo[key] = lote[key];
        }
      }

      lotes_nuevos.push(lote_nuevo);
    });

    return lotes_nuevos;
  }

  AsignarValorSinInventario() {
    var check = $('#sin-inventario').is(':checked');
    this.Filtros.Inv = check;
  }

  private VerificarSeleccionado(): boolean {
    if (this._productoAgregar == null) {
      return true;
    } else {
      return false;
    }
  }
  LimpiarModelo() {
    this.ListaProductos = [];
    this.ListaAgregados = [];
    this.Id_Inventarios = [];
    this.ProductosAgregar = [];
    this.Filtros = {
      nombre: '',
      cum: '',
      lab_com: '',
      Inv: '',
    };
    this.Codigo_Barras = '';
    //this._productoAgregar = null;
  }

  CerrarModal() {
    this.modalService.dismissAll();
    this.LimpiarModelo();
    this.LimpiarCodBarras.emit();
  }
}
