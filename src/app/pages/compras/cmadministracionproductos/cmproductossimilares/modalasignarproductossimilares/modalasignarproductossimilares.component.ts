import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { GeneralService } from 'src/app/services/general.service';
import { ProductoService } from '../../producto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { AutomaticSearchComponent } from '../../../../../shared/components/automatic-search/automatic-search.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-modalasignarproductossimilares',
  templateUrl: './modalasignarproductossimilares.component.html',
  styleUrls: ['./modalasignarproductossimilares.component.scss'],
  standalone: true,
  imports: [ModalComponent, AutomaticSearchComponent, TableComponent],
})
export class ModalasignarproductossimilaresComponent implements OnInit {
  @ViewChild('ModalAsociarProductos') ModalAsociarProductos: any;

  @Input() AbrirModal: Observable<any> = new Observable();
  @Output() ActualizarTabla: EventEmitter<any> = new EventEmitter();

  public ListaProductos: Array<any> = [];
  public ProductosAsociadosGenerico: Array<any> = [];
  public ProductosAsociados: Array<any> = [];
  public Cargando: boolean = false;
  public CargandoGenericos: boolean = false;
  public openSubscription: any;
  public Edicion: boolean = false;
  private _idAsociadoEdicion: string = '';
  private _idAsociadogenericos: string = '';
  private _accion: string = '';

