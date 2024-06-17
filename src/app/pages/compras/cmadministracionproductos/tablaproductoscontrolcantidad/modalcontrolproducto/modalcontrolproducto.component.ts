import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { GeneralService } from 'src/app/services/general.service';
import { ProductoService } from '../../producto.service';
import { ControlProductoVerModel } from '../../ControlProductoVerModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { AutomaticSearchComponent } from '../../../../../shared/components/automatic-search/automatic-search.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-modalcontrolproducto',
  templateUrl: './modalcontrolproducto.component.html',
  styleUrls: ['./modalcontrolproducto.component.scss'],
  standalone: true,
  imports: [
    ModalComponent,
    AutomaticSearchComponent,
    TableComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class ModalcontrolproductoComponent implements OnInit {
  @ViewChild('ModalControlProductos') ModalControlProductos: any;

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  public ListaProductos: Array<any> = [];
  public ProductoControlado: ControlProductoVerModel = new ControlProductoVerModel();
  public Cargando: boolean = false;
  public openSubscription: any;
  public Edicion: boolean = false;
  private _idControlEdicion: string = '';
  private _accion: string = '';

  public Filtros: any = {
    nombre: '',
    cum: '',
    invima: '',
  };

  constructor(
    private _swalService: SwalService,
    private _generalService: GeneralService,
    private _productoService: ProductoService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: any) => {
      if (data.accion == 'editar') {
        this._accion = data.accion;
        this._idControlEdicion = data.id_controlado;
        this.Edicion = true;
        this.GetDetalleControlado();
        this.modalService.open(this.ModalControlProductos, { size: 'lg' });
      } else {
        this._accion = data.accion;
        this.Edicion = false;
        this.modalService.open(this.ModalControlProductos, { size: 'lg' });
      }
    });
  }

  private _limpiarModelo() {
    this.ListaProductos = [];
    this.ProductoControlado = new ControlProductoVerModel();
    this.Filtros = {
      nombre: '',
      cum: '',
      invima: '',
    };
    this._idControlEdicion = '';
    this._accion = '';
    this.Edicion = false;
  }

  public CerrarModal() {
    this.modalService.dismissAll();
    this._limpiarModelo();
  }

  private _setFiltros() {
    let params: any = {};

    params.tipo_consulta = 'controlado';

    if (this._accion == 'editar') {
      params.inclusion = false;
    } else {
      params.inclusion = true;
    }

    if (this.Filtros.nombre.trim() != '') {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.cum.trim() != '') {
      params.cum = this.Filtros.cum;
    }

    if (this.Filtros.invima.trim() != '') {
      params.invima = this.Filtros.invima;
    }

    return params;
  }

  public ConsultaFiltrada() {
    if (this.Edicion) {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'No puede consultar productos cuando esta editando!',
      ]);
      return;
    } else {
      let params = this._setFiltros();

      this.Cargando = true;
      this._productoService.getListaProductos(params).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.ListaProductos = data.query_result;
          setTimeout(() => {
            this._marcarProductoControlado();
          }, 300);
        } else {
          this.ListaProductos = [];
          let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        }

        this.Cargando = false;
      });
    }
  }

  public SeleccionarProducto(seleccionado: any, idProducto: any, producto: any) {
    if (seleccionado == '0') {
      this.ProductoControlado = new ControlProductoVerModel();
      this.ProductoControlado.Id_Producto = producto.Id_Producto;
      this.ProductoControlado.Nombre_Producto = producto.Nombre_Comercial;
      this.ProductoControlado.Principio_Activo = producto.Principio_Activo;
      this.ProductoControlado.Codigo_Cum = producto.Codigo_Cum;
      this.ProductoControlado.Cantidad_Presentacion = producto.Cantidad_Presentacion;

      if (this._getSeleccionados() == 0) {
        let ind = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);
        if (ind > -1) {
          this.ListaProductos[ind].Seleccionado = '1';
        }
      } else {
        let ind_selected = this.ListaProductos.findIndex((x) => x.Seleccionado == '1');
        if (ind_selected > -1) {
          this.ListaProductos[ind_selected].Seleccionado = '0';
        }

        let ind = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);
        if (ind > -1) {
          this.ListaProductos[ind].Seleccionado = '1';
        }
      }
      // if(this._verificarProductoAgregado(idProducto)) {
      //   this.ProductoControlado.Id_Producto = producto.Id_Producto;
      //   this.ProductoControlado.Nombre_Producto = producto.Nombre_Comercial;
      //   this.ProductoControlado.Principio_Activo = producto.Principio_Activo;
      //   this.ProductoControlado.Codigo_Cum = producto.Codigo_Cum;
      //   this.ProductoControlado.Cantidad_Presentacion = producto.Cantidad_Presentacion;
      // }else{
      //   this.ProductoControlado = new ControlProductoVerModel();
      //   this.ProductoControlado.Id_Producto = producto.Id_Producto;
      //   this.ProductoControlado.Nombre_Producto = producto.Nombre_Comercial;
      //   this.ProductoControlado.Principio_Activo = producto.Principio_Activo;
      //   this.ProductoControlado.Codigo_Cum = producto.Codigo_Cum;
      //   this.ProductoControlado.Cantidad_Presentacion = producto.Cantidad_Presentacion;
      // }

      // let ind = this.ListaProductos.findIndex(x => x.Id_Producto == idProducto);

      // if (ind > -1) {
      //   this.ListaProductos[ind].Seleccionado = '1';
      // }
    } else {
      if (this._verificarProductoAgregado(idProducto)) {
        this.ProductoControlado = new ControlProductoVerModel();
      } else {
        this.ProductoControlado = new ControlProductoVerModel();
        this.ProductoControlado.Id_Producto = producto.Id_Producto;
        this.ProductoControlado.Nombre_Producto = producto.Nombre_Comercial;
        this.ProductoControlado.Principio_Activo = producto.Principio_Activo;
        this.ProductoControlado.Codigo_Cum = producto.Codigo_Cum;
        this.ProductoControlado.Cantidad_Presentacion = producto.Cantidad_Presentacion;
      }
      let ind = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);

      if (ind > -1) {
        this.ListaProductos[ind].Seleccionado = '0';
      }
    }

    //this.SelectedProducts = this.ProductosAsociados.length;
  }

  private GetDetalleControlado() {
    this._productoService.GetDetalleControlado(this._idControlEdicion).subscribe((data: any) => {
      this.ProductoControlado = data;
    });
  }

  private _getSeleccionados() {
    let seleccionados = this.ListaProductos.filter((x) => x.Seleccionado == '1');
    return seleccionados.length;
  }

  private _verificarProductoAgregado(idProducto: string) {
    return this.ProductoControlado.Id_Producto == parseInt(idProducto);
  }

  private _marcarProductoControlado() {
    let index = this.ListaProductos.findIndex(
      (x) => x.Id_Producto == this.ProductoControlado.Id_Producto,
    );

    if (index > -1) {
      this.ListaProductos[index].Seleccionado = '1';
    }
  }

  public EliminarAsignado(idProducto: string) {
    this.ProductoControlado = new ControlProductoVerModel();
    let index2 = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);
    if (index2 > -1) {
      this.ListaProductos[index2].Seleccionado = '0';
    }
  }

  public GuardarControl() {
    if (!this._validateBeforeSubmit()) {
      return;
    } else {
      let data = new FormData();
      data.append(
        'producto_controlado',
        this._generalService.normalize(JSON.stringify(this.ProductoControlado)),
      );

      if (this._accion == 'editar') {
        data.append('id_controlado', this._idControlEdicion);
        this._productoService.ActualizarProductoControlado(data).subscribe((data: any) => {
          if (data.codigo == 'success') {
            let toastObj = {
              textos: [data.titulo, data.mensaje],
              tipo: data.codigo,
              duracion: 4000,
            };
            this.CerrarModal();
            setTimeout(() => {
              this.ActualizarTabla.emit();
            }, 300);
          } else {
            this._swalService.ShowMessage(data);
          }
        });
      } else {
        this._productoService.GuardarProductosControlado(data).subscribe((data: any) => {
          if (data.codigo == 'success') {
            let toastObj = {
              textos: [data.titulo, data.mensaje],
              tipo: data.codigo,
              duracion: 4000,
            };
            this.CerrarModal();
            setTimeout(() => {
              this.ActualizarTabla.emit();
            }, 300);
          } else {
            this._swalService.ShowMessage(data);
          }
        });
      }
    }
  }

  private _validateBeforeSubmit(): boolean {
    if (this.ProductoControlado.Cantidad_Minima == 0) {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe colocar la cantidad minima para guardar!',
      ]);
      return false;
    }
    // else if (this.ProductoControlado.Cantidad_Maxima == 0) {
    //   this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar la cantidad maxima para guardar!']);
    //   return false;
    // }
    else {
      return true;
    }
  }

  public ValidarNumeroMultiplo(cantidad: number, tipo: string) {
    // if (this.ProductoControlado.Multiplo == 0) {
    //   this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar ']);
    // }

    if (cantidad != undefined) {
      if (cantidad != 0) {
        if (this.ProductoControlado.Multiplo != 0) {
          if (cantidad % this.ProductoControlado.Multiplo != 0) {
            this.ProductoControlado.Cantidad_Minima = 0;
            // if (tipo == 'minima') {
            //   this.ProductoControlado.Cantidad_Minima = 0;
            // }else{
            //   this.ProductoControlado.Cantidad_Maxima = 0;
            // }
            this._swalService.ShowMessage([
              'warning',
              'Alerta',
              'La cantidad colocada debe ser multiplo de ' + this.ProductoControlado.Multiplo + '!',
            ]);
          }
          // else{
          //   //this.ValidarCantidadMinimaMaxima(tipo);
          // }
        } else {
          this.ProductoControlado.Cantidad_Minima = 0;
          // if (tipo == 'minima') {
          //   this.ProductoControlado.Cantidad_Minima = 0;
          // }else{
          //   this.ProductoControlado.Cantidad_Maxima = 0;
          // }
          this._swalService.ShowMessage([
            'warning',
            'Alerta',
            'Debe colocar un valor multiplo antes de llenar las cantidades mínima y máxima!',
          ]);
        }
      } else {
        this._swalService.ShowMessage([
          'warning',
          'Alerta',
          'Debe colocar una cantidad mayor a 0!',
        ]);
      }
    } else {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar una cantidad mayor a 0!']);
    }
  }

  onSaveControl(): void {
    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Se dispone a guardar esta configuracion de producto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Guardar',
      cancelButtonText: 'No, Comprobar!',
      preConfirm: () => this.GuardarControl(),
    });
  }

  // public ValidarCantidadMinimaMaxima(tipo:string){
  //   if (this.ProductoControlado.Cantidad_Maxima != 0 && this.ProductoControlado.Cantidad_Minima > this.ProductoControlado.Cantidad_Maxima) {
  //     if (tipo == 'minima') {
  //       this.ProductoControlado.Cantidad_Minima = 0;
  //       this._swalService.ShowMessage(['warning', 'Alerta', 'La cantidad mínima no puede ser mayor a la cantidad máxima!']);
  //     }else{
  //       this.ProductoControlado.Cantidad_Maxima = 0;
  //       this._swalService.ShowMessage(['warning', 'Alerta', 'La cantidad máxima no puede ser menor a la cantidad mínima!']);
  //     }
  //   }
  // }
}
