import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { NgForm, FormsModule } from '@angular/forms';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../globales';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CabeceraComponent } from '../../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-notas-debito-crear',
  templateUrl: './notas-debito-crear.component.html',
  styleUrls: ['./notas-debito-crear.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CabeceraComponent,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    NgIf,
    MatInputModule,
    NgbTypeahead,
    TextFieldModule,
    DecimalPipe,
  ],
})
export class NotasDebitoCrearComponent implements OnInit {
  //!Hay que cambiar todo, actualmente solo es copia de notas crédito
  enviromen: any;
  public datosCabecera: any = {
    Titulo: 'Nueva nota de débito',
    Fecha: new Date(),
    Codigo: '',
  };

  public Tipo_Factura = [
    // {Nombre:'Factura Dispensación',Modulo:'Factura'},
    { Nombre: 'Factura nacional', Modulo: 'Factura_Capita' },
    { Nombre: 'Factura internacional', Modulo: 'Factura_Venta' },
    { Nombre: 'Factura administrativa', Modulo: 'Factura_Administrativa' },
  ];
  public TipoClientes = [{ Nombre: 'Cliente' }, { Nombre: 'Proveedor' }, { Nombre: 'Funcionario' }];
  public TipoClienteSelected: any = '';
  public Tipo_Factura_Selected: any;
  public Codigo_Factura = '';
  public user: any;
  public FacturaCliente: any[];
  public Cliente: any = [];
  public Motivos: any[] = [];
  public Lista_Productos = [];
  public ListaProductos = [];
  public ValorFactura: any;
  public Boton = false;
  public DescuentoFactura: number;
  public idFactura: any;
  public DatosCliente: any;
  public Fecha = new Date();
  public Mostrar = false;
  public Productos_Nota = [];
  public Cantidad_Inicial = 0;
  public Id_Cliente: any;
  public Id_Factura: any;
  public Subtotal: any = 0;
  public Iva: any = 0;
  public Total: any = 0;
  // el subtotal general es la sumatoria de los subtales de los productos que vienen de la base de datos, sin modificar valor de nota;
  public SubTotalGeneral = 0;
  public SubTotalDisponible = 0;
  public Observaciones_General: any = '';
  public alerOptions: SweetAlertOptions;
  public reducer = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Subtotal_Nota);
  public reducer1 = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Iva);

  confirmacionSwal: any;
  finalizacionSwal: any;
  @ViewChild('FormNotaCredito') FormNotaCredito: any;
  @ViewChild('check') checks: HTMLCollectionOf<Element>;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private router: Router,
    private _user: UserService,
    private readonly swalService: SwalService,
  ) {
    this.user = _user.user.person.id;
  }

  ngOnInit() {
    // this.user = JSON.parse(localStorage.User);
    this.enviromen = environment;

    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Causal_No_Conforme' },
      })
      .subscribe((data: any) => {
        this.Motivos = data;
      });
  }

  onSaveCreditNote() {
    const request = () => {
      this.GuardarNotaCredito(this.FormNotaCredito);
    };
    this.swalService.swalLoading('Se dispone a guardar esta nota credito', request);
  }

  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇçº',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc#',
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

  NotaCredito(item, check, calculartotal: boolean = true) {
    let precioDisponible = item.Precio - item.Precio_Nota_Credito_Acumulado;
    if (check) {
      item.Disabled = false;
      item.Required = true;
      item.Precio_Nota = 0;
    } else {
      item.Valor_Nota = 0;
      item.Valor_Nota_Total = 0;
      item.Precio_Nota = 0;
      item.Disabled = true;
      item.Subtotal_Nota = 0;
      item.Iva = 0;
    }
    if (calculartotal) {
      this.calcularTotal();
    }
  }
  BuscarClientes() {
    this.setearValores();
    this.TipoClienteSelected = '';
    this.http
      .get(environment.base_url + '/php/lista_generales.php', { params: { modulo: 'Cliente' } })
      .subscribe((data: any) => {
        this.Cliente = data;
      });
  }
  BuscarClientesTerceros(tipo: any = false) {
    this.setearValores();
    let params: any = {};
    params.Tipo = tipo != false ? tipo : this.TipoClienteSelected;

    this.http
      .get(environment.base_url + '/php/clientes/get_terceros_por_tipo.php', { params })
      .subscribe((data: any) => {
        this.Cliente = data;
      });
  }
  BuscarFactura(codigo) {
    this.Lista_Productos = [];
    this.SubTotalGeneral = 0;
    this.Total = 0;
    //reviso si lo que me llega es diferente de vacio
    if (this.Tipo_Factura_Selected != '') {
      if (Object.keys(this.DatosCliente).length > 0 && this.DatosCliente.Id_Cliente != undefined) {
        this.FacturaCliente = [];
        let params: any = {
          id: this.DatosCliente.Id_Cliente,
          modelo: this.Tipo_Factura_Selected,
          codigo,
        };
        if (this.Tipo_Factura_Selected == 'Factura_Administrativa') {
          params.tipoCliente = this.TipoClienteSelected;
        }
        //Con el tipo de factura que se seleccionó, y el dato del cliente hago una peticion a buscar las facturas del cliente
        this.http
          .get(
            environment.base_url +
              '/php/notas_credito_nuevo/lista_facturas_cliente_notas_credito.php',
            { params },
          )
          .subscribe((data: any) => {
            // guardo en un array el id y el codigo de la factura
            if (data.Factura) {
              this.FacturaCliente = data.Factura;
              //buscar productos de la factura
              this.BuscarProductosFactura(data.Factura.Id_Factura);
            } else {
              Swal.fire({
                icon: data.tipo,
                text: data.mensaje,
                title: data.title,
              });
              /* this.confirmacionSwal.title=data.title;
              this.confirmacionSwal.text= data.mensaje;
              this.confirmacionSwal.type= data.tipo;
              this.confirmacionSwal.fire(); */
              this.Codigo_Factura = '';
            }
          });
      }
    }
  }

  BuscarProductosFactura(id) {
    //se recibe el id de la factura

    this.SubTotalGeneral = 0;
    this.SubTotalDisponible = 0;
    this.Total = 0;
    this.Id_Factura = id;
    //buscamos en la api los datos que coincidan con el id y tipo de factura
    this.http
      .get(environment.base_url + '/php/notas_credito_nuevo/lista_producto_notas_credito.php', {
        params: { id: id, modelo: this.Tipo_Factura_Selected },
      })
      .subscribe((data: any) => {
        this.Lista_Productos = data.data;
        this.SubTotalGeneral = data.Total_General_Producto_Facturas;
        this.SubTotalDisponible = data.Subtotal_Disponible;

        this.Mostrar = true;
      });
  }

  CheckeoMultiple(check_general) {
    //buscamos todos los checks de los productos
    let cheks = document.getElementsByClassName('checks');

    //activo/desactivo todos los checks dependiento de el general
    for (let index = 0; index < cheks.length; index++) {
      cheks[index]['checked'] = check_general;
    }
    //busco cada item y le doy los valores de la nota
    this.Lista_Productos.forEach((producto) => {
      this.NotaCredito(producto, check_general, false);
    });
    this.calcularTotal();
  }

  GuardarNotaCredito(formulario: NgForm) {
    let productos_seleccionados = this.Lista_Productos.filter(
      (producto) => producto.Disabled == false,
    );
    if (productos_seleccionados.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Operación denegada',
        text: 'Debe agregar al menos un producto para realizar la nota crédito',
      });
      return false;
    }

    let productos = this.normalize(JSON.stringify(this.Lista_Productos));

    let funcionario = this.user;
    let subTotalGeneral = this.SubTotalGeneral ? this.SubTotalGeneral.toString() : '0';
    let total = this.Total;
    let moduloFactura = this.Tipo_Factura_Selected;
    let codigoFactua = this.Codigo_Factura;
    let observaciones = this.Observaciones_General;

    let prod = this.normalize(JSON.stringify(productos_seleccionados));
    let factura = this.normalize(JSON.stringify(this.FacturaCliente));
    let cliente = this.DatosCliente.Id_Cliente;
    let datos = new FormData();

    datos.append('modulo', moduloFactura);
    datos.append('subTotalGeneral', subTotalGeneral);
    datos.append('total', total);
    datos.append('factura', factura);
    datos.append('codigoFactura', codigoFactua);
    datos.append('observaciones', observaciones);
    datos.append('productosNotas', prod);
    datos.append('productos', productos);
    datos.append('funcionario', funcionario);
    datos.append('cliente', cliente);

    this.http
      .post(environment.base_url + '/php/notas_credito_nuevo/guardar_nota_credito.php', datos)
      .subscribe((data: any) => {
        if (data.tipo == 'success') {
          Swal.fire({
            icon: data.tipo,
            text: data.mensaje,
            title: data.title,
          });
          /* this.finalizacionSwal.title = data.title;
        this.finalizacionSwal.text = data.mensaje;
        this.finalizacionSwal.icon = data.tipo;
        this.finalizacionSwal.show(); */
        } else {
          Swal.fire({
            icon: data.tipo,
            text: data.mensaje,
            title: data.title,
          });
          /* this.confirmacionSwal.title = data.title;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.type = data.tipo;
        this.confirmacionSwal.show(); */
        }
      });
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
  formatter = (x: { Nombre: string }) => x.Nombre;

  AbonoFactura(valor) {
    if (parseInt(this.ValorFactura) >= parseInt(valor) && this.ValorFactura != undefined) {
      this.Boton = true;
    } else {
      this.Boton = false;
    }
  }

  VerPantallaLista() {
    this.FormNotaCredito.reset();
    this.router.navigate(['/contabilidad/comprobantes/notas-credito']);
  }

  calcularSubtotal(Item) {
    let resultado = 0;

    if (Item.Precio_Nota) {
      let subtotal = parseFloat(Item.Cantidad) * parseFloat(Item.Precio_Nota);

      resultado = subtotal; //+ valor_iva;
    }

    return resultado;
  }

  calcularTotalProducto(Item) {
    let resultado = 0;

    if (Item.Precio_Nota) {
      let valor_iva =
        (parseFloat(Item.Impuesto) / 100) *
        (parseFloat(Item.Cantidad) * parseFloat(Item.Precio_Nota));

      let subtotal = parseFloat(Item.Cantidad) * parseFloat(Item.Precio_Nota);

      resultado = subtotal + valor_iva;
    }
    return resultado;
  }

  ValidarValorNota(item) {
    item.Valor_Nota = this.calcularSubtotal(item);
    item.Valor_Nota_Total = this.calcularTotalProducto(item);
    let total_notas = item.Valor_Nota_Total + item.Valor_Nota_Credito_Acumulado;

    if (total_notas > item.Total_Producto_Factura) {
      item.Precio_Nota = 0;
      item.Valor_Nota = 0;
      item.Valor_Nota_Total = 0;
      Swal.fire({
        title: 'Error en precio ingresado',
        icon: 'error',
        text: 'El precio del producto no puede ser mayor que el subtotal sin Iva.',
      });
      /* this.confirmacionSwal.title="Error en precio ingresado";
      this.confirmacionSwal.text= "El precio del producto no puede ser mayor que el subtotal sin Iva.";
      this.confirmacionSwal.type= "error";
      this.confirmacionSwal.show(); */
    }

    this.calcularTotal();
  }

  validarCliente() {
    if (typeof this.DatosCliente != 'object') {
      this.DatosCliente = '';
      Swal.fire({
        icon: 'warning',
        title: 'Cliente incorrecto',
        text: 'El cliente que has ingresado es incorrecto.',
      });
    }

    this.FacturaCliente = [];
    this.Lista_Productos = [];
    this.SubTotalGeneral = 0;
    this.Total = 0;
    this.Codigo_Factura = '';
  }
  calcularTotal() {
    let acumulador = 0;
    if (this.Lista_Productos) {
      this.Lista_Productos.forEach((producto) => {
        if (!producto.Disabled) {
          acumulador += producto.Valor_Nota;
        }
      });
    }
    this.Total = acumulador;
  }

  setearValores() {
    this.Cliente = [];
    this.DatosCliente = '';
    this.FacturaCliente = [];
    this.Lista_Productos = [];
    this.SubTotalGeneral = 0;
    this.Total = 0;
    this.Codigo_Factura = '';
  }
}
