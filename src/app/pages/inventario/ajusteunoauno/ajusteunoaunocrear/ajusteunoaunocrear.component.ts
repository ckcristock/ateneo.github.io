import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { NgStyle, NgIf } from '@angular/common';
import { AutocompleteMdlComponent } from '../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-ajusteunoaunocrear',
  templateUrl: './ajusteunoaunocrear.component.html',
  styleUrls: ['./ajusteunoaunocrear.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    AutocompleteMdlComponent,
    NgStyle,
    AutomaticSearchComponent,
    TableComponent,
    NgIf,
    ModalComponent,
  ],
})
export class AjusteunoaunocrearComponent implements OnInit {
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  @ViewChild('modalLotes') modalLotes: any;
  @ViewChild('modalAnular') modalAnular: any;
  @ViewChild('FormEntrada') private FormEntrada: NgForm;
  @ViewChild('FormSalida') private FormSalida: NgForm;
  @ViewChild('bodegaSelected') bodegaSelected: ElementRef;

  @ViewChild('confirmacionExitosoSwal') confirmacionExitosoSwal: any;
  @ViewChild('valor_punto') valor_punto: any;
  public alertOption: SweetAlertOptions = {};
  public alertOptionEntrada: SweetAlertOptions = {};
  public alertOptionSalida: SweetAlertOptions = {};
  public alertOptionExitoso: SweetAlertOptions = {};
  public ListaProductoBusqueda: any[];
  public ListaProductoSalida: any[] = [];
  public Lista_Productos: any[] = [];
  public Lista_Productos_Salida: any[] = [];
  public Productos = '';
  public Producto_Salida: any = {};
  public temporal = '';
  public Tipo_Inventario = '';
  public Nombre = '';
  public Laboratorio = '';
  public bodegas: any[] = [];
  public estibasRemplazo: any[] = [];
  public estibas: any[] = [];
  public estiba: any;
  public TipoSelected;
  public Clase_Ajuste_Individual = [
    { Id_Clase_Ajuste_Individual: 1, Descripcion: 'Sobrante o Faltante' },
    {
      Id_Clase_Ajuste_Individual: 5,
      Descripcion: 'Correccion errores de ingreso en actas de entrada e inventario físico',
    },
  ];

  public puntos: Array<any>;
  public punto: any = '';
  public Lotes: any[] = [];
  public display_bodega = 'block';
  public display_punto = 'none';
  public display_bodega_salida = 'block';
  public display_punto_salida = 'none';
  public Fecha = new Date();
  public User = JSON.parse(localStorage.getItem('User'));
  public perfilUsuario: any = localStorage.getItem('miPerfil');
  public TipoAjuste: any = '';
  public Fecha_minima: any = '';
  public Fecha_Actual: any = '';
  public Ajustes: any = [];
  public CargandoEnt: boolean = false;

  public filtro_cod: string = '';
  public filtro_cli: string = '';
  public filtro_fun: string = '';
  public filtro_tipo: string = '';
  public filtro_bodega: string = '';
  public filtro_fecha: any = '';
  public page = 1;
  public maxSize = 10;
  public TotalItems: number;
  // private Identificacion_Funcionario = JSON.parse(localStorage.getItem('User'))
  //   .Identificacion_Funcionario;
  private Id_Punto: any = localStorage.getItem('Punto');

  public ModelAnular: any = {
    Funcionario_Anula: '',
    Observacion_Anulacion: '',
  };

  public Id_Ajuste: any = '';

