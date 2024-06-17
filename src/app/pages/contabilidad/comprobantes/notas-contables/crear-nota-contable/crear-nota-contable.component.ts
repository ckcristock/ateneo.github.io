import { ActivatedRoute, Router } from '@angular/router';
import { CabeceraComponent } from '../../../../../components/cabecera/cabecera.component';
import { CierrecontableService } from '../../../cierres-contables/cierrecontable.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass, DecimalPipe, CurrencyPipe } from '@angular/common';
import { NotasContablesService } from '../notas-contables.service';
import { skipContentType } from 'src/app/http.context';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-crear-nota-contable',
  templateUrl: './crear-nota-contable.component.html',
  styleUrls: ['./crear-nota-contable.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    CurrencyPipe,
    DecimalPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgbTypeahead,
    NgClass,
    NgFor,
    NgIf,
    TextFieldModule,
  ],
})
export class CrearNotaContableComponent implements OnInit {
  @ViewChild('cuentasF') cuentasF: NgForm;
  @ViewChild('FormNotaContable') FormNotaContable: any;
  Archivo: any;
  Centros: any = [];
  Concepto: string = '';
  confirmacionSwal: any;
  Documento: string = '';
  Facturas_Multiple: boolean = true;
  Id_Empresa: any = '';
  ListaFact: any = [];
  ListaRetenciones: any = [];
  Mostrar_Input_Cli: boolean = true;
  Mostrar_Opciones: boolean = true;
  Tipo_Beneficiario: any;
  Total_Facturas: number = 0;
  public Cargando: boolean = false;
  public Centro_Costo = '';
  public Cliente = [];
  public Codigo: string = '';
  public Costo_Ingreso = 0;
  public Cuenta = [];
  public Cuenta_Banco = '';
  public Cuentas: Array<any>;
  public Datos_Invalidos: any = false;
  public datosBorradores: any = {};
  public display_Banco: string = 'none';
  public Facturas: any = [];
  public fecha = new Date();
  public Fecha_Nota_Contable = this.fechaHoy();
  public Fecha: any = '';
  public FormaPago: any = [];
  public Funcionario = JSON.parse(localStorage.getItem('User'));
  public Id_Cliente = '';
  public Id_Proveedor: any = '';
  public idBorrador: any = '';
  public Impuesto = 0;
  public Mostrar_Cliente: boolean = false;
  public Mostrar_Facturas: boolean = false;
  public Mostrar: boolean = false;
  public Nom_Centro_Costo: any = '';
  public Nom_Cliente: any;
  public NombreProveedor: string = '';
  public position_document: number;
  public Proveedores: any[] = [];
  public Rentenciones: any[] = [];
  public RentencionesFactura: any[] = [];
  public Retenciones_Totales = 0;
  public Tipo_Comprobante = 'Nota Contable';
  public Total_Abono: number = 0;
  public Total_Credito_Niif: number = 0;
  public Total_Credito: number = 0;
  public Total_Debito_Niif: number = 0;
  public Total_Debito: number = 0;
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_deb = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Debito);
  public reducer_cred = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Credito);

  public reducer_deb_niif = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Deb_Niif);
  public reducer_cred_niif = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Cred_Niif);

  public reducer_valorp = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.ValorIngresado);
  public reducer_abono = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Abono);
  public reducer3 = (accumulator, currentValue) => {
    var acu_iva = 0;
    currentValue.RetencionesFacturas.forEach((v, i) => {
      acu_iva += parseFloat(v.Valor);
    });
    return accumulator + acu_iva;
  };

  public Cuentas_Contables: any[] = [
    {
      Cuenta: '',
      Nit: '',
      Centro_Costo: '',
      Documento: '',
      Concepto: '',
      Base: 0,
      Debito: 0,
      Credito: 0,
      Deb_Niif: 0,
      Cred_Niif: 0,
    },
  ];
  public datosCabecera: any = {
    Titulo: 'Nueva nota contable',
    Fecha: new Date(),
    Codigo: '',
  };
  public Lista_Facturas: any[] = [
    {
      RetencionesFactura: [],
    },
  ];

  constructor(
    private _general: CierrecontableService,
    private _notasContables: NotasContablesService,
    private _swal: SwalService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initialSetup();
    this.loadInitialsEndpoints();
    this.getCodigoNuevaNota();
  }

  initialSetup() {
    let queryParams = this.route.snapshot.queryParams;
    if (queryParams.facturas != undefined && queryParams.cliente != undefined) {
      this.Id_Cliente = queryParams.cliente;
      this.Cargando = true;
      this.Mostrar_Opciones = false;
      this.Mostrar_Cliente = true;
      this.http
        .get(environment.ruta + 'php/comprobantes/facturas_seleccionadas_cliente.php', {
          params: queryParams,
        })
        .subscribe((data: any) => {
          this.Mostrar = false;
          this.Cargando = false;
          this.Mostrar_Input_Cli = false;

          this.Lista_Facturas = data.Facturas;
          this.Nom_Cliente = data.Cliente.Nombre;
        });
    }
  }

  loadInitialsEndpoints() {
    // retenciones
    this.http
      .get(environment.base_url + '/php/contabilidad/lista_retenciones.php')
      .subscribe((data: any) => {
        this.ListaRetenciones = data;
      });
    this.http
      .get(environment.base_url + '/php/contabilidad/notascontables/nit_buscar.php')
      .subscribe((data: any) => {
        this.Cliente = data;
      });
    this.http.get(environment.base_url + '/php/comprobantes/cuentas.php').subscribe((data: any) => {
      this.Cuentas = data;
    });
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuenta = data.Activo;
      });
    this.http
      .get(environment.base_url + '/php/contabilidad/notascontables/centrocosto_buscar.php')
      .subscribe((data: any) => {
        this.Centros = data;
      });
  }

  getCodigoNuevaNota(fecha?: string) {
    let datos: any = {};

    if (fecha != undefined && fecha != null) {
      datos.Fecha = fecha;
    }
    console.log('paramsparamsparams', datos);

    this.http
      .get(environment.base_url + '/php/contabilidad/notascontables/get_codigo.php', {
        params: datos,
      })
      .subscribe((data: any) => {
        this.datosCabecera.Codigo = data.consecutivo;
        this.Codigo = data.consecutivo;
      });
  }

  ///////// FUNCS. LLAMADAS DESDE EL HTML
  onSaveVoucher() {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar y descargar el nuevo comprobante de egreso',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.guardarNotaContable(this.FormNotaContable);
        }
      });
  }

  guardarNotaContable(Formulario: NgForm) {
    let info = JSON.stringify(Formulario.value);
    let datos = new FormData();
    datos.append('Datos', info);
    datos.append('Cuentas_Contables', JSON.stringify(this.Cuentas_Contables));

    this.http
      .post(environment.base_url + '/php/contabilidad/notascontables/guardar_nota.php', datos, {
        context: skipContentType(),
      })
      .subscribe(
        (data: any) => {
          this.confirmacionSwal.title = data.titulo;
          this.confirmacionSwal.text = data.mensaje;
          this.confirmacionSwal.icon = data.tipo;
          this._swal.show(this.confirmacionSwal);
          if (data.tipo == 'success' && data.id != undefined) {
            window.open(
              environment.base_url +
                '/php/contabilidad/notascontables/descarga_pdf.php?id=' +
                data.id +
                '&tipo=Niif',
              '_blank',
            ); // SE IMPRIME EN FORMATO NIIF
            setTimeout(() => {
              this.router.navigate(['/comprobantes/notas-contables']);
            }, 1000);
          }
        },
        (error) => {
          this.confirmacionSwal.text = 'Ha ocurrido un error inesperado, la conexión a fallado.';
          this.confirmacionSwal.title = 'Oops!';
          this.confirmacionSwal.icon = 'error';
          this._swal.show(this.confirmacionSwal);
        },
      );
  }

  BuscarDatosCliente(cliente, pos?) {
    if (pos != null && pos != undefined) {
      this.Cuentas_Contables[pos].Nit_Cuenta = cliente.ID;
      this.Cuentas_Contables[pos].Tipo_Nit = cliente.Tipo;
    } else {
      this.Id_Cliente = cliente.ID;
      this.Tipo_Beneficiario = cliente.Tipo;
    }
  }

  addInvoicesToAccount() {
    let nit = this.Cuentas_Contables[this.position_document].Nit_Cuenta;
    this.Cuentas_Contables.splice(this.position_document, 1); // Eliminando una fila para introducir las nuevas cuentas.
    let count = this.Cuentas_Contables.length; // Total de filas de las cuentas.

    if (this.Cuentas_Contables[count - 1] != undefined) {
      if (
        this.Cuentas_Contables[count - 1].Nit_Cuenta == undefined ||
        this.Cuentas_Contables[count - 1].Nit_Cuenta == ''
      ) {
        this.Cuentas_Contables.splice(count - 1, 1); // Eliminando ultima fila.
      }
    }

    this.Facturas.forEach((f) => {
      let object = {
        Centro_Costo: this.Nom_Centro_Costo,
        Id_Centro_Costo: this.Nom_Centro_Costo.Id_Centro_Costo,
        Cuenta: this.obtenerPlanCuenta(f.Codigo),
        Id_Plan_Cuentas: f.Id_Plan_Cuenta,
        Nit: this.getDatosTercero(nit),
        Nit_Cuenta: nit,
        Tipo_Nit: this.getDatosTercero(nit).Tipo,
        Documento: f.Factura,
        Concepto: 'Pago o Abono Factura Nro. ' + f.Factura,
        Base: 0,
        Debito: this.validarDebeOHaber('D', f.Movimiento, f.Abono),
        Credito: this.validarDebeOHaber('C', f.Movimiento, f.Abono),
        Deb_Niif: this.validarDebeOHaber('D', f.Movimiento, f.Abono),
        Cred_Niif: this.validarDebeOHaber('C', f.Movimiento, f.Abono),
      };

      this.Cuentas_Contables.push(object); // Agregando nueva(s) fila(s)
    });

    this.Cuentas_Contables.push({
      // La ultima fila vacía.
      Cuenta: '',
      Nit: '',
      Centro_Costo: '',
      Documento: '',
      Concepto: '',
      Base: 0,
      Debito: 0,
      Credito: 0,
      Deb_Niif: 0,
      Cred_Niif: 0,
    });

    this.Mostrar_Facturas = false;
    this.Facturas = [];
    this.Lista_Facturas = [];
    this.Total_Abono = 0;

    setTimeout(() => {
      // Para actualizar los totales
      this.ActualizaValores();
      this.armarDatosBorrador();
    }, 200);
  }

  BuscarDatosCentro(centro, pos?) {
    if (pos != undefined && pos != null) {
      if (centro == '') {
        this.Cuentas_Contables[pos].Id_Centro_Costo = centro;
      } else {
        this.Cuentas_Contables[pos].Id_Centro_Costo = centro.Id_Centro_Costo;
      }
    } else {
      this.Centro_Costo = centro.Id_Centro_Costo;
    }
  }

  BuscarCuenta(cuenta, pos) {
    let pos2 = pos + 1;
    if (cuenta.Centro_Costo == 'S') {
      // Validar si la cuenta es para Centro de costos o no.
      this.Cuentas_Contables[pos].Centro_Costo = this.Nom_Centro_Costo;
      this.Cuentas_Contables[pos].Id_Centro_Costo = this.Nom_Centro_Costo.Id_Centro_Costo;
      (document.getElementById('Centro_Costo' + pos) as HTMLInputElement).style.display = 'block';
    } else {
      this.Cuentas_Contables[pos].Centro_Costo = '';
      this.Cuentas_Contables[pos].Id_Centro_Costo = 0;
      (document.getElementById('Centro_Costo' + pos) as HTMLInputElement).style.display = 'none';
    }

    this.Cuentas_Contables[pos].Id_Plan_Cuentas = cuenta.Id_Plan_Cuentas;
    this.Cuentas_Contables[pos].Documento = this.Documento;
    this.Cuentas_Contables[pos].Concepto = this.Concepto;

    // Nit Beneficiario
    this.Cuentas_Contables[pos].Nit = this.Nom_Cliente;
    this.Cuentas_Contables[pos].Nit_Cuenta = this.Nom_Cliente.ID;
    this.Cuentas_Contables[pos].Tipo_Nit = this.Nom_Cliente.Tipo;

    let posicion = this.ListaRetenciones.findIndex(
      (x) => x.Id_Plan_Cuenta === cuenta.Id_Plan_Cuentas,
    );

    if (posicion >= 0) {
      (document.getElementById('Base' + pos) as HTMLInputElement).readOnly = false;
      this.Cuentas_Contables[pos].Porcentaje = this.ListaRetenciones[posicion].Porcentaje;
    }

    if (cuenta.Id_Plan_Cuentas) {
      if (this.Cuentas_Contables[pos2] == undefined) {
        this.Cuentas_Contables.push({
          Cuenta: '',
          Nit: '',
          Centro_Costo: '',
          Documento: '',
          Concepto: '',
          Base: 0,
          Debito: 0,
          Credito: 0,
          Deb_Niif: 0,
          Cred_Niif: 0,
        });
      }
    }
  }

  EliminarCuenta(pos) {
    this.Cuentas_Contables.splice(pos, 1);
    this.Datos_Invalidos = this.Cuentas_Contables.find((data) => data.Valido == false);
    setTimeout(() => {
      this.ActualizaValores();
    }, 100);
  }

  calcularBase(pos, valor) {
    if (valor != '') {
      this.Cuentas_Contables[pos].Credito = Math.round(
        parseFloat(valor) * (parseFloat(this.Cuentas_Contables[pos].Porcentaje) / 100),
      );
      this.Cuentas_Contables[pos].Cred_Niif = Math.round(
        parseFloat(valor) * (parseFloat(this.Cuentas_Contables[pos].Porcentaje) / 100),
      );
    } else {
      this.Cuentas_Contables[pos].Deb_Niif = 0;
    }

    this.ActualizaValores();
  }

  validarDebCred(pos: number, campo: string) {
    if (campo === 'Credito') {
      if (
        this.Cuentas_Contables[pos].Cred_Niif.toString() == '' ||
        this.Cuentas_Contables[pos].Credito == null ||
        this.Cuentas_Contables[pos].Cred_Niif.toString() == '' ||
        this.Cuentas_Contables[pos].Cred_Niif == null
      ) {
        this.Cuentas_Contables[pos].Credito = 0;
        this.Cuentas_Contables[pos].Cred_Niif = 0;

        this.ActualizaValores();
      }
    } else {
      if (
        this.Cuentas_Contables[pos].Debito.toString() == '' ||
        this.Cuentas_Contables[pos].Debito == null ||
        this.Cuentas_Contables[pos].Deb_Niif.toString() == '' ||
        this.Cuentas_Contables[pos].Deb_Niif == null
      ) {
        this.Cuentas_Contables[pos].Debito = 0;
        this.Cuentas_Contables[pos].Deb_Niif = 0;

        this.ActualizaValores();
      }
    }
  }

  showFacturas(nit: any, pos) {
    if (nit != undefined && nit != '' && nit != null) {
      this.position_document = pos;
      let p: any = { nit: nit, fecha: this.Fecha_Nota_Contable };
      let id_plan_cuenta = this.Cuentas_Contables[pos].Id_Plan_Cuentas;

      if (id_plan_cuenta != '') {
        p.id_plan_cuenta = id_plan_cuenta;
      }
      this.http
        .get(environment.ruta + 'php/contabilidad/notascontables/lista_facturas.php', { params: p })
        .subscribe((data: any) => {
          this.Lista_Facturas = data.Facturas;
          this.Mostrar_Facturas = true;

          setTimeout(() => {
            this.calcularTotalAbonoCartera();
          }, 200);
        });
    }
  }

  addListInvoice(factura, pos) {
    let existe = this.Facturas.findIndex((fact) => fact.Factura === factura.Factura);

    if (existe < 0) {
      this.Lista_Facturas[pos].Abono = this.Lista_Facturas[pos].Valor_Saldo;
      let factura = this.Lista_Facturas[pos];
      this.Facturas.push(factura);
    } else {
      this.Lista_Facturas[pos].Abono = 0;
      this.Facturas.splice(existe, 1);
    }

    setTimeout(() => {
      this.calcularTotalAbonoCartera();
    }, 200);
  }

  validarSaldoFactura(pos, event) {
    let saldo = parseFloat(this.Lista_Facturas[pos].Valor_Saldo);
    let abono = parseFloat(this.Lista_Facturas[pos].Abono);

    if (abono > saldo) {
      // Validando que el abono no pueda ser mayor al saldo de una factura de cartera.
      let id = event.target.id;
      (document.getElementById(id) as HTMLInputElement).focus();
      this._swal.show({
        title: 'Incorrecto',
        text: `El valor del abono no puede ser mayor al saldo de la factura.`,
        icon: 'error',
      });
    }

    setTimeout(() => {
      this.calcularTotalAbonoCartera();
    }, 200);
  }

  tab(event, ele) {
    this._notasContables.tabular(event, ele);
  }

  CargarArchivo(event) {
    if (event.target.files.length === 1) {
      this.Archivo = event.target.files[0];
      this.EnviarArchivo();
    }
  }

  reloadData() {
    this.http
      .get(environment.base_url + '/php/contabilidad/notascontables/nit_buscar.php')
      .subscribe((data: any) => {
        this.Cliente = data;
      });
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuenta = data.Activo;
      });
    this.http
      .get(environment.base_url + '/php/contabilidad/notascontables/centrocosto_buscar.php')
      .subscribe((data: any) => {
        this.Centros = data;
      });
  }

  /////////// FUNCIONES AUXILIARES PARA FUNCS. DE HTML
  obtenerPlanCuenta(codigo: string) {
    return this.Cuenta.find((x) => x.Codigo_Cuenta === codigo);
  }

  getDatosTercero(nit) {
    return this.Cliente.find((x) => x.ID == nit);
  }

  validarDebeOHaber(campo: string, tipo: string, valor: number) {
    // Funcion que me permite validar si el valor que viene de la factura va al Debe o al Haber
    if (campo === tipo) {
      return Math.abs(valor);
    }
    return '0';
  }

  ActualizaValores(pos?, pcga = true) {
    if (pos != null && pos != undefined && pcga) {
      if (this.Cuentas_Contables[pos].Debito < 0) {
        this.Cuentas_Contables[pos].Debito = 0;
      }

      if (this.Cuentas_Contables[pos].Credito < 0) {
        this.Cuentas_Contables[pos].Credito = 0;
      }

      this.Cuentas_Contables[pos].Deb_Niif = this.Cuentas_Contables[pos].Debito;
      this.Cuentas_Contables[pos].Cred_Niif = this.Cuentas_Contables[pos].Credito;
    } else if (pos != null && pos != undefined) {
      if (this.Cuentas_Contables[pos].Deb_Niif < 0) {
        this.Cuentas_Contables[pos].Deb_Niif = 0;
      }
      if (this.Cuentas_Contables[pos].Cred_Niif < 0) {
        this.Cuentas_Contables[pos].Cred_Niif = 0;
      }
    }

    this.Total_Credito = this.Cuentas_Contables.reduce(this.reducer_cred, 0).toString();
    this.Total_Debito = this.Cuentas_Contables.reduce(this.reducer_deb, 0).toString();

    this.Total_Credito_Niif = this.Cuentas_Contables.reduce(this.reducer_cred_niif, 0).toString();
    this.Total_Debito_Niif = this.Cuentas_Contables.reduce(this.reducer_deb_niif, 0).toString();
  }

  armarDatosBorrador() {
    let datosCabecera = {
      Fecha: this.Fecha_Nota_Contable,
      Beneficiario: this.Nom_Cliente,
      Id_Cliente: this.Id_Cliente,
      Tipo_Beneficiario: this.Tipo_Beneficiario,
      Nom_Centro_Costo: this.Nom_Centro_Costo,
      Centro_Costo: this.Centro_Costo,
      Documento: this.Documento,
      Concepto: this.Concepto,
    };

    let Datos = {
      Cabecera: datosCabecera,
      Cuentas_Contables: this.Cuentas_Contables,
    };

    setTimeout(() => {
      let datosBorrador = {
        Id_Borrador_Contabilidad: this.idBorrador,
        Codigo: this.Codigo,
        Tipo_Comprobante: 'Nota Contable',
        // Identificacion_Funcionario: this.Funcionario.Identificacion_Funcionario,
        Datos: Datos,
      };

      let info = this._general.Utf8.encode(JSON.stringify(datosBorrador));

      let datos = new FormData();
      datos.append('datos', info);
      this.http
        .post(environment.base_url + '/php/contabilidad/guardar_borrador_contable.php', datos, {
          context: skipContentType(),
        })
        .subscribe((data: any) => {
          if (data.status == 202) {
            if (this.idBorrador == '') this.idBorrador = data.Id_Borrador;
          }
        });
    }, 300);
  }

  EnviarArchivo() {
    this.Cargando = true;
    let datos = new FormData();
    datos.append('archivo', this.Archivo);
    this.http
      .post(environment.base_url + '/php/contabilidad/notascontables/subir_facturas.php', datos, {
        context: skipContentType(),
      })
      .subscribe(
        (data: any) => {
          this.Cuentas_Contables = data.Facturas;
          this.Datos_Invalidos = this.Cuentas_Contables.some((data) => data.Valido == false);
          this.Cargando = false;
          this.Facturas_Multiple = false;

          setTimeout(() => {
            this.Cuentas_Contables.push({
              Cuenta: '',
              Nit: '',
              Centro_Costo: '',
              Documento: '',
              Concepto: '',
              Base: 0,
              Debito: 0,
              Credito: 0,
              Deb_Niif: 0,
              Cred_Niif: 0,
            });
            this.ActualizaValores();
          }, 300);
        },
        (error) => {
          this.Cargando = false;
          this._swal.show({
            title: 'Oops!',
            text: 'Se perdió la conexión a internet. Por favor vuelve a intentarlo.',
            icon: 'warning',
          });
        },
      );
  }

  calcularTotalAbonoCartera() {
    this.Total_Abono = this.Lista_Facturas.reduce(this.reducer_abono, 0);
  }

  fechaHoy() {
    let fecha: any = new Date();
    fecha = fecha.toISOString().split('T')[0];

    return fecha;
  }

  ///////////////////////// ----------------------------------- borrar funciones:
  search = null;
  formatter = null;

  search1 = null;
  formatter1 = null;

  search2 = null;
  formatter2 = null;
}

//////////////////////// ----------------------------------- borrar funciones:
// search = (text$: Observable<string>) =>
// text$.pipe(
//   debounceTime(200),
//   map((term) =>
//     term.length < 4
//       ? []
//       : this.Cliente.filter(
//           (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
//         ).slice(0, 100),
//   ),
// );
// formatter = (x: { Nombre: string }) => x.Nombre;

// search1 = (text$: Observable<string>) =>
// text$.pipe(
//   debounceTime(200),
//   map((term) =>
//     term.length < 4
//       ? []
//       : this.Cuenta.filter(
//           (v) => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1,
//         ).slice(0, 100),
//   ),
// );
// formatter1 = (x: { Codigo: string }) => x.Codigo;

// search2 = (text$: Observable<string>) =>
// text$.pipe(
//   debounceTime(200),
//   map((term) =>
//     term.length < 2
//       ? []
//       : this.Centros.filter(
//           (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
//         ).slice(0, 100),
//   ),
// );
// formatter2 = (x: { Nombre: string }) => x.Nombre;