  public Filtros: any = {
    nombre: '',
    cum: '',
    invima: '',
  };
  public Filtros1: any = {
    pag: 1,
    tam: 10,
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
        this._idAsociadoEdicion = data.id_asociado;
        this.GetDetalleAsociado();
        this.modalService.open(this.ModalAsociarProductos, { size: 'xl' });
        this.Edicion = true;
        this._idAsociadogenericos = data.id_Genericos;
        this.ConsultaFiltradaGenericos(
          this._idAsociadogenericos != '' && this._idAsociadogenericos != '0',
        );
      } else {
        this._accion = data.accion;
        this.Edicion = false;
        this.modalService.open(this.ModalAsociarProductos, { size: 'xl' });
        this._idAsociadogenericos = '';
        this.ProductosAsociadosGenerico = [];
      }
    });
  }

  private _limpiarModelo() {
    this.ListaProductos = [];
    this.ProductosAsociados = [];
    this.Filtros = {
      nombre: '',
      cum: '',
      invima: '',
    };
    this._idAsociadoEdicion = '';
    this._accion = '';
    this.Edicion = false;
  }

  public CerrarModal() {
    this.modalService.dismissAll();
    this._limpiarModelo();
  }

  private _setFiltros() {
    let params: any = {};

    params.tipo_consulta = 'asociado';

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
    var params = this._setFiltros();

    this.Cargando = true;
    this._productoService.getListaProductos(params).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ListaProductos = data.query_result;
        setTimeout(() => {
          this._marcarProductosAsociados();
        }, 300);
      } else {
        this.ListaProductos = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
      }

      this.Cargando = false;
    });
  }

  public SeleccionarProducto(seleccionado: any, idProducto: any, producto: any) {
    if (seleccionado == '0') {
      if (this._verificarProductoAgregado(idProducto)) {
        this.ProductosAsociados.push(producto);
        let ind = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);

        if (ind > -1) {
          this.ListaProductos[ind].Seleccionado = '1';
        }
      } else {
        this._swalService.ShowMessage([
          'warning',
          'Alerta',
          '<Este Producto ya esta agregado a un asociacion!',
        ]);
      }
    } else {
      if (!this._verificarProductoAgregado(idProducto)) {
        let index = this.ProductosAsociados.findIndex((x) => x.Id_Producto == idProducto);
        this.ProductosAsociados.splice(index, 1);
        let ind = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);
        if (ind > -1) {
          this.ListaProductos[ind].Seleccionado = '0';
        }
      }
    }
  }

  private GetDetalleAsociado() {
    this._productoService.GetDetalleAsociado(this._idAsociadoEdicion).subscribe((data: any) => {
      this.ProductosAsociados = data;
    });
  }

  private _verificarProductoAgregado(idProducto: string) {
    let index = this.ProductosAsociados.findIndex((x) => x.Id_Producto == idProducto);
    return index == -1;
  }

  private _marcarProductosAsociados() {
    this.ListaProductos.forEach((p, i) => {
      let index = this.ProductosAsociados.findIndex((x) => x.Id_Producto == p.Id_Producto);

      if (index > -1) {
        this.ListaProductos[i].Seleccionado = '1';
      }
    });
  }

  public EliminarAsignado(idProducto: string) {
    let index = this.ProductosAsociados.findIndex((x) => x.Id_Producto == idProducto);
    this.ProductosAsociados.splice(index, 1);
    let index2 = this.ListaProductos.findIndex((x) => x.Id_Producto == idProducto);
    if (index2 > -1) {
      this.ListaProductos[index2].Seleccionado = '0';
    }
  }

  public GuardarAsociacion() {
    if (!this._validateBeforeSubmit()) {
      return;
    } else {
      let data = new FormData();
      data.append(
        'productos_asociados',
        this._generalService.normalize(JSON.stringify(this.ProductosAsociados)),
      );
      data.append('id_genericos', this._idAsociadogenericos);

      if (this._accion == 'editar') {
        data.append('id_asociado', this._idAsociadoEdicion);
        this._productoService.ActualizarProductosAsociados(data).subscribe((data: any) => {
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
        this._productoService.GuardarProductosAsociados(data).subscribe((data: any) => {
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
    if (this.ProductosAsociados.length == 0) {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe cargar productos asociados para guardar!',
      ]);
      return false;
    } else if (this.ProductosAsociados.length < 2) {
      this._swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe cargar mas de 1 producto para realizar una asociación!',
      ]);
      return false;
    } else {
      return true;
    }
  }

  /**
   * Consulta la base de datos para traer una lista con los grupos asociados
   * @param tiene_asociado Si el grupo ya trae asociado un grupo de genericos
   */
  public ConsultaFiltradaGenericos(tiene_asociado = false) {
    if (tiene_asociado) {
      this.Filtros1.nombre = '';
      this.Filtros1.cum = '';
      this.Filtros1.invima = '';
      this.Filtros1.id_producto_asociado = this._idAsociadogenericos;
    } else {
      this.Filtros1.id_producto_asociado = '';
    }

    this.CargandoGenericos = true;
    this._productoService.GetListaProductosAsociados(this.Filtros1).subscribe((data: any) => {
      let array: any[] = data.query_result.filter(
        (res) => res.Id_Producto_Asociado != this._idAsociadoEdicion,
      );
      let arr2 = this.mapGenericos(array);
      this.ProductosAsociadosGenerico = arr2;
      this.seleccionarGrupoGenerico(this._idAsociadogenericos);
      this.CargandoGenericos = false;
    });
  }

  /**
   *
   * @param listaGenericos
   * @returns
   */
  mapGenericos(listaGenericos) {
    let listaProductoGenerico = listaGenericos.map((generico) => {
      let grupo: any[] = generico.Productos_Asociados;
      let pGrupo = {
        select: false,
        Id_Producto_Asociado: generico.Id_Producto_Asociado,
        Nombre_Comercial: grupo[0].Nombre_Comercial,
        Codigo_Cum: grupo[0].Codigo_Cum + ' y ' + (grupo.length - 1) + ' mas ',
      };
      return pGrupo;
    });
    return listaProductoGenerico;
  }

  seleccionarGrupoGenerico(id) {
    this.ProductosAsociadosGenerico.forEach((pa) => {
      if (pa.Id_Producto_Asociado == id) {
        pa.select = !pa.select;
      } else {
        pa.select = false;
      }
    });
    let seleccionado = this.ProductosAsociadosGenerico.filter((pg) => pg.select === true);
    this._idAsociadogenericos = seleccionado[0] ? seleccionado[0].Id_Producto_Asociado : '';
  }

  onSaveProduct(): void {
    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Se dispone a guardar esta asociación de producto similares!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Guardar',
      cancelButtonText: 'No, Comprobar!',
      preConfirm: () => this.GuardarAsociacion(),
    });
  }
}
