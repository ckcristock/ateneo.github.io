import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { SweetAlertOptions } from 'sweetalert2';
import { environment } from '../../../../../../environments/environment.prod';
import { NotasCarterasService } from '../notas-carteras.service';
import { PlanCuentasService } from '../../../plan-cuentas/plan-cuentas.service';
import { BorradorcomprobantesComponent } from '../../borradorcomprobantes/borradorcomprobantes.component';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { CabeceraComponent } from '../../../../../components/cabecera/cabecera.component';

@Component({
  selector: 'app-notascarteracrear',
  templateUrl: './notascarteracrear.component.html',
  styleUrls: ['./notascarteracrear.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    FormsModule,
    NgFor,
    NgbTypeahead,
    BorradorcomprobantesComponent,
    NgIf,
    RouterLink,
    CurrencyPipe,
  ],
})
export class NotascarteracrearComponent implements OnInit {
  public datosCabecera: any = {
    Titulo: 'Nueva Nota Cartera',
    Fecha: new Date(),
    Codigo: '',
  };

  public Tipo_Comprobante = 'Nota Cartera';
  public alertOption: SweetAlertOptions = {};
  public Cargando: boolean = false;
  public Mostrar_Facturas: boolean = false;
  public Facturas: any = [];
  public position_document: number;
  public Tipo_Documento: string = '';

  @ViewChild('FormNotaContable') FormNotaContable: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  public fecha = new Date();
  public Fecha: any = '';
  public display_Banco: string = 'none';
  public Proveedores: any[] = [];
  public Lista_Facturas: any[] = [
    {
      RetencionesFactura: [],
    },
  ];

