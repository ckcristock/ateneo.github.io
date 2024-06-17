import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgStyle, NgFor, NgIf, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-remisioneditar',
  templateUrl: './remisioneditar.component.html',
  styleUrls: ['./remisioneditar.component.scss'],
  standalone: true,
  imports: [FormsModule, NgStyle, NgFor, NgbTypeahead, NgIf, CurrencyPipe, DatePipe],
})
export class RemisioneditarComponent implements OnInit {
  public Lista_Productos: any[] = [
    {
      producto: '',
      Id_Producto: '',
      Lotes: [],
      Lotes_Auxiliar: [],
      Lotes_Seleccionados: [],
      Lotes_Visuales: [],
      Precio_Venta: 0,
      Cantidad: 0,
      Categoria: '',
      Descuento: 0,
      Subtotal: 0,
      Rotativo: 0,
      Impuesto: 0,
      Total_Impuesto: 0,
      Total_Descuento: 0,
      Nombre_Producto: '',
      Suma: 0,
      Cantidad_Presentacion: 0,
      Id_Producto_Remision: '',
      Embalaje: '',
      Cantidad_Disponible: 0,
    },
  ];
  public Lista_Ganancia1 = '';
  public Id_Lista: any;
  public Costo_Remision = 0;
  public Impuesto_Remision = 0;
  public Subtotal_Remision = 0;
  public Descuento_Remision = 0;
  public ListaProductoBusqueda: any[] = [];
  Datos: any[];
  public Nombre_Destino: any = '';

  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_desc = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total_Descuento);
  public reducer_imp = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total_Impuesto);

  public display_Cliente = 'block';
  public display_Interna = 'none';
  public display_Cliente_tabla = 'none';
  public Identificacion: any = [];

  @ViewChild('IdPuntoDispensacion') IdPuntoDispensacion: any = '';
  confirmacionSwal: any;

  confirmacionSalir: any;
  @ViewChild('FormTraslado') FormTraslado: NgForm;
  public alertOption: any = {};

  remision: any = [];
  origen: any = [];
  productos: any = [];
  destino: any = [];
  contrato: any = [];
  public Contratos: any[];
  public disabled: boolean;
  public desabilitar: boolean = false;
  public FechaInicio;
  public FechaFin;
  public punto: any;
  public Meses = [];
  public Impuesto: any[];
  public Identificacion_Funcionario = JSON.parse(localStorage.getItem('User'))
    .Identificacion_Funcionario;
  public Destino: any = [];
  public Destino_Remision = '';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private readonly swalService: SwalService,
  ) {
    for (let i = 0; i <= 18; i++) {
      this.Meses.push({
        dia: i,
      });
    }
    this.Identificacion = JSON.parse(localStorage.getItem('User'));
    let id = this.route.snapshot.params['id'];
    this.http
      .get(environment.ruta + 'php/remision/remision.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        if (data.Remision.Tipo_Destino == 'Bodega') {
          this.http
            .get(
              environment.ruta +
                'php/remision/detalle_bodegas_punto.php?id=' +
                this.Identificacion.Identificacion_Funcionario,
            )
            .subscribe((dato: any) => {
              this.Destino = dato.Bodega;
              this.Destino_Remision = 'B-' + data.Remision.Id_Destino;
            });
        } else if (data.Remision.Tipo_Destino == 'Punto_Dispensacion') {
          this.http
            .get(
              environment.ruta +
                'php/remision/detalle_bodegas_punto.php?id=' +
                this.Identificacion.Identificacion_Funcionario,
            )
            .subscribe((dato: any) => {
              this.Destino = dato.Punto;
              this.Destino_Remision = 'P-' + data.Remision.Id_Destino;
            });
        }

        this.remision = data.Remision;
        this.punto = this.remision.Tipo_Destino.split('_');
        this.origen = data.Origen;
        this.destino = data.Destino;
        this.contrato = data.Contrato;
        this.Cambiar_Remision(this.remision.Tipo);
      });

    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar esta Remisión',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      // type: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarRemision(this.FormTraslado);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
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
  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.http
      .get(environment.base_url + '/php/lista_generales.php', { params: { modulo: 'Impuesto' } })
      .subscribe((data: any) => {
        this.Impuesto = data;
      });
    this.http
      .get(environment.ruta + 'php/remision/detalle_remison.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        this.Lista_Productos = data;
        this.Lista_Productos.push({
          producto: '',
          Id_Producto: '',
          Lotes: [],
          Lotes_Auxiliar: [],
          Lotes_Seleccionados: [],
          Lotes_Visuales: [],
          Precio_Venta: 0,
          Cantidad: 0,
          Categoria: '',
          Descuento: 0,
          Subtotal: 0,
          Rotativo: 0,
          Impuesto: 0,
          Total_Impuesto: 0,
          Total_Descuento: 0,
          Nombre_Producto: '',
          Suma: 0,
          Cantidad_Presentacion: 0,
          Id_Producto_Remision: '',
          Embalaje: '',
          Cantidad_Disponible: 0,
        });

        this.ActualizaValores();
      });
  }
  ProductoSeleccionado(modelo: any, pos) {
    var posicion = this.Lista_Productos.findIndex((x) => x.Id_Producto === modelo.Id_Producto);
    if (posicion >= 0) {
      this.confirmacionSwal.title = 'Producto Repetido ';
      this.confirmacionSwal.html =
        'Este Producto ya se encuentra dentro del listado por Favor revise';
      this.confirmacionSwal.icon = 'error';
      this.swalService.show(this.confirmacionSwal);
      this.Lista_Productos[pos] = {
        producto: '',
        Id_Producto: '',
        Lotes: [],
        Lotes_Auxiliar: [],
        Lotes_Seleccionados: [],
        Lotes_Visuales: [],
        Precio_Venta: 0,
        Cantidad: 0,
        Categoria: '',
        Descuento: 0,
        Subtotal: 0,
        Rotativo: 0,
        Impuesto: 0,
        Total_Impuesto: 0,
        Total_Descuento: 0,
        Nombre_Producto: '',
        Suma: 0,
        Cantidad_Presentacion: 0,
        Id_Producto_Remision: '',
        Embalaje: '',
        Cantidad_Disponible: 0,
      };
    } else {
      var Bodega = this.remision.Id_Origen;
      var tipo = this.remision.Tipo_Origen;
      var tiporemision = this.remision.Tipo;
      var meses = '1';
      var lista = this.remision.Id_Lista;
      if (modelo.Lotes != undefined) {
        this.http
          .get(environment.ruta + 'php/remision/detalle_producto.php', {
            params: {
              idproducto: modelo.Id_Producto,
              id: Bodega,
              tipo: tipo,
              mes: meses,
              tiporemision: tiporemision,
              lista: lista,
            },
          })
          .subscribe((data: any) => {
            let pos2 = pos + 1;
            if (data[0]) {
              //this.Lista_Productos.splice(pos,0,data[0]);
              let prod = this.Lista_Productos[pos];
              this.Lista_Productos[pos] = {};
              this.Lista_Productos[pos].producto = modelo;
              this.Lista_Productos[pos].Precio_Venta = data[0].precio;
              this.Lista_Productos[pos].Lotes = data[0].Lotes;
              this.Lista_Productos[pos].Lotes_Auxiliar = data[0].Lotes;
              this.Lista_Productos[pos].Id_Producto = data[0].Id_Producto;
              this.Lista_Productos[pos].Nombre_Producto = data[0].Nombre;
              this.Lista_Productos[pos].Suma = data[0].Suma;
              this.Lista_Productos[pos].Categoria = data[0].Categoria;
              this.Lista_Productos[pos].Impuesto = data[0].Impuesto;
              this.Lista_Productos[pos].Cantidad_Presentacion = data[0].Cantidad_Presentacion;
              this.Lista_Productos[pos].Embalaje = data[0].Embalaje;
              this.Lista_Productos[pos].Cantidad_Disponible = data[0].Cantidad_Disponible;
              this.Lista_Productos[pos].Total_Impuesto = 0;
              this.Lista_Productos[pos].Total_Descuento = 0;
              this.Lista_Productos[pos].Id_Producto = modelo.Id_Producto;
              this.Lista_Productos[pos].Lotes_Seleccionados = [];
              this.Lista_Productos[pos].Lotes_Visuales = [];
              this.Lista_Productos[pos].Cantidad = 0;
              this.Lista_Productos[pos].Descuento = 0;
              this.Lista_Productos[pos].Subtotal = 0;
              this.Lista_Productos[pos].Id_Producto_Remision = '';
              this.Lista_Productos[pos].Bloqueo = true;

              if (this.Lista_Productos[pos2] == undefined) {
                this.Lista_Productos.push({
                  producto: '',
                  Id_Producto: '',
                  Lotes: [],
                  Lotes_Auxiliar: [],
                  Lotes_Seleccionados: [],
                  Lotes_Visuales: [],
                  Precio_Venta: 0,
                  Cantidad: 0,
                  Categoria: '',
                  Descuento: 0,
                  Subtotal: 0,
                  Rotativo: 0,
                  Impuesto: 0,
                  Total_Impuesto: 0,
                  Total_Descuento: 0,
                  Nombre_Producto: '',
                  Suma: 0,
                  Cantidad_Presentacion: 0,
                  Id_Producto_Remision: '',
                  Embalaje: '',
                  Cantidad_Disponible: 0,
                });
                setTimeout(() => {
                  (document.getElementById('Producto' + pos) as HTMLInputElement).setAttribute(
                    'readonly',
                    'true',
                  );
                  if (pos2 == 70) {
                    (document.getElementById('Producto' + pos2) as HTMLInputElement).setAttribute(
                      'readonly',
                      'readonly',
                    );
                  }
                }, 100);
              }
            } else {
              this.Lista_Productos[pos] = {
                producto: '',
                Id_Producto: '',
                Lotes: [],
                Lotes_Auxiliar: [],
                Lotes_Seleccionados: [],
                Lotes_Visuales: [],
                Precio_Venta: 0,
                Cantidad: 0,
                Categoria: '',
                Descuento: 0,
                Subtotal: 0,
                Rotativo: 0,
                Impuesto: 0,
                Total_Impuesto: 0,
                Total_Descuento: 0,
                Nombre_Producto: '',
                Suma: 0,
                Cantidad_Presentacion: 0,
                Id_Producto_Remision: '',
                Embalaje: '',
                Cantidad_Disponible: 0,
              };
              this.confirmacionSwal.title = 'No Disponible';
              this.confirmacionSwal.html =
                'El producto ya no tiene lotes disponibles, por favor escoja otro.';
              this.confirmacionSwal.icon = 'error';
              this.swalService.show(this.confirmacionSwal);
            }
          });
      }
    }
  }

  BuscarLote(i, cantidad) {
    //this.Lista_Productos[i].Lotes_Auxiliar;
    var Lista_Bandera = [];
    var contador = this.Lista_Productos[i].Lotes_Auxiliar.length;
    var siguiente = true;
    this.Lista_Productos[i].Lotes_Seleccionados = [];
    this.Lista_Productos[i].Lotes_Visuales = [];
    var sumaLote = 0;
    var cantidadsuma = cantidad;
    var multipo = parseInt(cantidad) % parseInt(this.Lista_Productos[i].Cantidad_Presentacion);

    var bodega = 'B-' + this.remision.Id_Origen;
    if (bodega != 'B-5') {
      if (parseInt(cantidad) > 0 && multipo == 0) {
        for (let d = 0; d < contador; d++) {
          if (
            siguiente &&
            cantidad <= parseInt(this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad)
          ) {
            let item = JSON.parse(JSON.stringify(this.Lista_Productos[i].Lotes_Auxiliar[d]));
            item.label =
              'Lote: ' +
              this.Lista_Productos[i].Lotes_Auxiliar[d].Lote +
              ' - Vencimiento: ' +
              this.Lista_Productos[i].Lotes_Auxiliar[d].Fecha_Vencimiento +
              ' - Cantidad: ' +
              cantidad;
            item.Cantidad = cantidad;

            siguiente = false;
            sumaLote += parseInt(cantidad);
            /**SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
            let info = JSON.stringify(item);
            let datos = new FormData();
            datos.append('datos', info);
            item.Cantidad_Seleccionada = cantidad;
            this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad_Seleccionada = cantidad;
            Lista_Bandera.push(item);
            this.Lista_Productos[i].Lotes_Seleccionados.push(item);
            this.Lista_Productos[i].Lotes_Visuales.push(item.label);
            this.http
              .post(environment.ruta + 'php/remision/selecciona_lote.php', datos)
              .subscribe((data: any) => {});
            /**FIN SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
          } else if (
            siguiente &&
            cantidad > parseInt(this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad)
          ) {
            cantidad = cantidad - this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad;
            sumaLote += parseInt(this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad);

            /**SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
            let info = JSON.stringify(this.Lista_Productos[i].Lotes_Auxiliar[d]);
            let datos = new FormData();
            datos.append('datos', info);
            this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad_Seleccionada =
              this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad;
            Lista_Bandera.push(this.Lista_Productos[i].Lotes_Auxiliar[d]);
            this.Lista_Productos[i].Lotes_Seleccionados.push(
              this.Lista_Productos[i].Lotes_Auxiliar[d],
            );
            this.Lista_Productos[i].Lotes_Visuales.push(
              this.Lista_Productos[i].Lotes_Auxiliar[d].label,
            );
            this.http
              .post(environment.ruta + 'php/remision/selecciona_lote.php', datos)
              .subscribe((data: any) => {});
            /**FIN SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
          }
        }
        if (sumaLote < parseInt(cantidadsuma)) {
          this.Lista_Productos[i].Cantidad = sumaLote;
          this.confirmacionSwal.title = 'Error en la cantidad Ingresada';
          this.confirmacionSwal.html = 'La cantidad ingresada  supera la cantidad disponible';
          this.confirmacionSwal.icon = 'error';
          this.swalService.show(this.confirmacionSwal);
        }
      } else {
        this.confirmacionSwal.title = 'Error en la cantidad Ingresada';
        this.confirmacionSwal.html =
          'No se pueden entregar cantidades incompletas o nulas de acuerdo a la Presentacion del Producto';
        this.confirmacionSwal.icon = 'error';
        this.Lista_Productos[i].Cantidad = 0;
        this.swalService.show(this.confirmacionSwal);
      }
      this.Lista_Productos[i].Lotes = Lista_Bandera;
    } else {
      for (let d = 0; d < contador; d++) {
        if (siguiente && cantidad <= parseInt(this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad)) {
          let item = JSON.parse(JSON.stringify(this.Lista_Productos[i].Lotes_Auxiliar[d]));
          item.label =
            'Lote: ' +
            this.Lista_Productos[i].Lotes_Auxiliar[d].Lote +
            ' - Vencimiento: ' +
            this.Lista_Productos[i].Lotes_Auxiliar[d].Fecha_Vencimiento +
            ' - Cantidad: ' +
            cantidad;
          item.Cantidad = cantidad;
          Lista_Bandera.push(item);
          this.Lista_Productos[i].Lotes_Seleccionados.push(item);
          this.Lista_Productos[i].Lotes_Visuales.push(item.label);
          siguiente = false;
          sumaLote += parseInt(cantidad);
          /**SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
          let info = JSON.stringify(item);
          let datos = new FormData();
          datos.append('datos', info);
          item.Cantidad_Seleccionada = cantidad;
          this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad_Seleccionada = cantidad;
          Lista_Bandera.push(item);
          this.Lista_Productos[i].Lotes_Seleccionados.push(item);
          this.Lista_Productos[i].Lotes_Visuales.push(item.label);
          this.http
            .post(environment.ruta + 'php/remision/selecciona_lote.php', datos)
            .subscribe((data: any) => {});
          /**FIN SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
        } else if (
          siguiente &&
          cantidad > parseInt(this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad)
        ) {
          cantidad = cantidad - this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad;
          sumaLote += parseInt(this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad);
          /**SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
          let info = JSON.stringify(this.Lista_Productos[i].Lotes_Auxiliar[d]);
          let datos = new FormData();
          datos.append('datos', info);
          this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad_Seleccionada =
            this.Lista_Productos[i].Lotes_Auxiliar[d].Cantidad;
          Lista_Bandera.push(this.Lista_Productos[i].Lotes_Auxiliar[d]);
          this.Lista_Productos[i].Lotes_Seleccionados.push(
            this.Lista_Productos[i].Lotes_Auxiliar[d],
          );
          this.Lista_Productos[i].Lotes_Visuales.push(
            this.Lista_Productos[i].Lotes_Auxiliar[d].label,
          );
          this.http
            .post(environment.ruta + 'php/remision/selecciona_lote.php', datos)
            .subscribe((data: any) => {});
          /**FIN SELECCIONA CANTIDAD DE LOTE EN TIEMPO REAL DEL LOTE */
        }
      }
      if (sumaLote < parseInt(cantidadsuma)) {
        this.Lista_Productos[i].Cantidad = sumaLote;
        this.confirmacionSwal.title = 'Error en la cantidad Ingresada';
        this.confirmacionSwal.html = 'La cantidad ingresada  supera la cantidad disponible';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
      }
      this.Lista_Productos[i].Lotes = Lista_Bandera;
    }
  }
  CalcularTotal(pos) {
    var Cantidad = this.Lista_Productos[pos].Cantidad;
    var Descuento = this.Lista_Productos[pos].Descuento;
    var des = this.Lista_Productos[pos].Descuento;
    var Precio = this.Lista_Productos[pos].Precio_Venta;
    var Impuesto = this.Lista_Productos[pos].Impuesto;
    var imp = parseFloat(this.Lista_Productos[pos].Impuesto);
    this.Lista_Productos[pos].Subtotal = parseFloat(Cantidad) * parseFloat(Precio);
    if (Descuento != '') {
      des = parseFloat(this.Lista_Productos[pos].Subtotal) * (des / 100);
      this.Lista_Productos[pos].Total_Descuento = des;
    }
    if (Impuesto !== '') {
      imp =
        (parseFloat(this.Lista_Productos[pos].Subtotal) -
          parseFloat(this.Lista_Productos[pos].Total_Descuento)) *
        (imp / 100);
      this.Lista_Productos[pos].Total_Impuesto = imp;
    }
  }
  ActualizaValores() {
    this.Subtotal_Remision = parseFloat(this.Lista_Productos.reduce(this.reducer, 0));
    this.Impuesto_Remision = parseFloat(this.Lista_Productos.reduce(this.reducer_imp, 0));
    this.Descuento_Remision = parseFloat(this.Lista_Productos.reduce(this.reducer_desc, 0));
    this.Costo_Remision = this.Subtotal_Remision - this.Descuento_Remision + this.Impuesto_Remision;
  }
  Cambiar_Remision(tipo) {
    let serv = tipo;
    var fecha = new Date();
    this.FechaFin = fecha.toISOString().split('T')[0];
    var dia = new Date(fecha.setDate(fecha.getDate() - 30));
    this.FechaInicio = dia.toISOString().split('T')[0];
    if (serv == 'Interna') {
      this.display_Interna = 'block';
      this.display_Cliente = 'none';
      this.display_Cliente_tabla = 'none';

      this.ListaProductosBodega();
    } else {
      this.display_Interna = 'none';
      this.display_Cliente = 'block';
      this.display_Cliente_tabla = 'table-cell';
      if (this.remision.Tipo_Lista == 'Contrato') {
        this.ListarContratos();
      } else {
        this.Lista_Ganancia();
        this.Id_Lista = this.remision.Id_Lista;
      }
    }
  }
  ListaProductosBodega() {
    var Bodega = this.remision.Id_Origen;
    this.http
      .get(environment.ruta + 'php/remision/detalle_productos_bodega.php', {
        params: { id: Bodega, tipo: this.remision.Tipo_Origen },
      })
      .subscribe((data: any) => {
        this.ListaProductoBusqueda = data;
      });
  }
  ListarContratos() {
    var Idcliente = this.remision.Id_Destino;
    if (Idcliente) {
      var id = Idcliente;
      this.http
        .get(environment.ruta + 'php/remision/contratos.php', { params: { id: id } })
        .subscribe((data: any) => {
          this.Contratos = data;
          if (Idcliente != '') {
            if (this.Contratos.length != 0) {
              this.disabled = false;
            }
            this.desabilitar = true;
          } else {
            this.disabled = true;
            this.desabilitar = true;
          }
        });
    }
  }
  Lista_Ganancia() {
    this.http
      .get(environment.ruta + 'php/remision/productos_lista_ganancia.php', {
        params: { id: this.remision.Id_Origen, lista: this.remision.Id_Lista },
      })
      .subscribe((data: any) => {
        this.ListaProductoBusqueda = data;
      });
  }
  showAlert(evt: any) {
    var tipo = this.remision.Tipo;

    if (tipo == 'Interna') {
      var punto = this.remision.Id_Destino;

      if (punto == '') {
        this.confirmacionSwal.title = 'Error';
        this.confirmacionSwal.html = 'Por favor seleccione el Punto de destino';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
      } else if (this.Lista_Productos.length == 1) {
        this.confirmacionSwal.title = 'Error';
        this.confirmacionSwal.html = 'No puede guardar una remison sin productos';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
      } else {
        this.swalService.show(this.alertOption);
      }
    } else {
      if (this.Lista_Productos.length == 1) {
        this.confirmacionSwal.title = 'Error';
        this.confirmacionSwal.html = 'No puede guardar una remison sin productos';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
      } else {
        this.swalService.show(this.alertOption);
      }
    }
  }
  save() {}

  GuardarRemision(formulario: NgForm) {
    let id = this.route.snapshot.params['id'];
    let info = this.normalize(JSON.stringify(this.remision));
    let prod = this.normalize(JSON.stringify(this.Lista_Productos));
    let datos = new FormData();

    datos.append('id', id);
    datos.append('datos', info);
    datos.append('funcionario', this.Identificacion_Funcionario);
    datos.append('productos', prod);
    this.http
      .post(environment.ruta + 'php/remision/actualizar_remision.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSalir.title = 'Remisión Actualizada';
        this.confirmacionSalir.html = data.mensaje;
        this.confirmacionSalir.icon = data.tipo;
        this.swalService.show(this.confirmacionSalir).then((res) => {
          if (res.isConfirmed) this.VerPantallaLista();
        });
        formulario.reset();
        this.Lista_Productos = [
          {
            producto: '',
            Id_Producto: '',
            Lotes: [],
            Lotes_Auxiliar: [],
            Lotes_Seleccionados: [],
            Lotes_Visuales: [],
            Precio_Venta: 0,
            Cantidad: 0,
            Categoria: '',
            Descuento: 0,
            Subtotal: 0,
            Rotativo: 0,
            Impuesto: 0,
            Total_Impuesto: 0,
            Total_Descuento: 0,
            Nombre_Producto: '',
            Suma: 0,
            Cantidad_Presentacion: 0,
            Id_Producto_Remision: '',
            Embalaje: '',
            Cantidad_Disponible: 0,
          },
        ];
        // this.VerPantallaLista();
      });
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
  VerPantallaLista() {
    this.router.navigate(['/remisiones']);
  }
  EliminarProductoRemsion(i) {
    if (this.Lista_Productos[i].producto != '') {
      let info = JSON.stringify(this.Lista_Productos[i].Lotes_Seleccionados);
      let datos = new FormData();
      datos.append('datos', info);
      //this.Lista_Productos[i]={};
      this.Lista_Productos.splice(i, 1);
      this.http
        .post(environment.ruta + 'php/remision/elimina_selecciona_lote.php', datos)
        .subscribe((data: any) => {});
    }
  }
  EliminaProductoFinal(i, Id_Producto_Remision) {
    const request = (resolve) => {
      let info = JSON.stringify(this.Lista_Productos[i].Lotes_Seleccionados);
      let datos = new FormData();
      datos.append('datos', info);
      datos.append('Nombre', this.normalize(this.Lista_Productos[i].Nombre));
      datos.append('rem', this.remision.Id_Remision);
      datos.append('funcionario', this.Identificacion_Funcionario);
      //this.Lista_Productos[i]={};
      this.Lista_Productos.splice(i, 1);
      this.http
        .post(environment.ruta + 'php/remision/elimina_producto_remision.php', datos)
        .subscribe((data: any) => {
          resolve(true);
        });
    };
    this.swalService.swalLoading(
      'Se dispone a eliminar este producto de la remisión, esta acción no tiene vuelta atrás',
      request,
    );
  }
  Contrato(idcontrato) {
    var id = idcontrato.substr(2);
    var bodega = this.remision.Id_Origen;
    this.http
      .get(environment.ruta + 'php/remision/productos_contrato.php', {
        params: { id: id, bodega: bodega },
      })
      .subscribe((data: any) => {
        this.ListaProductoBusqueda = data;
      });
  }
  AgregarNombreDestino() {
    let select: any = document.getElementById('Id_Destino');
    this.Nombre_Destino = select.options[select.selectedIndex].text;
  }
}
