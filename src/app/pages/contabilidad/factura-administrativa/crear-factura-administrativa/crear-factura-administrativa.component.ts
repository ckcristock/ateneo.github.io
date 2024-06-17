import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../globales';
import { SweetAlertOptions } from 'sweetalert2';
import { NgSelectOption, FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, NgClass, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-factura-administrativa',
  templateUrl: './crear-factura-administrativa.component.html',
  styleUrls: ['./crear-factura-administrativa.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    NgbTypeahead,
    ModalBasicComponent,
    NgClass,
    CurrencyPipe,
    DatePipe,
  ],
})
export class CrearFacturaAdministrativaComponent implements OnInit {
  public id = this.route.snapshot.params['id'];
  public Fecha = new Date();
  public Idcliente: any = [];
  public Cliente: any = [];
  public DatosCliente: any;
  ListaGananciaFactura: any;
  BodegaFactura: any;
  ListaProductoFactura: any;
  precioCumFactura: any;
  diaPagoClienteFactura: string;
  public reducer = (accumulator, currentValue) => {
    if (currentValue.disabled != undefined && currentValue.disabled) {
      return accumulator + parseFloat(currentValue.Subtotal);
    } else {
      return accumulator;
    }
  };
  public reducer2 = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Iva);
  public reducer3 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total_Descuento);
  public Lista_Factura = [
    {
      Descripcion: '',
      Precio: 0,
      Descuento: 0,
      Impuesto: 0,
      Cantidad: 0,
      Subtotal: 0,
      Iva: 0,
      Total_Descuento: 0,
    },
  ];
  public TipoClientes = [{ Nombre: 'Cliente' }, { Nombre: 'Proveedor' }, { Nombre: 'Funcionario' }];
  public TipoClienteSelected: any;
  SubtotalFactura: number = 0;
  IvaFactura: number;
  DescuentosFactura: number;
  TotalFactura: number = 0;
  ImpuestoFactura: any;
  public Cuota = 0;
  public user: any = JSON.parse(localStorage.getItem('User'));
  public alertOption: SweetAlertOptions = {};
  public clientesReadOnly = true;
  public Puntos: Array<NgSelectOption>;
  public Punto: any = '';
  public divFactura = true;
  public Departamento = [];
  public Centros: any = [];
  public Centro_Costo_Selected: any;
  public Nom_Centro_Costo: any;
  public PlanesCuenta: any = [];
  public Observaciones = '';

  public Switch_Activos = 'No';
  public Activos = [];
  public ActivosBuscar = [];
  public Carrito_Activos = [];
  confirmacionSwal: any;
  finalizacionSwal: any;
  @ViewChild('modalProductos') modalProductos: any;
  /*   @ViewChild('FormFactura') FormFactura: any;
   */
  enviromen: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private router: Router,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit() {
    this.enviromen = environment;
    this.http
      .get(environment.ruta + 'php/contabilidad/notascontables/centrocosto_buscar.php')
      .subscribe((data: any) => {
        this.Centros = data;
      });
    this.http
      .get(environment.ruta + 'php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.PlanesCuenta = data.Activo;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.ListaGananciaFactura = data;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Impuesto' },
      })
      .subscribe((data: any) => {
        this.ImpuestoFactura = data;
      });

    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Departamento' },
      })
      .subscribe((data: any) => {
        this.Departamento = data;
      });

    this.getActivos();
  }

  onSaveInvoice() {
    const request = () => {
      this.GuardarFactura();
    };
    this.swalService.swalLoading('Se dispone a guardar esta factura', request);
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Cliente.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.PlanesCuenta.filter(
              (v) => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );
  search2 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 2
          ? []
          : this.Centros.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );

  formatter1 = (x: { Codigo: string }) => x.Codigo;
  formatter2 = (x: { Nombre: string }) => x.Nombre;

  formatter = (x: { Nombre: string }) => x.Nombre;

  BuscarClientes() {
    this.Idcliente = '';

    this.Centro_Costo_Selected = [];
    let params: any = {};
    params.Tipo = this.TipoClienteSelected;
    this.http
      .get(environment.ruta + 'php/clientes/get_terceros_por_tipo.php', {
        params,
      })
      .subscribe((data: any) => {
        this.Cliente = data;
        this.clientesReadOnly = false;
      });
  }
  actualizarValores(lista: Array<any>) {
    this.TotalFactura = parseFloat(lista.reduce(this.reducer, 0));
  }
  VerPantallaLista() {
    this.router.navigate(['/facturaadministrativa']);
  }
  BuscarDatosCliente(evento): void {
    if (typeof this.DatosCliente != 'object' && this.DatosCliente != '') {
      /* evento.focus(); */
      this.confirmacionSwal.title = 'Incorrecto!';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.text = `El valor cliente no es valido.`;
      this.swalService.show(this.confirmacionSwal);
      evento.value = '';
      this.DatosCliente = '';
      this.Idcliente = '';
    } else {
      this.Idcliente = this.DatosCliente.Id_Cliente;
    }
  }
  EliminarProductoRemsion(array: Array<any>, i) {
    if (this.Switch_Activos == 'Si') {
      const id = this.Carrito_Activos[i]['ID'];
      const pos = this.ActivosBuscar.findIndex((act) => act.ID == id);
      this.ActivosBuscar[pos].selected = false;
    }

    array.splice(i, 1);

    this.actualizarValores(array);
  }
  GuardarFactura() {
    if (this.validarCamposGeneral()) {
      let centroCosto = this.Centro_Costo_Selected.Id_Centro_Costo;

      let productos = '';
      if (this.Switch_Activos == 'Si') {
        productos = JSON.stringify(this.Carrito_Activos);
      } else {
        productos = JSON.stringify(this.Lista_Factura.slice(0, this.Lista_Factura.length - 1));
      }
      let user = JSON.parse(localStorage.getItem('User'));
      let funcionario = user.Identificacion_Funcionario;
      let datos = new FormData();

      datos.append('switch_activos', this.Switch_Activos);
      datos.append('funcionario', funcionario);
      datos.append('cliente', this.Idcliente);
      datos.append('observaciones', this.Observaciones);
      datos.append('total', this.TotalFactura.toString());
      datos.append('centroCosto', centroCosto);
      datos.append('productos', productos);
      datos.append('tipoCliente', this.TipoClienteSelected);

      this.http
        .post(
          environment.ruta + '/php/factura_administrativa/guardar_factura_administrativa.php',
          datos,
        )
        .subscribe((data: any) => {
          if (data.type == 'success') {
            this.finalizacionSwal.title = data.titulo;
            this.finalizacionSwal.text = data.mensaje;
            this.finalizacionSwal.icon = data.type;
            this.swalService.show(this.finalizacionSwal);
          } else {
            this.confirmacionSwal.title = data.titulo;
            this.confirmacionSwal.text = data.mensaje;
            this.confirmacionSwal.icon = data.type;
            this.swalService.show(this.confirmacionSwal);
          }
        });
    }
  }
  getCuotasMod(regimen) {
    if (regimen != '' && parseInt(regimen) != 2) {
      let cliente = (document.getElementById('Id_Cliente') as HTMLInputElement).value;
      let departamento = (document.getElementById('Id_Departamento') as HTMLInputElement).value;
      let mes = (document.getElementById('Mes') as HTMLInputElement).value;
      let punto = this.Punto;

      this.http
        .get(environment.ruta + 'php/factura_capita/cuotas_moderadora.php', {
          params: { client: cliente, dep: departamento, pto: punto, mes: mes },
        })
        .subscribe((data: any) => {
          this.Cuota = parseFloat(data.Cuotas);
        });
    } else {
      this.Cuota = 0;
    }
  }
  validarCampo(campo, evento, tipo, pos?) {
    // Funcion que validará los campos de typeahead

    if (typeof campo != 'object' && campo != '') {
      /* evento.focus(); */
      this.confirmacionSwal.title = 'Incorrecto!';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.text = `El valor ${tipo} no es valido.`;
      this.swalService.show(this.confirmacionSwal);
      if (tipo == 'Centro de Costo') {
        evento.value = '';
        this.Centro_Costo_Selected = '';
      } else if (tipo == 'Cuenta') {
        //this.Lista_Factura[pos]["PlanCuenta"] = "";
      }
    }
  }
  calcularSubtotal(Item) {
    let valor_iva =
      (parseFloat(Item.Impuesto) / 100) *
      (parseFloat(Item.Cantidad) * parseFloat(Item.Precio) -
        parseFloat(Item.Cantidad) * parseFloat(Item.Descuento));
    let subtotal =
      parseFloat(Item.Cantidad) * parseFloat(Item.Precio) -
      parseFloat(Item.Cantidad) * parseFloat(Item.Descuento);
    let resultado = subtotal + valor_iva;
    //formateo el número a dos decimales
    resultado = parseFloat(resultado.toFixed(2));
    return resultado;
  }
  validarCamposGeneral(): boolean {
    let error = '';
    let productoError;
    if (!this.Idcliente || this.Idcliente == '') {
      error = 'Datos del Cliente';
    } else if (
      typeof this.Centro_Costo_Selected != 'object' ||
      this.Centro_Costo_Selected == '' ||
      !this.Centro_Costo_Selected
    ) {
      error = 'Centro Costos';
    }

    if (this.Lista_Factura && !error) {
      for (let producto = 0; producto < this.Lista_Factura.length - 1; producto++) {
        const planCuenta = this.Lista_Factura[producto]['PlanCuenta'];
        const referencia = this.Lista_Factura[producto]['Referencia'];
        const descripcion = this.Lista_Factura[producto]['Descripcion'];
        const cantidad = this.Lista_Factura[producto]['Cantidad'];
        const precio = this.Lista_Factura[producto]['Precio'];
        const descuento = this.Lista_Factura[producto]['Descuento'];
        if (!this.Lista_Factura[producto]['disabled']) {
          error = 'Datos editados sin guardar';
          productoError = producto + 1;
          break;
        }
        if (planCuenta == '' || !planCuenta || typeof planCuenta != 'object') {
          error = 'Plan Cuenta';
          productoError = producto + 1;
          break;
        }
        if (referencia == '' || !referencia) {
          error = 'Referencia';
          productoError = producto + 1;
          break;
        }
        if (descripcion == '' || !descripcion) {
          error = 'Descripcion';
          productoError = producto + 1;
          break;
        }
        if (cantidad == 0 || !cantidad) {
          error = 'Cantidad';
          productoError = producto + 1;
          break;
        }
        if (precio == 0 || !precio || precio < descuento) {
          error = 'Precio';
          productoError = producto + 1;
          break;
        }
      }
    }
    if (error) {
      this.confirmacionSwal.title = 'Error al intentar guardar los datos';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.text = productoError
        ? `Existe un error de ${error} en el producto ${productoError}`
        : `Existe un error en ${error} `;
      this.swalService.show(this.confirmacionSwal);
      return false;
    }

    return true;
  }
  getActivos() {
    this.http
      .get(environment.ruta + 'php/activofijo/get_activos_fijos.php')
      .subscribe((data: any) => {
        this.ActivosBuscar = data;
        this.Activos = data;
      });
  }
  filtrarActivos(buscar: string) {
    this.ActivosBuscar = this.Activos.filter((activo) =>
      activo.Nombre.includes(buscar.toUpperCase()),
    );
  }
  agregarActivo(activo) {
    const pos = this.Carrito_Activos.findIndex((act) => act.ID == activo.ID);

    if (pos < 0) {
      const activonuevo = Object.assign({}, activo);
      this.Carrito_Activos.push(activonuevo);
      activo.selected = true;
    } else {
      this.Carrito_Activos.splice(pos, 1);
      activo.selected = false;
      this.actualizarValores(this.Carrito_Activos);
    }
  }
  validar(array, item, pos) {
    if (
      item.Cantidad &&
      parseInt(item.Cantidad) > 0 &&
      item.Precio &&
      parseFloat(item.Precio) > 0 &&
      item.PlanCuenta &&
      typeof item.PlanCuenta == 'object' &&
      item.Referencia &&
      item.Impuesto != undefined &&
      item.Impuesto != null
    ) {
      //calcular subtotal
      if (item.Precio > item.Descuento) {
        let subtotal = this.calcularSubtotal(item);
        item.Subtotal = subtotal;

        item.disabled = true;
        this.actualizarValores(array);
        if (this.Switch_Activos == 'No') {
          var posicion = this.Lista_Factura.length - 1;

          item.Referencia = item.Referencia.toUpperCase();
          item.Referencia = item.Referencia.trim();
          if (posicion == pos) {
            item.disabled = true;
            this.Lista_Factura.push({
              Descripcion: '',
              Precio: 0,
              Descuento: 0,
              Impuesto: 0,
              Cantidad: 0,
              Subtotal: 0,
              Iva: 0,
              Total_Descuento: 0,
            });
          }
        }
      } else {
        item.Descuento = 0;
        this.confirmacionSwal.title = 'Error en los datos ingresados';
        this.confirmacionSwal.text = 'La precio ingresado no puede ser menor que el descuento';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
      }
    } else {
      this.confirmacionSwal.title = 'Error en los datos ingresados';
      this.confirmacionSwal.text = 'Por favor verifique los datos y vuelva a intentar';
      this.confirmacionSwal.icon = 'error';
      this.swalService.show(this.confirmacionSwal);
    }
  }
}
