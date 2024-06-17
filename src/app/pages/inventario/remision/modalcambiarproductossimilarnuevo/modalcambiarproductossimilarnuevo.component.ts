import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalcambiarproductossimilarnuevo',
  templateUrl: './modalcambiarproductossimilarnuevo.component.html',
  styleUrls: ['./modalcambiarproductossimilarnuevo.component.scss'],
  standalone: true,
  imports: [ModalBasicComponent, NgIf, NgFor, NgClass, ModalComponent],
})
export class ModalcambiarproductossimilarnuevoComponent implements OnInit {
  @ViewChild('ModalCambiarProductoSimilar') ModalCambiarProductoSimilar: any;

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() AgregarProductos: EventEmitter<any> = new EventEmitter();

  public ListaProductos: Array<any> = [];
  public ListaAgregados: Array<any> = [];
  public ProductoCambiar: any = null;
  public ProductoAgregar: any = null;
  private _posicionLista: string = '';
  private _rotativoModel: any = null;
  private _Mes: any = null;
  private _Grupo: any = null;

  public Cargando: boolean = false;
  public openSubscription: any;
  public alertOption: SweetAlertOptions = {
    title: '¿Está totalemente Seguro?',
    text: 'Se dispone a cambiar este producto por uno de sus asociados, esta acción es irreversible!',
    showCancelButton: true,
    cancelButtonText: 'No, Comprobar!',
    confirmButtonText: 'Si, Cambiar',
    showLoaderOnConfirm: true,
    focusCancel: true,
    // type: 'info',
    preConfirm: () => {
      return new Promise((resolve) => {
        this.RegistrarCambioEnBaseDeDatos();
      });
    },
    allowOutsideClick: () => !swal.isLoading(),
  };

  constructor(
    // public generalService: GeneralService,
    private _swalService: SwalService,
    private readonly modalService: NgbModal,
    // private _toastService: ToastService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data: any) => {
      //this.ListaAgregados = data.agregados;
      this.Cargando = true;
      this.ListaProductos = data.producto.Similares;
      this._posicionLista = data.pos;
      this._rotativoModel = data.rotativo_model;
      this.ProductoCambiar = data.producto;
      this._Mes = data.mes;
      this._Grupo = data.grupo;
      this.modalService.open(this.ModalCambiarProductoSimilar, { size: 'lg' });
      this.Cargando = false;
    });
  }

  ngOnDestroy() {
    if (this.openSubscription != undefined) {
      this.openSubscription.unsubscribe();
    }

    this.CerrarModal();
  }

  onChangeProduct() {
    this._swalService.customAlert(this.alertOption);
  }

  LimpiarModelo() {
    this.ListaProductos = [];
    this.ProductoAgregar = null;
    this.ProductoCambiar = null;
    this._rotativoModel = null;
    this._posicionLista = '';
    this._Mes = '';
    this._Grupo = '';
  }

  CerrarModal() {
    this.modalService.dismissAll();
    this.LimpiarModelo();
  }

  SeleccionarProducto(seleccionado: any, idProducto: any, producto: any) {
    if (seleccionado == '0') {
      if (!this.VerificarSeleccionado()) {
        this._swalService.ShowMessage([
          'warning',
          'Alerta',
          'No se puede seleccionar mas de 1 producto a la vez!',
        ]);
      } else {
        this.ProductoAgregar = producto;
        let ind = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);

        if (ind > -1) {
          this.ListaProductos[ind].Seleccionado = '1';
        }
      }
    } else {
      this.ProductoAgregar = null;
      let ind = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);

      if (ind > -1) {
        this.ListaProductos[ind].Seleccionado = '0';
      }
    }
  }

  public CambiarProducto(data: any) {
    let datos = { pos: this._posicionLista, producto: data.producto, id_cambio: data.id_cambio };
    this.AgregarProductos.emit(datos);
    this.CerrarModal();
  }

  private VerificarSeleccionado(): boolean {
    if (this.ProductoAgregar != null) {
      return false;
    } else {
      return true;
    }
  }

  public RegistrarCambioEnBaseDeDatos() {
    if (!this.ValidateBeforeSubmit()) {
      return;
    } else {
      let data = new FormData();
      let cantidad = 0;

      if (
        parseInt(this.ProductoCambiar.Cantidad_Requerida) >
        parseInt(this.ProductoAgregar.Cantidad_Disponible)
      ) {
        cantidad = this.ProductoAgregar.Cantidad_Disponible;
      } else {
        cantidad = this.ProductoCambiar.Cantidad_Requerida;
      }

      let model: any = {
        id_destino: this._rotativoModel.Id_Destino,
        id_origen: this._rotativoModel.Id_Origen,
        fini: this._rotativoModel.Fecha_Inicio,
        ffin: this._rotativoModel.Fecha_Fin,
        Id_Producto_Viejo: this.ProductoCambiar.Id_Producto,
        Id_Producto_Nuevo: this.ProductoAgregar.Id_Producto,
        Cantidad: cantidad,
        funcionario: environment.id_funcionario,
      };

      if (this._rotativoModel.Id_Eps != '') {
        model.eps = this._rotativoModel.Id_Eps;
      }
      let grupo: any = [];
      if (this._Grupo.Id_Grupo) {
        grupo = JSON.stringify(this._Grupo);
      }
      let mes = this._Mes;

      data.append('modelo', JSON.stringify(model));
      data.append('mes', mes);
      data.append('grupo', grupo);
      this.http
        .post('php/remision_nuevo/guardar_cambio_producto.php', { params: data })
        .subscribe((data: any) => {
          this.alertOption.text = data.mensaje;
          this.CambiarProducto(data);
        });
    }
  }

  private ValidateBeforeSubmit() {
    if (this.ProductoAgregar == null) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe escoger el producto a cambiar!']);
      return false;
    } else {
      return true;
    }
  }

  private VerificarAgregados(idProducto: string): boolean {
    let exist = this.ListaAgregados.filter((x) => x == idProducto);

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
  }
}