  myDateRangePickerOptions: any = {
    width: '100px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  ClaseAjustes: any = [];

  globales = environment;

  userId: any = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private readonly userService: UserService,
    private readonly modalService: NgbModal,
  ) {
    this.userId = userService.user.person.identifier;
    this.ModelAnular.Funcionario_Anula = this.userId;
    this.alertOptionEntrada = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar el ajuste de Inventario',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarInformacion(this.FormEntrada);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };

    this.alertOptionSalida = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar Esta salida de Inventario',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarInformacion(this.FormSalida);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };

    this.alertOptionExitoso = {
      title: 'Operación exitosa',
      text: 'Se ha guarda correctamente el ajuste de los productos',
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      icon: 'success',
      allowOutsideClick: false,
      preConfirm: () => {
        return new Promise((resolve) => {
          this.router.navigate(['/ajusteunoauno']);
        });
      },
    };

    let Fecha: any = new Date();
    Fecha.setMonth(Fecha.getMonth() + 18);

    let Fecha_min: any = new Date(Fecha);
    let mes = Fecha_min.getMonth() < 10 ? '0' + Fecha_min.getMonth() : Fecha_min.getMonth();
    let dia = Fecha_min.getDate() < 10 ? '0' + Fecha_min.getDate() : Fecha_min.getDate();
    Fecha_min = Fecha_min.getFullYear() + '-' + mes + '-' + dia;
    this.Fecha_minima = Fecha_min;

    this.SetFechaMinimaVencimiento();
  }

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.ListaProductoBusqueda.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );
  formatter1 = (x: { Nombre: string }) => x.Nombre;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.ListaProductoSalida.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );
  formatter = (x: { Nombre: string }) => x.Nombre;

  ngOnInit() {}

  onSaveInfo(): void {
    Swal.fire(this.alertOptionEntrada);
  }

  openModalLots(modal: any): void {
    this.modalService.open(modal, { size: 'lg' });
  }

  ListarLotes() {
    if (this.Producto_Salida.Lotes != '' && this.Producto_Salida.Lotes != undefined) {
      var pos = this.Lista_Productos_Salida.findIndex(
        (x) => x.Id_Producto == this.Producto_Salida.Id_Producto,
      );
      if (pos >= 0) {
        //busco si existen lotes agregados iguales para que no puedan seleccionarlos de nuevo
        for (let index = 0; index < this.Producto_Salida.Lotes.length; index++) {
          let p = this.Producto_Salida.Lotes[index];

          let posicion = this.Lista_Productos_Salida.findIndex((data) => data.Lote == p.Lote);
          if (posicion >= 0) {
            this.Producto_Salida.Lotes[index]['disabled'] = true;
          } else {
            this.Producto_Salida.Lotes[index]['disabled'] = false;
          }
        }
        this.Lotes = this.Producto_Salida.Lotes;
        this.Nombre = this.Producto_Salida.Nombre;
        this.modalLotes.show();
      } else {
        //todos los lotes pueden ser seleccionado
        this.Producto_Salida.Lotes.forEach((element) => (element['disabled'] = false));

        this.Lotes = this.Producto_Salida.Lotes;
        this.Nombre = this.Producto_Salida.Nombre;
        this.modalLotes.show();
      }
    }
  }

  ListarProductosEntrada() {
    this.SetearVariables();
    if (this.TipoAjuste == 'Entrada') {
      this.CargandoEnt = true;
      this.http
        .get(this.globales.ruta + 'php/ajuste_individual_nuevo/lista_productos_entrada.php')
        .subscribe((data: any) => {
          this.CargandoEnt = false;
          this.ListaProductoBusqueda = data;
        });
    } else if (this.TipoAjuste == 'Cambio') {
      this.Tipo('Bodega');
    }
  }

  validarLoteEntrada(i, producto) {
    this.Lista_Productos.forEach((p, index) => {
      if (p.Id_Producto == producto.Id_Producto && p.Lote == producto.Lote && index != i) {
        this.confirmacionSwal.title = 'Error!';
        this.confirmacionSwal.text =
          'Existe el mismo producto y lote agregado anteriormente por favor revise.';
        this.confirmacionSwal.type = 'error';
        this.confirmacionSwal.show();
        producto.Lote = '';
      }
    });
  }

  ListarProductos(Id_Producto) {
    if (Id_Producto != '') {
      var posicion = this.ListaProductoBusqueda.findIndex((x) => x.Id_Producto === Id_Producto);

      if (posicion >= 0) {
        // //

        if (this.Lista_Productos.length == 0) {
          let prod = Object.assign({}, this.ListaProductoBusqueda[posicion]);
          this.Lista_Productos.push(prod);
        } else {
          let model: any = {
            Id_Producto: this.ListaProductoBusqueda[posicion].Id_Producto,
            Nombre: this.ListaProductoBusqueda[posicion].Nombre,
            Nombre_Producto: this.ListaProductoBusqueda[posicion].Nombre_Producto,
            Embalaje: this.ListaProductoBusqueda[posicion].Embalaje,
            Codigo_Cum: this.ListaProductoBusqueda[posicion].Codigo_Cum,
            Laboratorio_Comercial: this.ListaProductoBusqueda[posicion].Laboratorio_Comercial,
            Lote: '',
            Cantidad: '',
            Costo: this.ListaProductoBusqueda[posicion].Costo,
            Fecha_Vencimiento: '',
            Observaciones: '',
          };

          this.Lista_Productos.push(model);
        }

        this.Productos = '';
      }
    }
  }

  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++) mapping[from.charAt(i)] = to.charAt(i);

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

  GuardarInformacion(formulario: NgForm) {
    if (this.TipoAjuste == 'Entrada') {
      this.GuardarEntrada(formulario);
    } else if (this.TipoAjuste == 'Salida' || this.TipoAjuste == 'Cambio') {
      this.GuardarSalida(formulario);
    } else if (this.TipoAjuste == 'Lotes') {
      this.GuardarLotes(formulario);
    }
  }
  GuardarLotes(formulario) {
    if (this.validarProductos(this.Lista_Productos_Salida)) {
      let prod = this.normalize(JSON.stringify(this.Lista_Productos_Salida));
      let data = this.normalize(JSON.stringify(formulario.value));
      let datos = new FormData();
      datos.append('productos', prod);
      datos.append('datos', data);
      datos.append('funcionario', this.userId);
      datos.append('tipo_ajuste', this.TipoAjuste);
      this.http
        .post(this.globales.ruta + 'php/ajuste_individual_nuevo/guardar_lotes.php', datos)
        .subscribe((data: any) => {
          if (data.tipo == 'success') {
            this.confirmacionExitosoSwal.show();
          } else {
            this.confirmacionSwal.title = data.titulo;
            this.confirmacionSwal.text = data.mensaje;
            this.confirmacionSwal.type = data.tipo;
            this.confirmacionSwal.show();
            this.Lista_Productos_Salida = [];
          }
        });
    } else {
      this.confirmacionSwal.title = 'Datos Inválidos';
      this.confirmacionSwal.text = 'Todos los campos del producto son obligatorios';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
    }
  }
  ValidarLote(producto) {
    length;
    producto.Lote_Nuevo = producto.Lote_Nuevo.trim();
    if (producto.Lote_Nuevo.length <= 3) {
      this.confirmacionSwal.title = 'Error!';
      this.confirmacionSwal.text = 'La longitud del lote ingresado debe ser mayor a tres.';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();

      producto.Lote_Nuevo = '';
    }
  }
  GuardarSalida(formulario: NgForm) {
    if (this.validarProductos(this.Lista_Productos_Salida)) {
      let prod = this.normalize(JSON.stringify(this.Lista_Productos_Salida));
      let data = this.normalize(JSON.stringify(formulario.value));
      let datos = new FormData();
      datos.append('productos', prod);
      datos.append('datos', data);
      datos.append('funcionario', this.userId);
      datos.append('tipo_ajuste', this.TipoAjuste);
      this.http
        .post(this.globales.ruta + 'php/ajuste_individual_nuevo/guardar_salida.php', datos)
        .subscribe((data: any) => {
          if (data.tipo == 'success') {
            this.confirmacionExitosoSwal.show();
          } else {
            this.confirmacionSwal.title = data.titulo;
            this.confirmacionSwal.text = data.mensaje;
            this.confirmacionSwal.type = data.tipo;
            this.confirmacionSwal.show();
            this.Lista_Productos_Salida = [];
          }
        });
    } else {
      this.confirmacionSwal.title = 'Datos Inválidos';
      this.confirmacionSwal.text = 'Todos los campos del producto son obligatorios';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
    }
  }

  GuardarEntrada(formulario: NgForm) {
    if (this.validarProductos(this.Lista_Productos)) {
      let prod = this.normalize(JSON.stringify(this.Lista_Productos));
      let data = this.normalize(JSON.stringify(formulario.value));
      let datos = new FormData();
      datos.append('productos', prod);
      datos.append('datos', data);
      datos.append('funcionario', this.userId);
      datos.append('tipo_ajuste', this.TipoAjuste);
      this.http
        .post(this.globales.ruta + 'php/ajuste_individual_nuevo/guardar_entrada.php', datos)
        .subscribe((data: any) => {
          if (data.tipo == 'success') {
            this.confirmacionExitosoSwal.show();
          } else {
            this.confirmacionSwal.title = data.titulo;
            this.confirmacionSwal.text = data.mensaje;
            this.confirmacionSwal.type = data.tipo;
            this.confirmacionSwal.show();
            this.Lista_Productos = [];
          }
        });
    } else {
      this.confirmacionSwal.title = 'Datos Inválidos';
      this.confirmacionSwal.text = 'Todos los campos del producto son obligatorios';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
    }
  }

  validarProductos(productos: Array<any>) {
    let valido = true;
    for (const p of productos) {
      if (!p.Cantidad || !p.Fecha_Vencimiento || !p.Lote || !p.Observaciones) {
        valido = false;
        break;
      }
      if ((p.Costo == '' || p.Costo == '0' || p.Costo == '0.00') && this.TipoAjuste != 'Salida') {
        if ('Costo_Nuevo' in p) {
          valido =
            p.Costo_Nuevo == '' || !p.Costo_Nuevo || p.Costo_Nuevo == '0' || p.Costo_Nuevo == '0.00'
              ? false
              : true;
        } else {
          valido = false;
        }
      }

      if (this.TipoAjuste == 'Lotes') {
        if ('Fecha_Vencimiento_Nueva' in p) {
          valido = p.Fecha_Vencimiento_Nueva == '' || !p.Fecha_Vencimiento_Nueva ? false : true;
        } else {
          valido = false;
        }
      }

      if (this.TipoAjuste == 'Cambio') {
        if ('Nueva_Estiba' in p) {
          valido = p.Nueva_Estiba == '' || !p.Nueva_Estiba ? false : true;
        } else {
          valido = false;
        }
      }
    }
    return valido;
  }
  SetearVariables() {
    this.Lista_Productos_Salida = [];
    this.Lista_Productos = [];
    this.estibas = [];
    this.punto = '';

    //eliminar los valores del formulario
    this.FormEntrada.controls['Id_Bodega_Nuevo'].setValue('');
    this.FormEntrada.controls['Id_Clase_Ajuste_Individual'].setValue('');
  }
  Tipo(tipo) {
    this.SetearVariables();
    this.TipoSelected = tipo;
    if (tipo == 'Bodega') {
      this.http
        .get(this.globales.base_url + '/php/bodega_nuevo/get_bodegas.php', {
          params: { modulo: 'Bodega' },
        })
        .subscribe((data: any) => {
          this.bodegas = data.Bodegas;
          this.display_bodega = 'block';
          this.display_punto = 'none';
        });
    } else if (tipo == 'Punto') {
      this.http
        .get(this.globales.ruta + 'php/GENERALES/puntos/lista_puntos_dispensacion.php')
        .subscribe((data: any) => {
          this.puntos = data;
          this.display_punto = 'block';
          this.display_bodega = 'none';
        });
    }
  }

  BuscarEstiba(bodega) {
    this.estibas = [];
    this.estiba = '';
    this.varlidarBodegaEnInventario(bodega).then((ok) => {
      if (!ok) {
        if (this.TipoAjuste != 'Entrada') {
          this.http
            .get(`${this.globales.ruta}php/bodega_nuevo/get_estibas.php`, {
              params: { Id_Bodega_Nuevo: bodega, Select: 'true' },
            })
            .subscribe((res: any) => {
              this.estibas = res.data.map((stow) => ({
                value: stow.Id_Estiba,
                text: stow.Nombre,
              }));
            });
        }
      } else {
        this.bodegaSelected.nativeElement.value = '';
      }
    });
  }

  async varlidarBodegaEnInventario(Id_Bodega_Nuevo) {
    return await this.http
      .get(`${this.globales.ruta}php/bodega_nuevo/validar_bodega_en_inventario.php`, {
        params: { Id_Bodega_Nuevo: Id_Bodega_Nuevo },
      })
      .toPromise()
      .then((data: any) => {
        if (data.type == 'error') {
          this.confirmacionSwal.title = data.title;
          this.confirmacionSwal.text = data.message;
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.show();
          return true;
        } else {
          return false;
        }
      });
  }

  listarInventarioBodega(id) {
    //se envia el id estiba
    if (this.TipoAjuste == 'Salida' || this.TipoAjuste == 'Cambio') {
      this.http
        .get(this.globales.ruta + 'php/ajuste_individual_nuevo/lista_producto_inventario.php', {
          params: { tipo: 'Bodega', id: id },
        })
        .subscribe((data: any) => {
          this.ListaProductoSalida = data;
          this.Lista_Productos_Salida = [];
        });

      if (this.TipoAjuste == 'Cambio') {
        this.estibasRemplazo = this.estibas.filter((e) => e.Id_Estiba != id);
      }
    } else if (this.TipoAjuste == 'Lotes') {
      this.http
        .get(this.globales.ruta + 'php/ajuste_individual_nuevo/lista_productos_lotes.php', {
          params: { tipo: 'Bodega', id: id },
        })
        .subscribe((data: any) => {
          this.ListaProductoSalida = data;
        });
    }
  }
  listarInventarioPunto(id) {
    if (this.TipoAjuste == 'Salida') {
      this.http
        .get(this.globales.ruta + 'php/ajuste_individual_nuevo/lista_producto_inventario.php', {
          params: { tipo: 'Punto', id: id },
        })
        .subscribe((data: any) => {
          this.ListaProductoSalida = data;
        });
    } else {
      this.http
        .get(this.globales.ruta + 'php/ajuste_individual_nuevo/lista_productos_lotes.php', {
          params: { tipo: 'Punto', id: id },
        })
        .subscribe((data: any) => {
          this.ListaProductoSalida = data;
        });
    }
  }

  TipoSalida(tipo) {
    if (tipo == 'Bodega') {
      this.http
        .get(this.globales.base_url + '/php/lista_generales.php', {
          params: { modulo: 'Bodega' },
        })
        .subscribe((data: any) => {
          this.bodegas = data;
          this.display_bodega_salida = 'block';
          this.display_punto_salida = 'none';
        });
    } else if ((tipo = 'Punto')) {
      this.http
        .get(this.globales.ruta + 'php/GENERALES/puntos/lista_puntos_dispensacion.php')
        .subscribe((data: any) => {
          this.puntos = data;
          this.display_punto_salida = 'block';
          this.display_bodega_salida = 'none';
        });
    }
  }
  habilitarCampos(i) {
    var checkeado = (document.getElementById('check' + i) as HTMLInputElement).checked;

    ////

    switch (checkeado) {
      case true: {
        if (this.TipoAjuste == 'Salida' || this.TipoAjuste == 'Cambio') {
          var posicion = this.Lista_Productos_Salida.findIndex(
            (x) => x.Id_Inventario_Nuevo == this.Lotes[i].Id_Inventario_Nuevo,
          );
        } else if (this.TipoAjuste == 'Lotes') {
          var posicion = this.Lista_Productos_Salida.findIndex((x) => x.Lote == this.Lotes[i].Lote);
        }

        if (posicion < 0) {
          let prod = Object.assign({}, this.Lotes[i]);
          this.Lista_Productos_Salida.push(prod);
        } else {
          this.confirmacionSwal.title = 'Error';
          this.confirmacionSwal.text = 'Este Lote ya se encuentra en la lista, por favor revise';
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.show();
        }
        break;
      }
      case false: {
        if (this.TipoAjuste == 'Salida' || this.TipoAjuste == 'Cambio') {
          var posicion = this.Lista_Productos_Salida.findIndex(
            (x) => x.Id_Inventario_Nuevo == this.Lotes[i].Id_Inventario_Nuevo,
          );
        } else if (this.TipoAjuste == 'Lotes') {
          var posicion = this.Lista_Productos_Salida.findIndex((x) => x.Lote == this.Lotes[i].Lote);
        }

        if (posicion >= 0) {
          this.Lista_Productos_Salida.splice(posicion, 1);
        }
        break;
      }
    }
  }
  ValidarCantidad(cantidad, i) {
    if (parseInt(cantidad) > 0) {
      if (parseInt(cantidad) <= parseInt(this.Lista_Productos_Salida[i].Cantidad)) {
        this.Lista_Productos_Salida[i].Cantidad_Actual = cantidad;
      } else {
        this.confirmacionSwal.title = 'Error';
        this.confirmacionSwal.text = `La cantidad no puede ser mayor a la que se tiene en inventario (${this.Lista_Productos_Salida[i].Cantidad}). Por favor revise`;
        this.confirmacionSwal.type = 'error';
        this.confirmacionSwal.show();
        this.Lista_Productos_Salida[i].Cantidad_Actual = this.Lista_Productos_Salida[i].Cantidad;
      }
    } else {
      this.confirmacionSwal.title = 'Error';
      this.confirmacionSwal.text = 'La cantidad no puede ser igual a Cero, Por Favor revise';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
      this.Lista_Productos_Salida[i].Cantidad_Actual = this.Lista_Productos_Salida[i].Cantidad;
    }
  }
  limpiar_Producto_Salida() {
    this.Producto_Salida = [];
    this.Lotes = [];
  }
  EliminarProductoEnt(i, item) {
    if (i >= 0) {
      this.Lista_Productos.splice(i, 1);
    }
  }
  EliminarProducto(i) {
    this.Lista_Productos_Salida.splice(i, 1);
  }
  validarFechaVenc(value) {
    if (value < this.Fecha_minima) {
      this.confirmacionSwal.title = 'Error';
      this.confirmacionSwal.text = 'La fecha de vencimiento no puede ser menor a 18 meses.';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
      (document.getElementById('btn_guardar_entrada') as HTMLInputElement).disabled = true;
    } else {
      (document.getElementById('btn_guardar_entrada') as HTMLInputElement).disabled = false;
    }
  }
  capturarDigitacionEnt(pos) {
    let lote = (document.getElementById('Lote' + pos) as HTMLInputElement).value;
    let cantidad = (document.getElementById('Cantidad' + pos) as HTMLInputElement).value;
    let Costo = (document.getElementById('Costo' + pos) as HTMLInputElement).value;
    let fecha_vencimiento = (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement)
      .value;
    let observaciones = (document.getElementById('Observaciones' + pos) as HTMLInputElement).value;

    this.Lista_Productos[pos].Lote = lote;
    this.Lista_Productos[pos].Cantidad = cantidad;
    this.Lista_Productos[pos].Costo = Costo;
    this.Lista_Productos[pos].Fecha_Vencimiento = fecha_vencimiento;
    this.Lista_Productos[pos].Observaciones = observaciones;
  }

  isAdmin() {
    let miPerfil = localStorage.getItem('miPerfil');

    if (miPerfil == '16') {
      return true;
    }

    return false;
  }

  getFechaMaxima() {
    var Fecha_Hoy = new Date();
    var dia = new Date(Fecha_Hoy.setDate(Fecha_Hoy.getDate() + 3650));
    var Fecha_Maxima = dia.toISOString().split('T')[0];
    return Fecha_Maxima;
  }

  getFechaMinimaVenc() {
    var Fecha_Hoy = new Date();
    var dia = new Date(Fecha_Hoy.setDate(Fecha_Hoy.getDate() + 60));
    var Fecha_Maxima = dia.toISOString().split('T')[0];
    return Fecha_Maxima;
  }

  getFechaActualFormateada() {
    var Fecha_Hoy = new Date();
    var fecha_actual = Fecha_Hoy.toISOString().split('T')[0];
    return fecha_actual;
  }

  validarFecha(pos, producto) {
    if (producto.Fecha_Vencimiento != '') {
      let fecha_maxima_permitida = new Date(this.getFechaMaxima());
      let fecha_ingresada = new Date(producto.Fecha_Vencimiento);

      if (fecha_ingresada > fecha_maxima_permitida) {
        this.confirmacionSwal.title = 'Error!';
        this.confirmacionSwal.text = 'La Fecha de Vencimiento no es permitida.';
        this.confirmacionSwal.type = 'error';
        this.confirmacionSwal.show();

        producto.Fecha_Vencimiento = '';
      } else {
        let fecha_minima_venc = new Date(this.getFechaMinimaVenc());

        if (fecha_ingresada <= fecha_minima_venc) {
          this.confirmacionSwal.title = 'Error!';
          this.confirmacionSwal.text = 'La Fecha de Vencimiento debe ser superior a dos meses.';
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.show();
          producto.Fecha_Vencimiento = '';
        }
      }
    }
  }
  validarFechaNueva(pos, producto) {
    if (producto.Fecha_Vencimiento_Nueva != '') {
      let fecha_maxima_permitida = new Date(this.getFechaMaxima());
      let fecha_ingresada = new Date(producto.Fecha_Vencimiento_Nueva);

      if (fecha_ingresada > fecha_maxima_permitida) {
        this.confirmacionSwal.title = 'Error!';
        this.confirmacionSwal.text = 'La Fecha de Vencimiento no es permitida.';
        this.confirmacionSwal.type = 'error';
        this.confirmacionSwal.show();

        producto.Fecha_Vencimiento_Nueva = '';
      } else {
        let fecha_minima_venc = new Date(this.getFechaMinimaVenc());

        if (fecha_ingresada <= fecha_minima_venc) {
          this.confirmacionSwal.title = 'Error!';
          this.confirmacionSwal.text = 'La Fecha de Vencimiento debe ser superior a dos meses.';
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.show();
          producto.Fecha_Vencimiento_Nueva = '';
        }
      }
    }
  }

  validarFecha2(pos, fecha) {
    if (this.Id_Punto != 3) {
      // ESTA VALIDACIÓN ES TEMPORAL PARA DISPENSAR DESDE EL PUNTO DE PRO-H PRINCIPAL DISPENSACIONES DE MANTIS DEL AÑO 2018 CON PRODUCTOS QUE YA ESTÁN VENCIDOS -- ING. KENDRY 11/12/2019
      if (fecha != '') {
        let fecha_actual = this.getFechaActualFormateada();

        if (fecha < fecha_actual) {
          this.confirmacionSwal.title = 'Error!';
          this.confirmacionSwal.text =
            'La Fecha de Vencimiento debe ser superior a la fecha actual.';
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.show();
          (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).value = '';
          (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).focus();
        }
      }
    }
  }

  private SetFechaMinimaVencimiento() {
    let Fecha: any = new Date();
    Fecha.setDate(Fecha.getDate() + 1);

    let Fecha_min: any = new Date(Fecha);
    let mes = Fecha_min.getMonth() < 10 ? '0' + Fecha_min.getMonth() : Fecha_min.getMonth();
    let dia = Fecha_min.getDate() < 10 ? '0' + Fecha_min.getDate() : Fecha_min.getDate();
    Fecha_min = Fecha_min.getFullYear() + '-' + mes + '-' + dia;
    this.Fecha_Actual = Fecha_min;
  }

  public ConsultarCodigoBarras(codigoBarras: string) {
    if (codigoBarras != '') {
      let tipo = this.TipoSelected; // bodega || punto
      var valor_tipo;

      if (this.TipoAjuste == 'Entrada') {
        if (this.TipoSelected == 'Bodega') {
          valor_tipo = (document.getElementById('valor_bodega') as HTMLInputElement).value; // id bodega
        } else if (this.TipoSelected == 'Punto') {
          valor_tipo = this.punto; // id punto
        }
      } else if (this.TipoAjuste != 'Entrada') {
        if (this.TipoSelected == 'Bodega') {
          valor_tipo = this.estiba; // id estiba
        } else {
          valor_tipo = valor_tipo = this.punto; // id estiba
        }
      }

      this.http
        .get(this.globales.ruta + 'php/ajuste_individual_nuevo/producto_codigo_barras.php', {
          params: {
            codigo: codigoBarras,
            tipoAjuste: this.TipoAjuste,
            tipoSelected: tipo,
            id: '1',
          },
        })
        .subscribe((data: any) => {
          (document.getElementById('producto_pistoleado') as HTMLInputElement).value = ''; // Limpio el campo de codigo de barras...

          if (data.codigo == 'success') {
            if (this.TipoAjuste == 'Entrada') {
              let producto = {
                Id_Producto: data.query_result.Id_Producto,
                Nombre_Producto: data.query_result.Nombre_Comercial,
                Embalaje: data.query_result.Embalaje,
                Laboratorio_Comercial: data.query_result.Laboratorio_Comercial,
                Lote: '',
                Cantidad_Actual: '',
                Fecha_Vencimiento: '',
                Observaciones: '',
                Costo: data.query_result.Costo,
              };

              this.Lista_Productos.push(producto);
              localStorage.setItem('Lista_Producto', JSON.stringify(this.Lista_Productos));
              setTimeout(() => {
                this.SetFocusPistolear();
              }, 100);
            } else {
              this.Producto_Salida = data.query_result;

              if (this.Producto_Salida.Lotes != '' && this.Producto_Salida.Lotes != undefined) {
                var pos = this.Lista_Productos_Salida.findIndex(
                  (x) => x.Id_Producto == this.Producto_Salida.Id_Producto,
                );
                if (pos >= 0) {
                  this.confirmacionSwal.title = 'Error';
                  this.confirmacionSwal.text = 'Este Producto ya se encuentra en la lista';
                  this.confirmacionSwal.type = 'error';
                  this.confirmacionSwal.show();
                  this.Producto_Salida = '';
                } else {
                  this.Lotes = this.Producto_Salida.Lotes;
                  this.Nombre = this.Producto_Salida.Nombre;
                  this.modalLotes.show();
                }
              }
            }
          } else {
            this.confirmacionSwal.title = 'No existe';
            this.confirmacionSwal.html =
              'El código de barras ingresado: ' +
              codigoBarras +
              ' no corresponde a ningun de los productos registrados en nuestra Base de Datos';
            this.confirmacionSwal.type = 'error';
            this.confirmacionSwal.show();
          }
        });
    }
  }

  private SetFocusPistolear() {
    (document.getElementById('producto_pistoleado') as HTMLInputElement).focus();
  }
}