  public Centro_Costo = '';
  public Nom_Centro_Costo: any = '';
  public Fecha_Nota_Contable = this.fechaHoy();
  public Id_Proveedor: any = '';
  public NombreProveedor: string = '';
  public Nom_Cliente: any;
  public Id_Cliente = '';
  public Cliente = [];
  // public Funcionario=JSON.parse(localStorage.getItem("User"));
  public Cuenta = [];
  public Cuentas: Array<any>;
  public FormaPago: any = [];
  public Rentenciones: any[] = [];
  public RentencionesFactura: any[] = [];
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
  public Cuenta_Banco = '';
  public Costo_Ingreso = 0;
  public Total_Debito: number = 0;
  public Total_Credito: number = 0;
  public Retenciones_Totales = 0;
  public Mostrar: boolean = false;
  public Mostrar_Cliente: boolean = false;
  public Impuesto = 0;
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_deb = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Debito);
  public reducer_cred = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Credito);
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
  ListaRetenciones: any = [];
  ListaFact: any = [];
  Total_Facturas: number = 0;
  Mostrar_Opciones: boolean = true;
  Mostrar_Input_Cli: boolean = true;
  Centros: any = [];
  Tipo_Beneficiario: any;
  Documento: string = '';
  Concepto: string = '';
  idBorrador: any = '';
  Codigo: string = '';
  public Total_Abono: number = 0;
  Id_Empresa: any = '';
  companies: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private swalService: SwalService,
    private _notas: NotasCarterasService,
    private _companies: PlanCuentasService,
  ) {
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

    this.http
      .get(environment.ruta + 'php/contabilidad/proveedor_buscar.php')
      .subscribe((data: any) => {
        this.Proveedores = data;
      });
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar este Comprobante',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      input: 'select',
      inputOptions: {
        Pcga: 'Imprimir en PCGA',
        Niif: 'Imprimir en NIIF',
      },
      preConfirm: (value) => {
        return new Promise((resolve) => {
          this.guardarNotaCartera(this.FormNotaContable, value);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Cliente.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );
  formatter = (x: { Nombre: string }) => x.Nombre;

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Cuenta.filter(
              (v) => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );
  formatter1 = (x: { Codigo: string }) => x.Codigo;

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
  formatter2 = (x: { Nombre: string }) => x.Nombre;

  ngOnInit() {
    this.http
      .get(environment.ruta + 'php/contabilidad/notascarteras/nit_buscar.php')
      .subscribe((data: any) => {
        this.Cliente = data;
      });
    this.http.get(environment.ruta + 'php/comprobantes/cuentas.php').subscribe((data: any) => {
      this.Cuentas = data;
    });
    this.http
      .get(environment.ruta + 'php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuenta = data.Activo;
      });
    this.http
      .get(environment.ruta + 'php/contabilidad/notascarteras/centrocosto_buscar.php')
      .subscribe((data: any) => {
        this.Centros = data;
      });

    // this.getCodigoNuevaNota();

    this.ListarRetenciones();
  }
  BuscarProveedor(modelo) {
    this.NombreProveedor = modelo.Proveedores;
    this.Id_Proveedor = modelo.Id_Proveedor;
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

  getDatosTercero(nit) {
    return this.Cliente.find((x) => x.ID == nit);
  }

  ListasEmpresas() {
    this._companies.getCompanies().subscribe((data: any) => {
      this.companies = data.data;
    });
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

  ActualizaValores(pos?) {
    if (pos != null && pos != undefined) {
      this.Cuentas_Contables[pos].Deb_Niif = this.Cuentas_Contables[pos].Debito;
      this.Cuentas_Contables[pos].Cred_Niif = this.Cuentas_Contables[pos].Credito;
    }

    this.Total_Credito = this.Cuentas_Contables.reduce(this.reducer_cred, 0);
    this.Total_Debito = this.Cuentas_Contables.reduce(this.reducer_deb, 0);
  }

  EliminarCuenta(pos) {
    this.Cuentas_Contables.splice(pos, 1);

    setTimeout(() => {
      this.ActualizaValores();
    }, 100);
  }

  guardarNotaCartera(Formulario: NgForm, tipo) {
    let info = JSON.stringify(Formulario.value);

    let datos = new FormData();

    datos.append('Datos', info);
    datos.append('Cuentas_Contables', JSON.stringify(this.Cuentas_Contables));

    this.http
      .post(environment.ruta + 'php/contabilidad/notascarteras/guardar_nota.php', datos)
      .subscribe(
        (data: any) => {
          this.confirmacionSwal.title = data.titulo;
          this.confirmacionSwal.text = data.mensaje;
          this.confirmacionSwal.type = data.tipo;
          this.confirmacionSwal.show();

          if (data.tipo == 'success' && data.id != undefined) {
            localStorage.removeItem('borradorContable');
            if (tipo == 'Pcga') {
              window.open(
                environment.ruta + 'php/contabilidad/notascarteras/descarga_pdf.php?id=' + data.id,
                '_blank',
              ); // SE IMPRIME EN FORMATO PCGA
            } else {
              window.open(
                environment.ruta +
                  'php/contabilidad/notascarteras/descarga_pdf.php?id=' +
                  data.id +
                  '&tipo=Niif',
                '_blank',
              ); // SE IMPRIME EN FORMATO NIIF
            }
            setTimeout(() => {
              this.router.navigate(['/comprobante/notascartera']);
            }, 1000);
          }
        },
        (error) => {
          this.confirmacionSwal.text = 'Ha ocurrido un error inesperado, la conexión a fallado.';
          this.confirmacionSwal.title = 'Oops!';
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.show();
        },
      );
  }

  HomologoDebCred(tipo, pos) {
    switch (tipo) {
      case 'Debito':
        this.Cuentas_Contables[pos].Deb_Niif = this.Cuentas_Contables[pos].Debito;
        break;

      case 'Credito':
        this.Cuentas_Contables[pos].Cred_Niif = this.Cuentas_Contables[pos].Credito;
        break;
    }
  }

  ListarRetenciones() {
    this.http
      .get(environment.ruta + 'php/contabilidad/lista_retenciones.php')
      .subscribe((data: any) => {
        this.ListaRetenciones = data;
      });
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

  fechaHoy() {
    let fecha: any = new Date();
    fecha = fecha.toISOString().split('T')[0];

    return fecha;
  }

  getCodigoNuevaNota(fecha?: string) {
    let datos: any = {};

    if (fecha != undefined && fecha != null) {
      datos.Fecha = fecha;
    } else {
      datos.Fecha = this.fechaHoy();
    }

    if (this.Tipo_Documento != '') {
      datos.Tipo = this.Tipo_Documento;

      this.http
        .get(environment.ruta + 'php/contabilidad/notascarteras/get_codigo.php', { params: datos })
        .subscribe((data: any) => {
          this.datosCabecera.Codigo = data.consecutivo;
          this.Codigo = data.consecutivo;
        });
    }
  }

  validarDebCred(pos: number, campo: string) {
    if (campo === 'Credito') {
      if (
        this.Cuentas_Contables[pos].Credito == '' ||
        this.Cuentas_Contables[pos].Credito == null ||
        this.Cuentas_Contables[pos].Cred_Niif == '' ||
        this.Cuentas_Contables[pos].Cred_Niif == null
      ) {
        this.Cuentas_Contables[pos].Credito = 0;
        this.Cuentas_Contables[pos].Cred_Niif = 0;

        this.ActualizaValores();
      }
    } else {
      if (
        this.Cuentas_Contables[pos].Debito == '' ||
        this.Cuentas_Contables[pos].Debito == null ||
        this.Cuentas_Contables[pos].Deb_Niif == '' ||
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
      let p: any = { nit: nit };
      let id_plan_cuenta = this.Cuentas_Contables[pos].Id_Plan_Cuentas;

      if (id_plan_cuenta != '') {
        p.id_plan_cuenta = id_plan_cuenta;
      }
      this.http
        .get(environment.ruta + 'php/contabilidad/notascarteras/lista_facturas.php', { params: p })
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
      // let plan_cuenta = this.obtenerPlanPorTipo(f.Tipo_Factura);
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

  obtenerPlanPorTipo(tipo) {
    let tipo_facturas = {
      Factura_Venta: {
        Cuenta: '130505',
        Naturaleza: 'Credito',
      },
      Factura_Nopos: {
        Cuenta: '130505',
        Naturaleza: 'Credito',
      },
      Nota_Credito: {
        Cuenta: '130505',
        Naturaleza: 'Debito',
      },
      Factura_Capita: {
        Cuenta: '130505',
        Naturaleza: 'Credito',
      },
      Factura_Acta: {
        Cuenta: '133005',
        Naturaleza: 'Credito',
      },
      Devolucion_Compra: {
        Cuenta: '220501',
        Naturaleza: 'Debito',
      },
      Factura_Proveedor_Mantis: {
        Cuenta: '133005',
        Naturaleza: 'Credito',
      },
    };

    return tipo_facturas[tipo];
  }

  obtenerPlanCuenta(codigo: string) {
    return this.Cuenta.find((x) => x.Codigo_Cuenta === codigo);
  }

  validarDebeOHaber(campo: string, tipo: string, valor: number) {
    // Funcion que me permite validar si el valor que viene de la factura va al Debe o al Haber
    if (campo === tipo) {
      return Math.abs(valor);
    }
    return '0';
  }

  validarCampo(campo, event, tipo) {
    // Funcion que validará los campos de typeahead
    if (typeof campo != 'object' && campo != '') {
      let id = event.target.id;
      (document.getElementById(id) as HTMLInputElement).focus();
      let swal = {
        codigo: 'error',
        titulo: 'Incorrecto!',
        mensaje: `El valor ${tipo} no es valido.`,
      };
      this.swalService.ShowMessage(swal);
    }
  }

  validarSaldoFactura(pos, event) {
    let saldo = parseFloat(this.Lista_Facturas[pos].Valor_Saldo);
    let abono = parseFloat(this.Lista_Facturas[pos].Abono);

    if (abono > saldo) {
      // Validando que el abono no pueda ser mayor al saldo de una factura de cartera.
      let id = event.target.id;
      (document.getElementById(id) as HTMLInputElement).focus();
      let swal = {
        codigo: 'error',
        titulo: 'Incorrecto!',
        mensaje: `El valor del abono no puede ser mayor al saldo de la factura.`,
      };
      this.swalService.ShowMessage(swal);
    }

    setTimeout(() => {
      this.calcularTotalAbonoCartera();
    }, 200);
  }

  tab(event, ele) {
    this._notas.tabular(event, ele);
  }

  reloadData() {
    this.http
      .get(environment.ruta + 'php/contabilidad/notascontables/nit_buscar.php')
      .subscribe((data: any) => {
        this.Cliente = data;
      });
    this.http
      .get(environment.ruta + 'php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuenta = data.Activo;
      });
    this.http
      .get(environment.ruta + 'php/contabilidad/notascontables/centrocosto_buscar.php')
      .subscribe((data: any) => {
        this.Centros = data;
      });
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
        Tipo_Comprobante: 'Nota Cartera',
        // Identificacion_Funcionario: this.Funcionario.Identificacion_Funcionario,
        Datos: Datos,
      };

      let info = this._notas.Utf8.encode(JSON.stringify(datosBorrador));

      let datos = new FormData();
      datos.append('datos', info);
      this.http
        .post(environment.ruta + 'php/contabilidad/guardar_borrador_contable.php', datos)
        .subscribe((data: any) => {
          if (data.status == 202) {
            if (this.idBorrador == '') this.idBorrador = data.Id_Borrador;
          }
        });
    }, 300);
  }

  setDatosBorrador(data = null) {
    if (data == 'clean') {
      this.resetModel(); // Reinicilizar Campos.
    } else {
      let Datos = JSON.parse(data.Datos);
      this.Fecha_Nota_Contable = Datos.Cabecera.Fecha;
      this.Nom_Cliente = Datos.Cabecera.Beneficiario;
      this.Id_Cliente = Datos.Cabecera.Id_Cliente;
      this.Tipo_Beneficiario = Datos.Cabecera.Tipo_Beneficiario;
      this.Nom_Centro_Costo = Datos.Cabecera.Nom_Centro_Costo;
      this.Centro_Costo = Datos.Cabecera.Centro_Costo;
      this.Documento = Datos.Cabecera.Documento;
      this.Concepto = Datos.Cabecera.Concepto;
      this.Cuentas_Contables = Datos.Cuentas_Contables;
      this.datosCabecera.Codigo = data.Codigo;
      this.idBorrador = data.ID;
    }

    setTimeout(() => {
      this.ActualizaValores();
    }, 200);
  }

  resetModel() {
    this.Fecha_Nota_Contable = this.fechaHoy();
    this.Nom_Cliente = '';
    this.Id_Cliente = '';
    this.Nom_Centro_Costo = '';
    this.Centro_Costo = '';
    this.Documento = '';
    this.Concepto = '';

    this.Cuentas_Contables = [
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

    this.datosCabecera.Codigo = this.getCodigoNuevaNota();
  }

  calcularTotalAbonoCartera() {
    this.Total_Abono = this.Lista_Facturas.reduce(this.reducer_abono, 0);
  }
}
