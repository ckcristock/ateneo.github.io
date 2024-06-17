import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
// import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
// import { TimerObservable } from 'rxjs/observable/TimerObservable';
// import 'rxjs/add/operator/takeWhile';
// import { AutoCompleteService } from 'ng4-auto-complete';
// import { NotificationsService } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';
// import { count } from 'rxjs/operator/count';
// import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
// import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Globales } from 'src/app/pages/inventario/services/globales-datos';
import { Router } from '@angular/router';
// import { timeout } from 'q';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { DispensacionService } from '../../services/dispensacion.service';
// import { GeneralService } from '../shared/services/general/general.service';
// import { SwalService } from '../shared/services/swal/swal.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TablafacturacionComponent } from '../tablafacturacion/tablafacturacion.component';
// import { exit } from 'process';
import { environment } from 'src/environments/environment';
import { ApiDianService } from '../../services/api-dian.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Location } from '@angular/common';
import { skipContentType } from 'src/app/http.context';
import { ModalBasicComponent } from 'src/app/components/modal-basic/modal-basic.component';
import { ModalactaentregaComponent } from '../../dispensaciones/modalactaentrega/modalactaentrega.component';

@Component({
  standalone: true,
  imports: [
    ModalactaentregaComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgbDropdownModule,
    TablafacturacionComponent,
    ModalBasicComponent,
  ],
  providers: [RouterModule, Router, ApiDianService, DispensacionService, Globales],
  selector: 'app-cmfacturacrear',
  templateUrl: './cmfacturacrear.component.html',
  styleUrls: ['./cmfacturacrear.component.scss'],
})
export class CmfacturacrearComponent implements OnInit {
  public alertOption: SweetAlertOptions = {};
  public band_guardar: boolean = true;
  public id = this.route.snapshot.params['id'];
  ListaGananciaFactura: any;
  BodegaFactura: any;
  ListaProductoFactura: any;
  precioCumFactura: any;
  diaPagoClienteFactura: any;
  public Fecha_Actual = new Date();
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer2 = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Iva);
  public reducer3 = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total_Descuento);
  public Lista_Productos_Factura: any = [
    {
      Id_Producto: '',
      producto: '',
      Lote: '',
      Id_Inventario: '',
      Cum: '',
      Invima: '',
      Fecha_Vencimiento: '',
      Laboratorio_Generico: '',
      Laboratorio_Comercial: '',
      Presentacion: '',
      Cantidad: 0,
      Gravado: '',
      Descuento: 0,
      Impuesto: 0,
      Iva: 0,
      Subtotal: 0,
      Precio: 0,
      Precio_Venta_Factura: 0,
      CostoUnitario: 0,
      Total_Descuento: 0,
      Id_Producto_Dispensacion: '',
      Registrar: 1,
    },
  ];
  SubtotalFactura: number;
  IvaFactura: number;
  DescuentoFactura: number;
  TotalFactura: number;
  ImpuestoFactura: any;

  Hom_Switch: boolean = true;
  Fact_Switch: boolean = true;

  ListaGananciaHomologo: any;
  BodegaHomologo: any;
  ListaProductoHomologo: any;
  precioCumHomologo: any;
  diaPagoClienteHomologo: string;
  public user: any = JSON.parse(localStorage.getItem('User'));
  public Lista_Productos_Homologo: any = [
    {
      Id_Producto: '',
      Cum_Homologo: '',
      Id_Producto_Dispensacion: '',
      producto: '',
      Lote: '',
      Fecha_Vencimiento: '',
      Invima: '',
      Precio: 0,
      Descuento: 0,
      Impuesto: 0,
      Iva: 0,
      Cantidad: 0,
      Subtotal: 0,
      Id_Inventario: '',
      Laboratorio_Generico: '',
      Laboratorio_Comercial: '',
      Cum: '',
      Presentacion: '',
      Total_Descuento: 0,
      Invima_Homologo: '',
      Presentacion_Homologo: '',
      Lab_Homologo: '',
      Id_Producto_Homologo: '',
      Detalle_Homologo: '',
      Registrar: 1,
    },
  ];
  SubtotalHomologo: number;
  TotalHomologo: number;
  ImpuestoHomologo: any;

  NombreClienteHomologo: any;
  NombreClienteFactura: any;
  ClienteHomologo: any;
  ClienteFactura: any = [];
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('FormFactura') FormFactura: any;
  @ViewChild('modalProductos') modalProductos: any;
  public divFactura = true;
  encabezado: any = [];
  IdClienteHomologo = [];
  IdClienteFactura = [];
  CondicionPagoHomologo: any;
  CondicionPago: any;
  ClienteFac: any;
  public Cuota: any = 0;
  filtro_lab_com: string = '';
  filtro_lab_gen: string = '';
  filtro_cum: string = '';
  Cargando: boolean = false;
  ListaProducto: any = [];
  filtro_nombre: string = '';
  Productos: any = [];
  posicion: number;
  band_editar: boolean;
  IvaHomologo: number;
  DescuentoHomologo: number;
  Tipo_Factura: any;

  public Mostrar_Homologo: boolean = false;

  headerData: any = {
    Titulo: 'Nueva factura',
    Fecha: new Date(),
  };

  //Nuevas variables 27-08-2019 - Franklin Guerra
  private Id_Punto: any = null;
  private environment: any;
  diaPAgo = new FormGroup({
    dia: new FormControl<Date | string | null>(new Date()),
  });
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private router: Router,
    private _dispensacionService: DispensacionService,
    private _apiDianService: ApiDianService,
    private swalService: SwalService,
    // private _swalService: SwalService,
    private location: Location,
  ) {
    this.Id_Punto = 1; //quemado por ahora
  }

  ngOnInit() {
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.ListaGananciaFactura = data;
        this.ListaGananciaHomologo = data;
      });

    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Bodega' },
      })
      .subscribe((data: any) => {
        this.BodegaFactura = data;
        this.BodegaHomologo = data;
      });

    this.http
      .get(environment.ruta + 'php/facturasventas/producto_bodega.php')
      .subscribe((data: any) => {
        this.ListaProductoFactura = data;
        this.ListaProductoHomologo = data;
      });

    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Impuesto' },
      })
      .subscribe((data: any) => {
        this.ImpuestoFactura = data;
        this.ImpuestoHomologo = data;
      });

    //peticion para traer los encabezado y productos de esa dispensación

    //peticion para traer los encabezado y productos de esa dispensación

    this.http
      .get(environment.ruta + 'php/dispensaciones/detalle_dispensacion_factura.php', {
        params: { id: this.id },
      })
      .subscribe((data: any) => {
        this.Lista_Productos_Factura = data.productos;
        this.Lista_Productos_Homologo = data.productoHomologo;
        this.NombreClienteHomologo = data.homologo.ClienteHomologo;
        this.NombreClienteFactura = data.factura.ClienteFactura;
        this.encabezado = data.encabezado;

        this.ClienteHomologo = data.homologo;
        this.ClienteFactura = data.factura;
        this.Mostrar_Homologo = data.es_homologo;
        this.IdClienteHomologo = data.homologo.IdClienteHomologo;
        this.IdClienteFactura = data.factura.IdClienteFactura;
        this.CondicionPagoHomologo = data.homologo.CondicionPagoHomologo;
        this.CondicionPago = data.factura.CondicionPago;
        this.ClienteFac = data.factura.ClienteFactura;

        const envio1 = this.Lista_Productos_Factura.find(
          (lista) => lista.Precio_Venta_Factura === 0,
        );
        const index = this.Lista_Productos_Factura.indexOf(envio1);
        if (index > -1) {
          this.Lista_Productos_Factura.splice(index);
        }
        if (this.encabezado.Dis_Pendientes != '') {
          // swal(
          //   this.encabezado.Dis_Pendientes,
          //   'La dispensacion actual generó la dis por pendientes ' + this.encabezado.Dis_Pendientes,
          //   'info',
          // );
          let swal = {
            icon: 'info',
            title: `${this.encabezado.Dis_Pendientes}`,
            text: `La dispensacion actual generó la dis por pendientes ${this.encabezado.Dis_Pendientes}`,
            timer: null,
          };
          this.swalService.show(swal);
        }
        this.Cuota = parseFloat(data.encabezado.Cuota);

        setTimeout(() => {
          this.Lista_Productos_Factura.push({
            Id_Producto: '',
            Nombre: '',
            Lote: '',
            Cum: '',
            Invima: '',
            Fecha_Vencimiento: '',
            Laboratorio_Comercial: '',
            Presentacion: '',
            Cantidad: 0,
            Gravado: 'No',
            Descuento: 0,
            Impuesto: 0,
            Iva: 0,
            Subtotal: 0,
            Precio: 0,
            Precio_Venta_Factura: 0,
            Total_Descuento: 0,
            Id_Producto_Dispensacion: '',
            Registrar: 1,
          });

          this.Lista_Productos_Homologo.push({
            Id_Producto: '',
            Detalle_Homologo: '',
            Lote: '',
            Cum_Homologo: '',
            Invima_Homologo: '',
            Fecha_Vencimiento: '',
            Lab_Homologo: '',
            Presentacion_Homologo: '',
            Cantidad: 0,
            Descuento: 0,
            Impuesto: 0,
            Iva: 0,
            Subtotal: 0,
            Precio: 0,
            Id_Producto_Dispensacion: '',
            Registrar: 1,
          });

          data.productos.forEach((element, index) => {
            this.CalculoTotal(index, 'Factura');
            this.CalculoTotal(index, 'Homologo');
            this.caluclarFechaPago(this.CondicionPagoHomologo, 'Homologo');
            this.caluclarFechaPago(this.CondicionPago, 'Factura');
            if (element.Cum_Homologo != '' && element.Cum_Homologo != undefined) {
              this.getDetalleCum(element.Cum_Homologo, index);
            }
          });
        }, 2000);
      });
    this.environment = environment;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.ListaProductoFactura.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );
  formatter = (x: { Nombre: string }) => x.Nombre;

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.ListaProductoHomologo.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );
  formatter1 = (x: { Nombre: string }) => x.Nombre;

  BuscarLote(modelo: any, pos, atr) {
    if (modelo.Lote != undefined) {
      let pos2 = pos + 1;

      switch (atr) {
        case 'Factura': {
          var precioLista = this.ListaProductoFactura.find((x) => x.cum === modelo.cum);

          this.Lista_Productos_Factura[pos].Lote = modelo.Lote;
          this.Lista_Productos_Factura[pos].Id_Inventario = modelo.IdInventario;
          this.Lista_Productos_Factura[pos].Fecha_Vencimiento = modelo.Fecha_Vencimiento;
          this.Lista_Productos_Factura[pos].Invima = modelo.Invima;
          this.Lista_Productos_Factura[pos].Laboratorio_Generico = modelo.Laboratorio_Generico;
          this.Lista_Productos_Factura[pos].Precio = precioLista.precio;

          if (this.Lista_Productos_Factura[pos2] == undefined) {
            this.Lista_Productos_Factura.push({
              producto: '',
              Lote: '',
              Id_Inventario: '',
              Cum: '',
              Invima: '',
              Fecha_Vencimiento: '',
              Laboratorio_Generico: '',
              Laboratorio_Comercial: '',
              Presentacion: '',
              Cantidad: 0,
              Gravado: '',
              Descuento: 0,
              Impuesto: 0,
              Iva: 0,
              Subtotal: 0,
              Precio: 0,
              Precio_Venta_Factura: 0,
              CostoUnitario: 0,
              Total_Descuento: 0,
              Id_Producto_Dispensacion: '',
              Registrar: 1,
            });
          }
          break;
        }
        case 'Homologo': {
          var precioLista = this.ListaProductoHomologo.find((x) => x.cum === modelo.cum);

          this.Lista_Productos_Homologo[pos].Lote = modelo.Lote;
          this.Lista_Productos_Homologo[pos].Id_Inventario = modelo.IdInventario;
          this.Lista_Productos_Homologo[pos].Fecha_Vencimiento = modelo.Fecha_Vencimiento;
          this.Lista_Productos_Homologo[pos].Invima = modelo.Invima;
          this.Lista_Productos_Homologo[pos].Laboratorio_Generico = modelo.Laboratorio_Generico;
          this.Lista_Productos_Homologo[pos].Precio = precioLista.precio;

          if (this.Lista_Productos_Homologo[pos2] == undefined) {
            this.Lista_Productos_Homologo.push({
              producto: '',
              Lote: '',
              Fecha_Vencimiento: '',
              Invima: '',
              Precio: 0,
              Descuento: 0,
              Impuesto: 0,
              Iva: 0,
              Cantidad: 0,
              Subtotal: 0,
              Id_Inventario: '',
              Laboratorio_Generico: '',
              Laboratorio_Comercial: '',
              Cum: '',
              Presentacion: '',
              Cum_Homologo: '',
              Id_Producto: '',
              Id_Producto_Dispensacion: '',
              Total_Descuento: 0,
              Invima_Homologo: '',
              Presentacion_Homologo: '',
              Lab_Homologo: '',
              Id_Producto_Homologo: '',
              Detalle_Homologo: '',
              Registrar: 1,
            });
          }
          break;
        }
      }
    }
  }
  CambiarSwitch() {
    setTimeout(() => {
      if (this.Fact_Switch === false && this.Hom_Switch === false) {
        //   this.confirmacionSwal.title = 'Error en la Inhabilitacion';
        //   this.confirmacionSwal.text = 'No se Pueden Inhabilitar las dos Facturas ';
        //   this.confirmacionSwal.type = 'error';
        //   this.confirmacionSwal.show();
        let swal = {
          icon: 'warning',
          title: 'Error en la Inhabilitacion',
          text: 'No se Pueden Inhabilitar las dos Facturas',
          timer: null,
          showCancel: false,
        };
        this.swalService.show(swal);
        this.Fact_Switch = true;
        this.Hom_Switch = false;
      }
    }, 200);
  }
  ListaProductosBodega(Bodega, atr) {
    if (Bodega != '') {
      this.http
        .get(environment.ruta + 'php/facturasventas/producto_bodega.php', {
          params: { IdBodega: Bodega },
        })
        .subscribe((data: any) => {
          switch (atr) {
            case 'Factura': {
              this.ListaProductoFactura = data;
              break;
            }
            case 'Homologo': {
              this.ListaProductoHomologo = data;
              break;
            }
          }
        });
    }
  }

  CalculoTotal(pos, atr) {
    switch (atr) {
      case 'Factura': {
        var Cantidad = this.Lista_Productos_Factura[pos].Cantidad;
        var Descuento = this.Lista_Productos_Factura[pos].Descuento;
        var Precio = this.Lista_Productos_Factura[pos].Precio_Venta_Factura;
        var Impuesto = this.Lista_Productos_Factura[pos].Impuesto;

        let subtotal = parseInt(Cantidad) * parseFloat(Precio);
        let Desc = parseFloat(Descuento) * parseInt(Cantidad);
        let impues = (subtotal - Desc) * parseFloat(Impuesto);

        this.Lista_Productos_Factura[pos].Precio = parseFloat(Precio);
        this.Lista_Productos_Factura[pos].Cantidad = parseInt(Cantidad);
        this.Lista_Productos_Factura[pos].Subtotal = subtotal;
        this.Lista_Productos_Factura[pos].Iva = impues;
        this.Lista_Productos_Factura[pos].Total_Descuento = Desc;
        this.SubtotalFactura = parseFloat(this.Lista_Productos_Factura.reduce(this.reducer, 0));
        this.IvaFactura = parseFloat(this.Lista_Productos_Factura.reduce(this.reducer2, 0));
        this.DescuentoFactura = parseFloat(this.Lista_Productos_Factura.reduce(this.reducer3, 0));
        this.TotalFactura =
          this.SubtotalFactura - this.DescuentoFactura + this.IvaFactura - this.Cuota;
        break;
      }
      case 'Homologo': {
        if ($('#CantidadHomologo' + pos).length > 0) {
          // Si existe el elemento
          let Cantidad = (document.getElementById('CantidadHomologo' + pos) as HTMLInputElement)
            .value;
          let Descuento = (document.getElementById('descuentoHomologo' + pos) as HTMLInputElement)
            .value;
          let Precio = (document.getElementById('PrecioVentaHomologo' + pos) as HTMLInputElement)
            .value;
          let Impuesto = (document.getElementById('impuestoHomologo' + pos) as HTMLInputElement)
            .value;

          let subtotal = parseInt(Cantidad) * parseFloat(Precio);
          let Desc = parseFloat(Descuento);
          let impues = (subtotal - Desc) * parseFloat(Impuesto);

          // if (Impuesto != "" && PrecioVenta > 0) {
          this.Lista_Productos_Homologo[pos].Precio = parseFloat(Precio);
          this.Lista_Productos_Homologo[pos].Cantidad = parseInt(Cantidad);
          this.Lista_Productos_Homologo[pos].Subtotal = subtotal;
          this.Lista_Productos_Homologo[pos].Iva = impues;
          this.Lista_Productos_Homologo[pos].Total_Descuento = Desc;

          this.SubtotalHomologo = parseFloat(this.Lista_Productos_Homologo.reduce(this.reducer, 0));
          this.IvaHomologo = parseFloat(this.Lista_Productos_Homologo.reduce(this.reducer2, 0));
          this.DescuentoHomologo = parseFloat(
            this.Lista_Productos_Homologo.reduce(this.reducer3, 0),
          );
          this.TotalHomologo = this.SubtotalHomologo + this.IvaHomologo;

          // }
        }

        break;
      }
    }
  }

  reCalcular(tipo) {
    switch (tipo) {
      case 'Factura':
        let Cuota = parseInt((document.getElementById('Cuota') as HTMLInputElement).value);

        this.SubtotalFactura = parseFloat(this.Lista_Productos_Factura.reduce(this.reducer, 0));
        this.IvaFactura = parseFloat(this.Lista_Productos_Factura.reduce(this.reducer2, 0));
        this.DescuentoFactura = parseFloat(this.Lista_Productos_Factura.reduce(this.reducer3, 0));
        this.TotalFactura = this.SubtotalFactura - this.DescuentoFactura + this.IvaFactura - Cuota;

        break;
      case 'Homologo':
        this.SubtotalHomologo = parseFloat(this.Lista_Productos_Homologo.reduce(this.reducer, 0));
        this.IvaHomologo = parseFloat(this.Lista_Productos_Homologo.reduce(this.reducer2, 0));
        this.DescuentoHomologo = parseFloat(this.Lista_Productos_Homologo.reduce(this.reducer3, 0));
        this.TotalHomologo = this.SubtotalHomologo - this.DescuentoHomologo + this.IvaHomologo;
        break;
    }
  }

  validarFacturas() {
    this.band_guardar = true; // reinicializar
    if (this.Fact_Switch) {
      if (this.Mostrar_Homologo) {
        if (this.TotalFactura >= 0 && this.TotalHomologo > 0) {
          this.validarSegundaParte();
        } else {
          //error
          let swal = {
            icon: 'warning',
            title: 'Error',
            text: 'No puede generar una factura con Homologo totales negativos.',
            timer: null,
            showCancel: false,
          };
          this.swalService.show(swal);
        }
      } else {
        if (this.TotalFactura > 0) {
          this.validarSegundaParte();
        } else {
          //error
          // this.confirmacionSwal.title = 'Error';
          // this.confirmacionSwal.text = 'No puede generar una factura con totales negativos.';
          // this.confirmacionSwal.type = 'error';
          // this.confirmacionSwal.show();
          let swal = {
            icon: 'warning',
            title: 'Error',
            text: 'No puede generar una factura con totales negativos.',
            timer: null,
            showCancel: false,
          };
          this.swalService.show(swal);
        }
      }
    } else {
      this.GuardarFactura(this.FormFactura);
    }
  }

  validarSegundaParte() {
    if (this.encabezado.Servicio == 'No Pos' && this.encabezado.Id_Regimen == '2') {
      if (this.Lista_Productos_Factura.length == this.Lista_Productos_Homologo.length) {
        // Sirve para validar si un producto homologo sea igual a uno de los productos de la factura nopos.
        for (let i = 0; i < this.Lista_Productos_Factura.length; i++) {
          if (
            parseInt(this.Lista_Productos_Factura[i].Id_Producto) ===
            parseInt(this.Lista_Productos_Homologo[i].Id_Producto)
          ) {
            this.band_guardar = false;
            break;
          }
        }
      }
    }

    setTimeout(() => {
      if (this.Fact_Switch && this.Hom_Switch) {
        if (this.band_guardar) {
          this.GuardarFactura(this.FormFactura);
        } else {
          // this.confirmacionSwal.title = 'Error';
          // this.confirmacionSwal.text =
          //   'Ninguno de los Productos Homologos pueden ser iguales a los productos de la Factura NoPos, Ni puede ser vacío. Por favor verificar';
          // this.confirmacionSwal.type = 'error';
          // this.confirmacionSwal.show();
          let swal = {
            icon: 'warning',
            title: 'Error',
            text: 'Ninguno de los Productos Homologos pueden ser iguales a los productos de la Factura NoPos, Ni puede ser vacío. Por favor verificar',
            timer: null,
            showCancel: false,
          };
          this.swalService.show(swal);
        }
      } else {
        this.GuardarFactura(this.FormFactura);
      }
    }, 500);
  }

  GuardarFactura(formulario: NgForm) {
    if (!this._validarProductosConPrecioCero()) {
      return;
    } else if (this.Mostrar_Homologo && !this._validarProductosConPrecioCeroHomologo()) {
      return;
    } else {
      var homologo = {};
      if ($('#Id_Cliente_Homologo').length > 0) {
        // Si existe el homologo
        homologo = {
          Id_Cliente: (document.getElementById('Id_Cliente_Homologo') as HTMLInputElement).value,
          Observacion_Factura: (document.getElementById('Observacion_Homologo') as HTMLInputElement)
            .value,
          Estado_Factura: 'Sin Cancelar',
          Id_Dispensacion: this.id,
          Condicion_Pago: parseInt(
            (document.getElementById('Condicion_Pago_Homologo') as HTMLInputElement).value,
          ),
          Fecha_Pago: (document.getElementById('Fecha_Pago_Homologo') as HTMLInputElement).value,
          Tipo: 'Homologo',
          Id_Funcionario: parseInt(this.user.Identificacion_Funcionario),
          Cuota: parseInt((document.getElementById('Cuota_Hom') as HTMLInputElement).value),
        };
      }

      let encabezadoHomologo = JSON.stringify(homologo);
      let prod = JSON.stringify(this.Lista_Productos_Factura);
      let prod1 = JSON.stringify(this.Lista_Productos_Homologo);
      let datos = new FormData();

      if (this.divFactura != false) {
        var factura = {
          Id_Cliente: (document.getElementById('Id_Cliente_Factura') as HTMLInputElement).value,
          Observacion_Factura: (document.getElementById('Observacion_Factura') as HTMLInputElement)
            .value,
          Estado_Factura: 'Sin Cancelar',
          Id_Dispensacion: this.id,
          Condicion_Pago: parseInt(
            (document.getElementById('Condicion_Pago_Factura') as HTMLInputElement).value,
          ),
          Fecha_Pago: (document.getElementById('Fecha_Pago_Factura') as HTMLInputElement).value,
          Tipo: 'Factura',
          Id_Funcionario: parseInt(this.user.Identificacion_Funcionario),
          Cuota: parseInt((document.getElementById('Cuota') as HTMLInputElement).value),
        };
        let encabezadoFactura = JSON.stringify(factura);
        datos.append('encabezadoFactura', encabezadoFactura);
      }

      datos.append('modulo', 'Factura');
      datos.append('datos', JSON.stringify(this.encabezado));

      if (this.encabezado != 'Evento') {
        datos.append('encabezadoHomologo', encabezadoHomologo);
        datos.append('productos1', prod1);
      }
      let homo: any = this.Hom_Switch;
      let fact: any = this.Fact_Switch;
      datos.append('productos', prod);
      datos.append('switch_hom', homo);
      datos.append('switch_fact', fact);
      this.http
        .post(environment.ruta + 'php/facturasventas/guardar_factura_dev.php', datos, {
          context: skipContentType(),
        })
        .subscribe(
          (data: any) => {
            // this.confirmacionSwal.title = data.titulo;
            // this.confirmacionSwal.text = data.mensaje;
            // this.confirmacionSwal.type = data.tipo;
            // this.confirmacionSwal.show();
            let swal = {
              icon: 'warning',
              title: data.titulo,
              text: data.mensaje,
              timer: null,
              showCancel: false,
            };
            this.swalService.show(swal);

            if (data.tipo === 'success') {
              this.VerPantallaLista();
              this.FormFactura.reset();
            }

            if (data.Id != undefined) {
              if (data.Factura) {
                this.transmitir_dian(data.Factura, data.Id);
              }

              if (data.Fact != undefined && data.Fact == 'Homologo') {
                window.open(
                  environment.ruta +
                    'php/facturasventas/factura_dis_pdf.php?id=' +
                    data.Id +
                    '&Tipo=Homologo',
                  '_blank',
                );
              }
            }
          },
          (error) => {
            // this.confirmacionSwal.title = 'Se perdió la conexión';
            // this.confirmacionSwal.text =
            //   'Lo sentimos, ha ocurrido un error inesperado en el proceso de facturación. Si el problema persiste por favor comunicarse con soporte técnico antes de continuar intentando.';
            // this.confirmacionSwal.type = 'info';
            // this.confirmacionSwal.show();
            let swal = {
              icon: 'info',
              title: 'Se perdió la conexión',
              text: 'Lo sentimos, ha ocurrido un error inesperado en el proceso de facturación. Si el problema persiste por favor comunicarse con soporte técnico antes de continuar intentando.',
              timer: null,
              showCancel: false,
            };
            this.swalService.show(swal);
          },
        );
    }
  }

  transmitir_dian(datos, id_factura) {
    let payload = new FormData();
    payload.append('metodo', 'invoice');
    payload.append('datos', JSON.stringify(datos));
    this._apiDianService.transmitirDian(payload).subscribe(
      (datos: any) => {
        this.actualizarBase(datos, id_factura);
      },
      (error) => {
        throw new Error(error.message);
      },
    );
  }

  actualizarBase(datos, id_factura) {
    let payload = new FormData();
    payload.append('datos', JSON.stringify(datos));
    payload.append('tipo', 'Factura');
    payload.append('id', id_factura);

    let url = `${environment.ruta}php/facturacion_electronica/actualizar_factura.php`;
    this.http.post(url, payload).subscribe(
      (datos: any) => {
        var form = document.createElement('form');
        form.action = environment.ruta + 'php/facturasventas/factura_dis_pdf.php';
        form.method = 'POST';
        form.target = '_blank';
        form.style.display = 'none';

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'id';
        input.value = id_factura;

        var submit = document.createElement('input');
        submit.type = 'submit';

        form.appendChild(input);
        form.appendChild(submit);
        document.body.appendChild(form);

        $('#submitProject').click();

        document.body.removeChild(form);
      },
      (e) => {
        throw new Error(e.message);
      },
    );
  }

  VerPantallaLista() {
    this.router.navigate(['cmfacturacion']);
  }

  BuscarPrecioListaGanancia(event, atr) {
    //llamar a la api que me traera las remisiones
    if (event != null) {
      this.http
        .get(environment.ruta + '/php/facturasventas/detalle_producto_lista_ganancia.php', {
          params: { IdListaGanancia: event },
        })
        .subscribe((data: any) => {
          switch (atr) {
            case 'Factura': {
              this.precioCumFactura = data;
              break;
            }
            case 'Homologo': {
              this.precioCumHomologo = data;
              break;
            }
          }
        });
    }
  }

  caluclarFechaPago(value, atr) {
    var myDate = new Date();
    var diaPago = new Date(myDate.setDate(myDate.getDate() + parseInt(value)));
    switch (atr) {
      case 'Factura': {
        if (parseInt(value) == 1) {
          let hoy = new Date();

          this.diaPagoClienteFactura = hoy.toISOString().split('T')[0];
        } else {
          // this.diaPagoClienteFactura = diaPago.toISOString().split('T')[0];
          this.diaPagoClienteFactura = this.diaPAgo.get('dia');
        }

        break;
      }
      case 'Homologo': {
        this.diaPagoClienteHomologo = diaPago.toISOString().split('T')[0];
        break;
      }
    }
  }

  filtros() {
    let params: any = {};

    params.tipo_factura = this.Tipo_Factura;
    params.servicio = this.encabezado.Id_Tipo_Servicio;
    params.eps = this.encabezado.Nit;

    if (this.filtro_lab_com != '' || this.filtro_lab_gen != '' || this.filtro_cum != '') {
      this.Cargando = true;
      this.ListaProducto = [];

      if (this.filtro_nombre != '') {
        params.nom = this.filtro_nombre;
      }
      if (this.filtro_lab_com != '') {
        params.lab_com = this.filtro_lab_com;
      }
      if (this.filtro_lab_gen != '') {
        params.lab_gen = this.filtro_lab_gen;
      }
      if (this.filtro_cum != '') {
        params.cum = this.filtro_cum;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.http
        .get(environment.ruta + 'php/facturasventas/lista_productos.php?' + queryString)
        .subscribe((data: any) => {
          this.Cargando = false;
          this.ListaProducto = data;
        });
    } else {
      this.filtro_lab_com = '';
      this.filtro_lab_gen = '';
      this.filtro_cum = '';
      this.Cargando = true;
      this.ListaProducto = [];

      this.http
        .get(environment.ruta + 'php/facturasventas/lista_productos.php', {
          params: {
            nom: this.filtro_nombre,
            tipo_factura: this.Tipo_Factura,
            servicio: this.encabezado.Id_Tipo_Servicio,
            eps: this.encabezado.Nit,
          },
        })
        .subscribe((data: any) => {
          this.Cargando = false;
          this.ListaProducto = data;
        });
    }
  }

  searchProduct(pos, editar?, tipo?) {
    this.ListaProducto = [];
    this.Productos = [];
    this.filtro_nombre = '';
    this.filtro_lab_com = '';
    this.filtro_lab_gen = '';
    this.filtro_cum = '';
    this.posicion = pos;
    this.band_editar = editar;
    this.Tipo_Factura = tipo;
  }

  addProduct(pos) {
    let prod = this.ListaProducto[pos];

    let p = {
      id_tipo_servicio: this.encabezado.Id_Tipo_Servicio,
      eps: this.encabezado.Nit,
      id_producto: prod.Id_Producto,
      id_punto: this.Id_Punto,
    };

    this._dispensacionService.ValidarProductoLista(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        let modelo: any = {
          Presentacion: prod.Presentacion,
          Id_Producto: prod.Id_Producto,
          Nombre: prod.Nombre,
          Cum: prod.Codigo_Cum,
          Invima: prod.Invima,
          Laboratorio_Comercial: prod.Laboratorio_Comercial,
          Costo: prod.Costo,
          Precio_Venta_Factura: prod.Precio_Venta_Factura,
          Regulado: prod.Regulado,
        };

        this.Productos = [];
        this.Productos.push(modelo);
      } else {
        $('#check' + pos).prop('checked', false);
        this.swalService.ShowMessage(data);
      }
    });
  }

  AgregarProducto() {
    let editar_producto = this.band_editar;

    this.Productos.forEach((valor, i) => {
      if (this.Tipo_Factura == 'Factura') {
        if (
          this.Lista_Productos_Factura.length == 1 &&
          this.Lista_Productos_Factura[0].Id_Producto == undefined
        ) {
          // Cuando la lista de productos está vacía o inicializada por primera vez.
          this.Lista_Productos_Factura[0].Presentacion = valor.Presentacion;
          this.Lista_Productos_Factura[0].Nombre = valor.Nombre;
          this.Lista_Productos_Factura[0].Id_Producto = valor.Id_Producto;
          this.Lista_Productos_Factura[0].Invima = valor.Invima;
          this.Lista_Productos_Factura[0].Cum = valor.Cum;
          this.Lista_Productos_Factura[0].Precio_Venta_Factura = valor.Precio_Venta_Factura;
          this.Lista_Productos_Factura[0].Registrar = 1;

          this.Lista_Productos_Factura[0].Id_Producto_Dispensacion = 0;
          this.Lista_Productos_Factura[0].Regulado = valor.Regulado;
        } else if (this.band_editar) {
          // Cuando se quiere editar un producto.
          this.Lista_Productos_Factura[this.posicion].Presentacion = valor.Presentacion;
          this.Lista_Productos_Factura[this.posicion].Nombre = valor.Nombre;
          this.Lista_Productos_Factura[this.posicion].Id_Producto = valor.Id_Producto;
          this.Lista_Productos_Factura[this.posicion].Invima = valor.Invima;
          this.Lista_Productos_Factura[this.posicion].Cum = valor.Cum;
          this.Lista_Productos_Factura[this.posicion].Laboratorio_Comercial =
            valor.Laboratorio_Comercial;
          this.Lista_Productos_Factura[this.posicion].Precio_Venta_Factura =
            valor.Precio_Venta_Factura;
          this.Lista_Productos_Factura[this.posicion].Registrar = 1;

          this.Lista_Productos_Factura[this.posicion].Id_Producto_Dispensacion = 0;
          this.Lista_Productos_Factura[this.posicion].Regulado = valor.Regulado;
        } else {
          // Cuando se quiere agregar nuevos productos.

          if (
            this.Lista_Productos_Factura.length > 1 &&
            this.Lista_Productos_Factura[this.posicion].Id_Producto == ''
          ) {
            // Si la lista de productos estaba llena y la posicion donde se está buscando el producto estaba vacía, edita el campo actual.
            this.Lista_Productos_Factura[this.posicion].Presentacion = valor.Presentacion;
            this.Lista_Productos_Factura[this.posicion].Nombre = valor.Nombre;
            this.Lista_Productos_Factura[this.posicion].Id_Producto = valor.Id_Producto;
            this.Lista_Productos_Factura[this.posicion].Invima = valor.Invima;
            this.Lista_Productos_Factura[this.posicion].Cum = valor.Cum;
            this.Lista_Productos_Factura[this.posicion].Laboratorio_Comercial =
              valor.Laboratorio_Comercial;
            this.Lista_Productos_Factura[this.posicion].Precio_Venta_Factura =
              valor.Precio_Venta_Factura;
            this.Lista_Productos_Factura[this.posicion].Registrar = 1;
            this.Lista_Productos_Factura[this.posicion].Id_Producto_Dispensacion = 0;
            this.Lista_Productos_Factura[this.posicion].Regulado = valor.Regulado;
          } else {
            if (editar_producto) {
              // Si se editó un producto, se declara esta condicional como bandera para que elimine el ultimo campo en blanco y pueda añadir en la lista de productos sin problema.
              let last_position = this.Lista_Productos_Factura.length - 1;
              this.Lista_Productos_Factura.splice(last_position, 1);
              editar_producto = false;
            }
          }
        }

        setTimeout(() => {
          this.reCalcular(this.Tipo_Factura);
        }, 500);
      } else {
        if (
          this.Lista_Productos_Homologo.length == 1 &&
          this.Lista_Productos_Homologo[0].Id_Producto == undefined
        ) {
          // Cuando la lista de productos está vacía o inicializada por primera vez.
          this.Lista_Productos_Homologo[0].Detalle_Homologo = valor.Nombre;
          this.Lista_Productos_Homologo[0].Presentacion_Homologo = valor.Presentacion;
          this.Lista_Productos_Homologo[0].Id_Producto = valor.Id_Producto;
          this.Lista_Productos_Homologo[0].Invima_Homologo = valor.Invima;
          this.Lista_Productos_Homologo[0].Cum_Homologo = valor.Cum;
          this.Lista_Productos_Homologo[0].Lab_Homologo = valor.Laboratorio_Comercial;
          this.Lista_Productos_Homologo[0].Registrar = 1;
          this.Lista_Productos_Homologo[0].Lote = this.Lista_Productos_Factura[0].Lote;
          this.Lista_Productos_Homologo[0].Fecha_Vencimiento =
            this.Lista_Productos_Factura[0].Fecha_Vencimiento;
          this.Lista_Productos_Homologo[0].Id_Producto_Dispensacion =
            this.Lista_Productos_Factura[0].Id_Producto_Dispensacion;
        } else if (this.band_editar) {
          // Cuando se quiere editar un producto.
          this.Lista_Productos_Homologo[this.posicion].Detalle_Homologo = valor.Nombre;
          this.Lista_Productos_Homologo[this.posicion].Presentacion_Homologo = valor.Presentacion;
          this.Lista_Productos_Homologo[this.posicion].Id_Producto = valor.Id_Producto;
          this.Lista_Productos_Homologo[this.posicion].Invima_Homologo = valor.Invima;
          this.Lista_Productos_Homologo[this.posicion].Cum_Homologo = valor.Cum;
          this.Lista_Productos_Homologo[this.posicion].Lab_Homologo = valor.Laboratorio_Comercial;
          this.Lista_Productos_Homologo[this.posicion].Laboratorio_Comercial =
            valor.Laboratorio_Comercial;
          this.Lista_Productos_Homologo[this.posicion].Registrar = 1;
          this.Lista_Productos_Homologo[this.posicion].Lote =
            this.Lista_Productos_Factura[this.posicion].Lote;
          this.Lista_Productos_Homologo[this.posicion].Fecha_Vencimiento =
            this.Lista_Productos_Factura[this.posicion].Fecha_Vencimiento;
          this.Lista_Productos_Homologo[this.posicion].Id_Producto_Dispensacion =
            this.Lista_Productos_Factura[this.posicion].Id_Producto_Dispensacion;
        } else {
          // Cuando se quiere agregar nuevos productos.

          if (
            this.Lista_Productos_Homologo.length > 1 &&
            this.Lista_Productos_Homologo[this.posicion].Id_Producto == ''
          ) {
            // Si la lista de productos estaba llena y la posicion donde se está buscando el producto estaba vacía, edita el campo actual.
            this.Lista_Productos_Homologo[this.posicion].Detalle_Homologo = valor.Nombre;
            this.Lista_Productos_Homologo[this.posicion].Presentacion_Homologo = valor.Presentacion;
            this.Lista_Productos_Homologo[this.posicion].Id_Producto = valor.Id_Producto;
            this.Lista_Productos_Homologo[this.posicion].Invima_Homologo = valor.Invima;
            this.Lista_Productos_Homologo[this.posicion].Cum_Homologo = valor.Cum;
            this.Lista_Productos_Homologo[this.posicion].Lab_Homologo = valor.Laboratorio_Comercial;
            this.Lista_Productos_Homologo[this.posicion].Laboratorio_Comercial =
              valor.Laboratorio_Comercial;
            this.Lista_Productos_Homologo[this.posicion].Registrar = 1;
            this.Lista_Productos_Homologo[this.posicion].Lote =
              this.Lista_Productos_Factura[this.posicion].Lote;
            this.Lista_Productos_Homologo[this.posicion].Fecha_Vencimiento =
              this.Lista_Productos_Factura[this.posicion].Fecha_Vencimiento;
            this.Lista_Productos_Homologo[this.posicion].Id_Producto_Dispensacion =
              this.Lista_Productos_Factura[this.posicion].Id_Producto_Dispensacion;
          } else {
            if (editar_producto) {
              // Si se editó un producto, se declara esta condicional como bandera para que elimine el ultimo campo en blanco y pueda añadir en la lista de productos sin problema.
              let last_position = this.Lista_Productos_Homologo.length - 1;
              this.Lista_Productos_Homologo.splice(last_position, 1);
              editar_producto = false;
            }
          }
        }
      }
    });

    if (this.Tipo_Factura == 'Factura') {
      // Solo se agrega un item vacío para facturas no pos (por ahora).
      let pos = this.Lista_Productos_Factura.length - 1;

      if (this.Lista_Productos_Factura[pos].Nombre != '') {
        // Si en la ultima posición del Array ya no es vacío se agrega un nuevo campo para una nueva busqueda.
        this.Lista_Productos_Factura.push({
          Id_Producto: '',
          Nombre: '',
          Lote: '',
          Cum: '',
          Invima: '',
          Fecha_Vencimiento: '',
          Laboratorio_Comercial: '',
          Presentacion: '',
          Cantidad: 0,
          Gravado: 'No',
          Descuento: 0,
          Impuesto: 0,
          Iva: 0,
          Subtotal: 0,
          Precio: 0,
          Precio_Venta_Factura: 0,
          Total_Descuento: 0,
          Id_Producto_Dispensacion: '',
          Registrar: 1,
        });
      }
    } else {
      let pos = this.Lista_Productos_Homologo.length - 1;

      if (this.Lista_Productos_Homologo[pos].Detalle_Homologo != '') {
        // Si en la ultima posición del Array ya no es vacío se agrega un nuevo campo para una nueva busqueda.
        this.Lista_Productos_Homologo.push({
          Id_Producto: '',
          Detalle_Homologo: '',
          Lote: '',
          Cum_Homologo: '',
          Invima_Homologo: '',
          Fecha_Vencimiento: '',
          Lab_Homologo: '',
          Presentacion_Homologo: '',
          Cantidad: 0,
          Descuento: 0,
          Impuesto: 0,
          Iva: 0,
          Subtotal: 0,
          Precio: 0,
          Id_Producto_Dispensacion: '',
          Registrar: 1,
        });
      }
    }

    this.modalProductos.hide();
    this.Productos = [];
  }

  deleteProduct(posicion) {
    this.Lista_Productos_Homologo.splice(posicion, 1);
    this.CalculoTotal(posicion, 'Homologo');
  }

  deleteProductFactura(posicion) {
    this.Lista_Productos_Factura.splice(posicion, 1);
    this.CalculoTotal(posicion, 'Factura');
  }

  getDetalleCum(cum: string, pos: number) {
    this.http
      .get(environment.ruta + 'php/GENERALES/productos/detalle_per_cum.php', {
        params: { cum: cum },
      })
      .subscribe(
        (data: any) => {
          this.Lista_Productos_Homologo[pos].Id_Producto_Homologo = data.Id_Producto;
          this.Lista_Productos_Homologo[pos].Invima_Homologo = data.Invima;
          this.Lista_Productos_Homologo[pos].Lab_Homologo = data.Laboratorio_Comercial;
          this.Lista_Productos_Homologo[pos].Presentacion_Homologo = data.Presentacion;
        },
        (error) => {
          // this.confirmacionSwal.title = 'Error';
          // this.confirmacionSwal.text =
          //   'Ups! Ha ocurrido un error de conexión, si el problema persiste por favor comuniquese con soporte tecnico.';
          // this.confirmacionSwal.type = 'error';
          // this.confirmacionSwal.show();

          let swal = {
            icon: 'danger',
            title: 'Error',
            text: 'Ups! Ha ocurrido un error de conexión, si el problema persiste por favor comuniquese con soporte tecnico.',
            timer: null,
            showCancel: false,
          };
          this.swalService.show(swal);
        },
      );
  }

  private _validarProductosConPrecioCero(): boolean {
    for (let index = 0; index < this.Lista_Productos_Factura.length; index++) {
      if (index == this.Lista_Productos_Factura.length - 1) {
        return true;
      } else {
        if (parseInt(this.Lista_Productos_Factura[index].Precio_Venta_Factura) == 0) {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'El producto factura ' +
              this.Lista_Productos_Factura[index].Nombre +
              ' tiene precio 0, corrijalo para poder facturar!',
          ]);
          return false;
        }
      }
    }
  }

  private _validarProductosConPrecioCeroHomologo(): boolean {
    for (let index = 0; index < this.Lista_Productos_Homologo.length; index++) {
      if (index == this.Lista_Productos_Homologo.length - 1) {
        return true;
      } else {
        if (parseInt(this.Lista_Productos_Homologo[index].Precio) == 0) {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'El producto homologo ' +
              this.Lista_Productos_Homologo[index].Detalle_Homologo +
              ' tiene precio 0, corrijalo para poder facturar!',
          ]);
          return false;
        }
      }
    }
  }
  volver() {
    // this.location.back();
  }
  confirmarCrearFactura() {
    this.swalService.confirm('Se dispone a Guardar esta Factura').then((result) => {
      if (result.isConfirmed) {
        this.validarFacturas();
      }
    });
  }
}
