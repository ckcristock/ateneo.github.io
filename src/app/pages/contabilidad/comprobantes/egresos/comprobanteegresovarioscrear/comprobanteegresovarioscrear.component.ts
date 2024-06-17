import { ActivatedRoute, Router } from '@angular/router';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';
import { CabeceraComponent } from '../../../../../components/cabecera/cabecera.component';
import { CentroCostosService } from '../../../centro-costos/centro-costos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { consts } from 'src/app/core/utils/consts';
import { EgresosService } from '../egresos.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { InputPositionDirective } from '../../../../../core/directives/input-position.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NotasContablesService } from '../../notas-contables/notas-contables.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { SharedformComponent } from '../../components/sharedform/sharedform.component';
import { skipContentType } from 'src/app/http.context';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import {
  FormArray,
  FormControl,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-comprobanteegresovarioscrear',
  templateUrl: './comprobanteegresovarioscrear.component.html',
  styleUrls: ['./comprobanteegresovarioscrear.component.scss'],
  standalone: true,
  imports: [
    AutocompleteFcComponent,
    CabeceraComponent,
    DecimalPipe,
    FormsModule,
    InputPositionDirective,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgbTypeahead,
    NgbTypeaheadModule,
    NgFor,
    NgIf,
    NgxCurrencyDirective,
    NotDataComponent,
    ReactiveFormsModule,
    SharedformComponent,
    StandardModule,
    TableComponent,
    TextFieldModule,
  ],
})
export class ComprobanteegresovarioscrearComponent implements OnInit {
  @ViewChild('FormEgreso') FormEgreso: any;
  // public Funcionario=JSON.parse(localStorage.getItem("User"));
  Centros: any = [];
  Codigo: string = '';
  companies: any[] = [];
  Concepto: string = '';
  confirmacionSwal: any;
  Documento: string = '';
  form: UntypedFormGroup;
  formControls: FormControl[] = [];
  idBorrador: any = '';
  ListaFact: any = [];
  ListaRetenciones: any = [];
  masks = consts;
  Mostrar_Input_Cli: boolean = true;
  Mostrar_Opciones: boolean = true;
  Tipo_Beneficiario: any;
  Total_Facturas: number = 0;
  public Bancos: Array<any>;
  public Cargando: boolean = false;
  public Centro_Costo = '';
  public Cliente = [];
  public Costo_Ingreso = 0;
  public Cuenta = [];
  public Cuenta_Banco = '';
  public display_Banco: string = 'none';
  public Facturas: any = [];
  public fecha = new Date();
  public Fecha_Nota_Contable = this.fechaHoy();
  public Fecha: any = '';
  public Forma_Pago: string;
  public FormaPago: any = [];
  public Id_Cliente = '';
  public Id_Empresa: any = '';
  public Id_Proveedor: any = '';
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
  public Total_Abono: number = 0;
  public Total_Credito: number = 0;
  public Total_Debito: number = 0;
  public Cuentas_Contables: any[] = [
    {
      Cuenta: '',
      Cheque: '',
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
    Titulo: 'Nuevo egreso',
    Fecha: new Date(),
    Codigo: '',
  };
  public Lista_Facturas: any[] = [
    {
      RetencionesFactura: [],
    },
  ];
  public ModelCheque: any = {
    Id_Plan_Cuentas: '',
    Prefijo: '',
    Inicial: null,
    Final: null,
  };
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

  constructor(
    private route: ActivatedRoute,
    private _companies: CentroCostosService,
    private _egresos: EgresosService,
    private _general: NotasContablesService,
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadInitialsEndpoints();
    this.getCodigoEgreso();
    // this.getCompanies();
  }

  private initForms(): void {
    // formulario superior
    this.form = this.fb.group({
      Fecha_Comprobante: ['', Validators.required],
      Id_Cliente: ['', Validators.required],
      Id_Centro_Costo: ['', Validators.required],
      Documento: ['', Validators.required],
      Concepto: [''],
      Tipo_Beneficiario: ['', Validators.required],
      // para crear egresos
      idBorrador: [''],
      Forma_Pago: [''],
      // tabla inferior
      Cuentas_Contables: this.fb.array([
        this.fb.group({
          Cuenta: ['Test'],
          Cheque: [''],
          Nit: [''],
          Centro_Costo: [''],
          Documento: [''],
          Concepto: [''],
          Base: [0],
          Debito: [0],
          Credito: [0],
          Deb_Niif: [0],
          Cred_Niif: [0],
        }),
      ]),
    });
    console.log('this.form', this.form);

    const controlsToSend = [
      'Fecha_Comprobante',
      'Id_Cliente',
      'Id_Centro_Costo',
      'Documento',
      'Concepto',
      'Tipo_Beneficiario',
    ];

    controlsToSend.forEach((controlName) => {
      this.formControls[controlName] = this.form.get(controlName) as FormControl;
    });
  }

  loadInitialsEndpoints() {
    // Listar retenciones
    this.http
      .get(environment.base_url + '/php/contabilidad/lista_retenciones.php')
      .subscribe((data: any) => {
        this.ListaRetenciones = data;
      });
    this.http
      .get(environment.base_url + '/php/contabilidad/proveedor_buscar.php')
      .subscribe((data: any) => {
        this.Proveedores = data;
      });
    this.http
      .get(environment.base_url + '/php/contabilidad/notascontables/nit_buscar.php')
      .subscribe((data: any) => {
        this.Cliente = data;
        console.log('this.ClienteOrigin', this.Cliente);

        this.Cliente.forEach(function (objeto) {
          objeto.value = objeto.ID;
          delete objeto.ID;
          objeto.text = objeto.Nombre;
          delete objeto.Nombre;
          delete objeto.Tipo;
        });
        console.log('this.Cliente', this.Cliente);
      });
    this.http.get(environment.base_url + '/php/comprobantes/cuentas.php').subscribe((data: any) => {
      this.Bancos = data;
    });
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuenta = data;
        console.log('this.Cuenta', this.Cuenta);
      });
    this.http
      .get(environment.base_url + '/php/contabilidad/notascontables/centrocosto_buscar.php')
      .subscribe((data: any) => {
        this.Centros = data;
        this.Centros.forEach(function (objeto) {
          objeto.value = objeto.Id_Centro_Costo;
          delete objeto.Id_Centro_Costo;
          objeto.text = objeto.Nombre;
          delete objeto.Nombre;
        });
        console.log('this.Centros', this.Centros);
      });
  }

  getCodigoEgreso(fecha?: string) {
    let datos: any = { Tipo: 'Egreso' };

    if (fecha != undefined && fecha != null) {
      datos.Fecha = fecha;
    }

    this.http
      .get(environment.base_url + '/php/comprobantes/get_codigo.php', { params: datos })
      .subscribe((data: any) => {
        this.datosCabecera.Codigo = data.consecutivo;
        console.log('this.Cuentas_Contables', this.Cuentas_Contables);

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
          this.guardarEgreso(this.FormEgreso);
        }
      });
  }

  guardarEgreso(Formulario: NgForm) {
    let info = JSON.stringify(Formulario.value);

    let datos = new FormData();

    datos.append('Datos', info);
    datos.append('Cuentas_Contables', JSON.stringify(this.Cuentas_Contables));

    this.http
      .post(environment.base_url + '/php/comprobantes/guardar_egreso.php', datos, {
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
              environment.ruta +
                'php/comprobantes/egreso_descarga_pdf.php?id=' +
                data.id +
                '&tipo=Niif',
              '_blank',
            ); // SE IMPRIME EN FORMATO NIIF
            setTimeout(() => {
              this.router.navigate(['/contabilidad/comprobantes/egresos']);
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

  getFormControl(nombre: string): FormControl | undefined {
    return this.form.get(nombre) as FormControl;
  }

  get getCuentasContables() {
    console.log('CUENTAS_CONTABLES=', this.form.get('Cuentas_Contables') as UntypedFormArray);
    return this.form.get('Cuentas_Contables') as UntypedFormArray;
  }

  transferCodeView: boolean;
  chequeNumber: boolean;
  formaPagoChange(e) {
    if (e.value == 'Transferencia') {
      this.transferCodeView = true;
      this.chequeNumber = false;
    } else {
      this.transferCodeView = false;
      this.chequeNumber = true;
    }
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
    this.Cuentas_Contables[pos].Nit_Cuenta = this.Nom_Cliente?.ID;
    this.Cuentas_Contables[pos].Tipo_Nit = this.Nom_Cliente?.Tipo;

    let posicion = this.ListaRetenciones.findIndex(
      (x) => x.Id_Plan_Cuenta === cuenta.Id_Plan_Cuentas,
    );

    this.isBank(cuenta, pos); // Validar si la cuenta es un banco.

    if (posicion >= 0) {
      (document.getElementById('Base' + pos) as HTMLInputElement).readOnly = false;
      this.Cuentas_Contables[pos].Porcentaje = this.ListaRetenciones[posicion].Porcentaje;
    }

    if (cuenta.Id_Plan_Cuentas) {
      if (this.Cuentas_Contables[pos2] == undefined) {
        this.Cuentas_Contables.push({
          Cuenta: '',
          Cheque: '',
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
    console.log('this.Cuentas_Contables', this.Cuentas_Contables);
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
      let id_plan_cuenta = this.Cuentas_Contables[pos].Cuenta.value;
      if (id_plan_cuenta != '') {
        p.id_plan_cuenta = id_plan_cuenta;
      }
      this.http
        .get(environment.base_url + '/php/contabilidad/notascontables/lista_facturas.php', {
          params: p,
        })
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
        Valor_Factura: Math.round(f.Valor_Factura),
        Valor_Abono: Math.round(f.Valor_Abono),
        Id_Factura: f.Id_Factura,
        Cheque: '',
      };

      this.Cuentas_Contables.push(object); // Agregando nueva(s) fila(s)
    });

    this.Cuentas_Contables.push({
      // La ultima fila vacía.
      Cuenta: '',
      Cheque: '',
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
      //this.armarDatosBorrador();
    }, 200);
  }

  EliminarCuenta(pos) {
    this.Cuentas_Contables.splice(pos, 1);

    setTimeout(() => {
      this.ActualizaValores();
    }, 100);
  }

  /////////// FUNCIONES AUXILIARES PARA FUNCS. DE HTML
  ActualizaValores(pos?) {
    if (pos != null && pos != undefined) {
      this.Cuentas_Contables[pos].Deb_Niif = this.Cuentas_Contables[pos].Debito;
      this.Cuentas_Contables[pos].Cred_Niif = this.Cuentas_Contables[pos].Credito;
    }

    this.Total_Credito = this.Cuentas_Contables.reduce(this.reducer_cred, 0);
    this.Total_Debito = this.Cuentas_Contables.reduce(this.reducer_deb, 0);
  }

  calcularTotalAbonoCartera() {
    this.Total_Abono = this.Lista_Facturas.reduce(this.reducer_abono, 0);
  }

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

  isBank(banco, pos) {
    let existe = this.Bancos.findIndex((x) => x.value == banco.Id_Plan_Cuentas);

    /* if (existe >= 0) {
      if (this.Forma_Pago == 'Cheque') {
        (document.getElementById('cheque' + pos) as HTMLInputElement).style.display = 'block';
      }
    } else {
      (document.getElementById('cheque' + pos) as HTMLInputElement).style.display = 'none';
      this.Cuentas_Contables[pos].Cheque = '';
    } */
  }

  validarSaldoFactura(pos, event) {
    let saldo = parseFloat(this.Lista_Facturas[pos].Valor_Saldo);
    let abono = parseFloat(this.Lista_Facturas[pos].Abono);

    if (abono > saldo) {
      // Validando que el abono no pueda ser mayor al saldo de una factura de cartera.
      let id = event.target.id;
      (document.getElementById(id) as HTMLInputElement).focus();
      //////////////////
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Incorrecto!',
      // text: `El valor del abono no puede ser mayor al saldo de la factura.`,
      // });
      ////////////////
      // this.swalService.ShowMessage(swal);
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
    this._general.tabular(event, ele);
  }

  fechaHoy() {
    let fecha: any = new Date();
    fecha = fecha.toISOString().split('T')[0];

    return fecha;
  }
  printForm() {
    console.log('this.form', this.form.value);
  }
}

//////////// -------------------------------------borrar luego las funciones:

// search = (text$: Observable<string>) =>
//     text$.pipe(
//       debounceTime(200),
//       map((term) =>
//         term.length < 4
//           ? []
//           : this.Cliente.filter(
//               (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
//             ).slice(0, 100),
//       ),
//     );
//   formatter = (x: { Nombre: string }) => x.Nombre;

//   search1 = (text$: Observable<string>) =>
//     text$.pipe(
//       debounceTime(200),
//       map((term) =>
//         term.length < 4
//           ? []
//           : this.Cuenta.filter((v) => v.label.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(
//               0,
//               100,
//             ),
//       ),
//     );
//   formatter1 = (x: { label: string }) => x.label;

//   search2 = (text$: Observable<string>) =>
//     text$.pipe(
//       debounceTime(200),
//       map((term) =>
//         term.length < 2
//           ? []
//           : this.Centros.filter(
//               (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
//             ).slice(0, 100),
//       ),
//     );
//   formatter2 = (x: { Nombre: string }) => x.Nombre;

///////// -------------------------------------------------------Datos, borrar:
// this.Cuentas_Contables = [
//   {
//     Cuenta: '',
//     Cheque: '',
//     Nit: '',
//     Centro_Costo: '',
//     Documento: '',
//     Concepto: '',
//     Base: 0,
//     Debito: 0,
//     Credito: 0,
//     Deb_Niif: 0,
//     Cred_Niif: 0,
//   },
// ];
//////// formgroup
// const firstFormGroup = (this.form.get('Cuentas_Contables') as FormArray).at(0) as FormGroup;
// firstFormGroup.patchValue(this.Cuentas_Contables[0]);
