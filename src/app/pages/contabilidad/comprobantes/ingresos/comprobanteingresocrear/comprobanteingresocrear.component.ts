import { ActivatedRoute, Router } from '@angular/router';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { CabeceraComponent } from '../../../../../components/cabecera/cabecera.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { debounceTime, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DecimalPipe, CurrencyPipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgTemplateOutlet } from '@angular/common';
import { Observable } from 'rxjs';
import { PlanCuentasService } from '../../../plan-cuentas/plan-cuentas.service';
import { skipContentType } from 'src/app/http.context';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { TablafacturafaltanteComponent } from './tablafacturafaltante/tablafacturafaltante.component';
import { TablafacturascargadasComponent } from './tablafacturascargadas/tablafacturascargadas.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-comprobanteingresocrear',
  templateUrl: './comprobanteingresocrear.component.html',
  styleUrls: ['./comprobanteingresocrear.component.scss'],
  standalone: true,
  imports: [
    AutocompleteFcComponent,
    CabeceraComponent,
    CardComponent,
    CurrencyPipe,
    DecimalPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgbTypeahead,
    NgFor,
    NgIf,
    NgSelectModule,
    NgTemplateOutlet,
    ReactiveFormsModule,
    TablafacturafaltanteComponent,
    TablafacturascargadasComponent,
    TextFieldModule,
  ],
})
export class ComprobanteingresocrearComponent implements OnInit {
  confirmacionSwal: any;
  form: UntypedFormGroup;
  ListaFact: any = [];
  ListaRetenciones: any = [];
  Mostrar_Input_Cli: boolean = true;
  Mostrar_Opciones: boolean = true;
  Total_Facturas: number = 0;
  ///////// public Funcionario=JSON.parse(localStorage.getItem("User"));
  private funcionarioId = this._user.user.id;
  public Archivo: any;
  public Cargando: boolean = false;
  public Cliente = [];
  public Cuenta = [];
  public CuentasBancarias: Array<any>;
  public display_Banco: string = 'none';
  public Facturas_Multiple: boolean = true;
  public Faltantes: any = [];
  public Fecha_Comprobante = this.fechaHoy();
  public FormaPago: any = [];
  public Id_Proveedor: any = '';
  public Impuesto = 0;
  public Impuesto_Ingreso = 0;
  public Mostrar_Cliente: boolean = false;
  public Mostrar: boolean = false;
  public Nom_Cliente: any;
  public NombreProveedor: string = '';
  public Proveedores: any[] = [];
  public Rentenciones: any[] = [];
  public Retenciones_Totales = 0;
  public Subtotal_Facturas = 0;
  public Subtotal_Ingreso = 0;
  public Subtotal_Retenciones = 0;
  public Total_Credito: number = 0;
  public Total_Debito: number = 0;
  public Total_Ingreso = 0;
  public Total_ValorP = 0;
  public Valor_Banco: number = 0;
  public Valor_Devoluciones: number = 0;
  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_desc = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.ValorDescuento);
  public reducer_imp = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Total_Impuesto);
  public reducer_ret = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Valor);
  public reducer_valorp = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.ValorIngresado);
  public reducer3 = (accumulator, currentValue) => {
    var acu_iva = 0;
    if (currentValue && currentValue['RetencionesFacturas']) {
      // Verificación por indefinido
      currentValue['RetencionesFacturas'].forEach((v, i) => {
        acu_iva += isNaN(v.Valor) ? 0 : parseFloat(v.Valor);
      });
    }
    return accumulator + acu_iva;
  };

  public Categorias: any[] = [
    {
      Cuenta: '',
      Valor: '',
      Cantidad: '',
      Impuesto: 0,
      Observaciones: '',
      Subtotal: 0,
      Total_Impuesto: 0,
    },
  ];
  public datosCabecera: any = {
    Titulo: 'Nuevo recibo de caja',
    Fecha: new Date(),
    Codigo: '',
  };
  public Lista_Facturas: any[] = [
    {
      RetencionesFactura: [],
      DescuentosFactura: [],
    },
  ];

  constructor(
    private _swal: SwalService,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private readonly _user: UserService,
  ) {}

  ngOnInit() {
    this.initialSetup();
    this.initForms();
    this.loadInitialsEndpoints();
    this.getCodigoIngreso();
  }

  private initialSetup() {
    let queryParams = this.route.snapshot.queryParams;
    console.log('queryParams', queryParams);

    if (queryParams.facturas != undefined && queryParams.cliente != undefined) {
      this.form.get('Id_Cliente').setValue(queryParams.cliente);
      console.log('this.Id_Cliente', this.Id_Cliente);

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
      .get(environment.base_url + '/php/contabilidad/proveedor_buscar.php')
      .subscribe((data: any) => {
        this.Proveedores = data;
      });
  }

  private findCustomerNameById(value: number): string | undefined {
    const found = this.Cliente.find((objeto) => objeto.value === value);
    if (found) {
      return found.text;
    }
    return undefined;
  }

  private initForms(): void {
    this.form = this.fb.group({
      Fecha_Comprobante: ['', Validators.required],
      Tipo: ['Ingreso'],
      Id_Cliente: ['', Validators.required],
      Id_Banco: ['', Validators.required],
      Valor_Banco: ['', Validators.required],
      Forma_Pago: ['', Validators.required],
      Observaciones: [''],
      Notas: [''],
    });
  }

  loadInitialsEndpoints() {
    // retenciones
    this.http
      .get(environment.base_url + '/php/contabilidad/lista_retenciones.php')
      .subscribe((data: any) => {
        this.ListaRetenciones = data;
      });
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cliente.php')
      .subscribe((data: any) => {
        this.Cliente = data;
        console.log('this.Cliente', this.Cliente);

        this.Cliente.forEach(function (objeto) {
          objeto.value = objeto.id;
          delete objeto.id;
          objeto.text = objeto.Nombre;
          delete objeto.Nombre;
        });
        console.log('this.Cliente', this.Cliente);
      });
    this.http.get(environment.base_url + '/php/comprobantes/cuentas.php').subscribe((data: any) => {
      this.CuentasBancarias = data;
      console.log('this.CuentasBancarias', this.CuentasBancarias);
    });
    this.http
      .get(environment.base_url + '/php/comprobantes/formas_pago.php')
      .subscribe((data: any) => {
        this.FormaPago = data;
      });
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cuentas.php')
      .subscribe((data: any) => {
        this.Cuenta = data.Activo;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', { params: { modulo: 'Impuesto' } })
      .subscribe((data: any) => {
        this.Impuesto = data;
      });
  }

  getCodigoIngreso(fecha?: string) {
    let datos: any = { Tipo: 'Ingreso' };

    if (fecha != undefined && fecha != null) {
      datos.Fecha = fecha;
    }

    this.http
      .get(`${environment.base_url}/php/comprobantes/get_codigo.php`, { params: datos })
      .subscribe((data: any) => {
        this.datosCabecera.Codigo = data.consecutivo;
      });
  }

  guardarComprobante() {
    let info = JSON.stringify(this.form.value);
    console.log('info', info);

    let jsonData = {};

    // Agregar los datos al objeto jsonData
    jsonData['Datos'] = this.form.value;
    jsonData['Facturas'] = this.ListaFact;
    jsonData['Categorias'] = this.Categorias[0];
    jsonData['Retenciones'] = this.Rentenciones;

    const request = () => {
      this.http
        .post(environment.base_url + '/php/comprobantes/guardar_comprobante.php', jsonData)
        .subscribe({
          next: (data: any) => {
            console.log('dataaaaaaaaaaaaaaaaa', data);

            if (data.tipo == 'success' && data.id != undefined) {
              console.log('environment.base_url', environment.base_url);

              this.http
                .get(
                  `${environment.base_url}/php/comprobantes/comprobantes_pdf.php?id=${
                    data.id
                  }&tipo=${this.form.get('Tipo').value}`,
                  { responseType: 'blob' },
                )
                .subscribe(
                  (response: BlobPart) => {
                    console.log('responseeeeeeeeeeeee', response);
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10);
                    let blob = new Blob([response], { type: 'application/pdf' });
                    let link = document.createElement('a');
                    const filename = 'comprobante-ingreso' + formattedDate;
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `${filename}.pdf`;
                    link.click();
                  },
                  (error) => {},
                  () => {},
                );
              this.http
                .get(
                  `${
                    environment.base_url
                  }/php/contabilidad/movimientoscontables/movimientos_comprobante_pdf.php?id_registro=${
                    data.id
                  }&id_funcionario_elabora=${this.funcionarioId}&tipo_valor=Niif&tipo=${
                    this.form.get('Tipo').value
                  }`,
                  { responseType: 'blob' },
                )
                .subscribe(
                  (response: BlobPart) => {
                    console.log('responseeeeeeeeeeeee', response);
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().slice(0, 10);
                    let blob = new Blob([response], { type: 'application/pdf' });
                    let link = document.createElement('a');
                    const filename = 'comprobante-movimiento' + formattedDate;
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `${filename}.pdf`;
                    link.click();
                  },
                  (error) => {},
                  () => {},
                );
              this._swal.show({
                title: data.titulo,
                text: data.mensaje,
                icon: 'info',
                timer: 1500,
                showCancel: false,
              });
              setTimeout(() => {
                this.router.navigate(['/contabilidad/comprobantes/ingresos']);
              }, 1000);
            }
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            let errorMessage = 'Ocurrio un error. Intente nuevamente.';
            if (error.error.error) {
              errorMessage = error.error.error;
              this._swal.hardError();
            } else if (error.error.errors) {
              let errorMessages: string[] = [];
              for (const field in error.error.errors) {
                errorMessages.push(error.error.errors[field]);
              }
              const formattedErrorMessage = errorMessages.join('<br/>');
              this._swal.incompleteError(formattedErrorMessage);
            }
            //this._swal.hardError();
          },
        });
    };
    this._swal.swalLoading('Vamos a guardar y descargar el nuevo comprobante de ingreso', request);
  }

  ActualizaValores(tipo?) {
    if (tipo != undefined && tipo != null) {
      this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);

      setTimeout(() => {
        this.Total_ValorP = parseFloat(this.Lista_Facturas.reduce(this.reducer_valorp, 0));
        this.Subtotal_Facturas = this.Total_ValorP + this.Retenciones_Totales;
        this.Total_Facturas = this.Subtotal_Facturas - this.Retenciones_Totales;

        this.calcularTotalesDebitoCredito();
      }, 300);
    } else {
      this.Subtotal_Ingreso = parseFloat(this.Categorias.reduce(this.reducer, 0));
      this.Impuesto_Ingreso = parseFloat(this.Categorias.reduce(this.reducer_imp, 0));
      this.Total_Ingreso =
        this.Subtotal_Ingreso + this.Impuesto_Ingreso - this.Subtotal_Retenciones;
      if (this.Rentenciones.length > 0) {
        this.RecalcularRetenciones();
      }
    }
  }

  calcularTotalesDebitoCredito() {
    let total_descuento = 0;
    let total_ajustes = 0;
    this.Lista_Facturas.forEach((val, pos) => {
      total_descuento += parseFloat(
        this.Lista_Facturas[pos].DescuentosFactura.reduce(this.reducer_desc, 0),
      );
      total_ajustes += isNaN(this.Lista_Facturas[pos].ValorMayorPagar)
        ? 0
        : parseFloat(this.Lista_Facturas[pos].ValorMayorPagar);
    });
    this.Total_Debito =
      this.Valor_Banco + this.Retenciones_Totales + total_descuento + this.Valor_Devoluciones;
    this.Total_Credito = total_ajustes + (this.Total_ValorP - this.Valor_Devoluciones);
  }
  RecalcularRetenciones() {
    for (let index = 0; index < this.Rentenciones.length; index++) {
      if (this.Rentenciones[index].Id_Retencion == 12) {
        this.Rentenciones[index].Valor = (
          (parseFloat(this.Rentenciones[index].Porcentaje) / 100) *
          this.Impuesto_Ingreso
        ).toFixed(2);
      } else {
        this.Rentenciones[index].Valor = (
          (parseFloat(this.Rentenciones[index].Porcentaje) / 100) *
          this.Subtotal_Ingreso
        ).toFixed(2);
      }
    }
    setTimeout(() => {
      this.Subtotal_Retenciones = parseFloat(this.Rentenciones.reduce(this.reducer_ret, 0));
      this.ActualizaValores();
    }, 200);
  }

  ///////// FUNCS. LLAMADAS DESDE EL HTML
  CalcularRetencionesFacturas(pos, pos2) {
    let posicion = this.ListaRetenciones.findIndex(
      (x) => x.Id_Retencion == this.Lista_Facturas[pos].RetencionesFacturas[pos2].Id_Retencion,
    );

    let Tipo_Retencion = this.ListaRetenciones[posicion].Tipo_Retencion;

    this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje = parseFloat(
      this.ListaRetenciones[posicion].Porcentaje,
    );

    this.Lista_Facturas[pos].RetencionesFacturas[pos2].Tipo =
      this.ListaRetenciones[posicion].Tipo_Retencion;

    this.Lista_Facturas[pos].RetencionesFacturas[pos2].Id_Plan_Cuenta =
      this.ListaRetenciones[posicion].Id_Plan_Cuenta;

    let valorRetencion = 0;

    if (Tipo_Retencion == 'Iva') {
      valorRetencion =
        (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje) / 100) *
        this.Lista_Facturas[pos].Iva;
      this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor =
        Math.round(valorRetencion).toFixed(2);
    } else {
      valorRetencion =
        (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje) / 100) *
        this.Lista_Facturas[pos].Total_Compra;
      this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor =
        Math.round(valorRetencion).toFixed(2);
    }

    let retencionesFact = 0;

    this.Lista_Facturas[pos].RetencionesFacturas.forEach((e) => {
      retencionesFact += Math.round(parseFloat(e.Valor));
    });

    setTimeout(() => {
      // this.Lista_Facturas[pos].ValorIngresado = this.Lista_Facturas[pos].Por_Pagar - retencionesFact;

      this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);

      this.ActualizaValores('Facturas');
    }, 300);
  }

  AgregarRetencionFactura(pos) {
    // Si this.Lista_Facturas[pos] está definido, verificar si tiene la propiedad 'RetencionesFacturas'
    if (!this.Lista_Facturas[pos].hasOwnProperty('RetencionesFacturas')) {
      // Si no tiene la propiedad 'RetencionesFacturas', crearla como un array vacío
      this.Lista_Facturas[pos]['RetencionesFacturas'] = [];
    }
    // Agregar una retención a la lista
    this.Lista_Facturas[pos]['RetencionesFacturas'].push({
      Id_Retencion: '',
      Valor: 0,
    });
    console.log('this.Lista_Facturas[pos]', this.Lista_Facturas[pos]);
  }

  AgregarDescuentoFactura(pos) {
    if (this.Lista_Facturas[pos].DescuentosFactura.length < 3) {
      this.Lista_Facturas[pos].DescuentosFactura.push({
        Descuento: '',
        ValorDescuento: 0,
      });
    } else {
      this.confirmacionSwal.title = 'Advertencia!';
      this.confirmacionSwal.icon = 'warning';
      this.confirmacionSwal.text = 'No puedes agregar más descuentos en esta factura.';
      this._swal.show(this.confirmacionSwal);
    }
  }

  EliminarRetencionFactura(pos, pos2) {
    this.restablecerValorFactura(pos, pos2, 'Retencion');

    setTimeout(() => {
      this.Lista_Facturas[pos].RetencionesFacturas.splice(pos2, 1);
      this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);

      this.ActualizaValores('Facturas');
    }, 100);
  }

  EliminarDescuentoFactura(pos, pos2) {
    this.restablecerValorFactura(pos, pos2, 'Descuento');
    setTimeout(() => {
      this.Lista_Facturas[pos].DescuentosFactura.splice(pos2, 1);

      this.ActualizaValores('Facturas');
      (document.getElementById('botondescuentos' + pos) as HTMLElement).style.display = 'block';
    }, 100);
  }

  listaFacturas(fact, pos) {
    let exist_fact = this.ListaFact.indexOf(fact);
    let CodigoFactura = this.Lista_Facturas[pos].Codigo;

    if (exist_fact < 0) {
      this.ListaFact.push(fact);

      this.Lista_Facturas[pos].ValorIngresado = this.Lista_Facturas[pos].Por_Pagar;

      let esNotaC = this.esNotaCredito(CodigoFactura);

      if (!esNotaC) {
        // Si no es una nota credito, habilito estos campos.
        (document.getElementById('ValorIngresado' + pos) as HTMLInputElement).readOnly = false;
        (document.getElementById('MayorPagar' + pos) as HTMLInputElement).readOnly = false;
        (document.getElementById('ValorMayorPagar' + pos) as HTMLInputElement).readOnly = false;
        (document.getElementById('botonretencion' + pos) as HTMLInputElement).style.display =
          'block';
        (document.getElementById('botondescuentos' + pos) as HTMLInputElement).style.display =
          'block';
      } else {
        this.Valor_Devoluciones += parseFloat(this.Lista_Facturas[pos].ValorIngresado);
      }
    } else {
      this.ListaFact.splice(exist_fact, 1);
      (document.getElementById('ValorIngresado' + pos) as HTMLInputElement).readOnly = true;
      (document.getElementById('MayorPagar' + pos) as HTMLInputElement).readOnly = true;
      (document.getElementById('ValorMayorPagar' + pos) as HTMLInputElement).readOnly = true;
      (document.getElementById('botonretencion' + pos) as HTMLInputElement).style.display = 'none';
      (document.getElementById('botondescuentos' + pos) as HTMLInputElement).style.display = 'none';

      let esNotaC = this.esNotaCredito(CodigoFactura);

      if (esNotaC) {
        this.Valor_Devoluciones -= parseFloat(this.Lista_Facturas[pos].ValorIngresado);
      }

      this.Lista_Facturas[pos].RetencionesFacturas = [];
      this.Lista_Facturas[pos].Id_Cuenta_Descuento = 0;
      this.Lista_Facturas[pos].Id_Cuenta_MayorPagar = 0;
      this.Lista_Facturas[pos].Descuento = '';
      this.Lista_Facturas[pos].ValorDescuento = 0;
      this.Lista_Facturas[pos].MayorPagar = '';
      this.Lista_Facturas[pos].ValorMayorPagar = 0;
      this.Lista_Facturas[pos].ValorIngresado = 0;
    }

    setTimeout(() => {
      this.ActualizaValores('Facturas');
    }, 100);
  }

  validarValorFactura(valor, pos) {
    if (parseFloat(valor) > parseFloat(this.Lista_Facturas[pos].Por_Pagar)) {
      this.confirmacionSwal.title = 'Error!';
      this.confirmacionSwal.text =
        'El valor no puede ser superior al valor que se corresponde pagar.';
      this.confirmacionSwal.icon = 'error';
      this._swal.show(this.confirmacionSwal);
      this.Lista_Facturas[pos].ValorIngresado = this.Lista_Facturas[pos].Por_Pagar;
    }
  }

  calculosAdicionales(pos, pos2?) {
    let descuento = parseFloat(
      this.Lista_Facturas[pos].DescuentosFactura.reduce(this.reducer_desc, 0),
    );
    let mayor_pagar = parseFloat(this.Lista_Facturas[pos].ValorMayorPagar);
    let retenciones = parseFloat(
      this.Lista_Facturas[pos].RetencionesFacturas.reduce(this.reducer_ret, 0),
    );
    this.Lista_Facturas[pos].ValorDescuento = descuento;

    // this.Lista_Facturas[pos].ValorIngresado = Math.round(parseFloat(this.Lista_Facturas[pos].Por_Pagar));

    setTimeout(() => {
      this.ActualizaValores('Facturas');
    }, 100);
  }

  AgregarCampos(pos, modelo, tipo, pos2?) {
    if (tipo == 'Descuento') {
      this.Lista_Facturas[pos].DescuentosFactura[pos2].Id_Cuenta_Descuento = modelo.Id_Plan_Cuentas;
    } else if (tipo == 'MayorPagar') {
      this.Lista_Facturas[pos].Id_Cuenta_MayorPagar = modelo.Id_Plan_Cuentas;
    }
  }

  CargarArchivo(event) {
    if (event.target.files.length === 1) {
      this.Archivo = event.target.files[0];
      this.EnviarArchivo();
    }
  }

  getErrorMessage(fieldName: string) {
    if (this.form.get(fieldName).hasError('required')) {
      return 'Campo requerido';
    } else null;
  }

  /////////// FUNCIONES AUXILIARES PARA FUNCS. DE HTML
  restablecerValorFactura(pos, pos2, tipo) {
    if (tipo == 'Retencion') {
      let posicion = this.ListaRetenciones.findIndex(
        (x) => x.Id_Retencion == this.Lista_Facturas[pos].RetencionesFacturas[pos2].Id_Retencion,
      );

      let Tipo_Retencion = this.ListaRetenciones[posicion].Tipo_Retencion;

      this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje = parseFloat(
        this.ListaRetenciones[posicion].Porcentaje,
      );

      let valorRetencion = 0;

      if (Tipo_Retencion == 'Iva') {
        valorRetencion =
          (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje) / 100) *
          this.Lista_Facturas[pos].Iva;
        this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor =
          Math.round(valorRetencion).toFixed(2);
      } else {
        valorRetencion =
          (parseFloat(this.Lista_Facturas[pos].RetencionesFacturas[pos2].Porcentaje) / 100) *
          this.Lista_Facturas[pos].Total_Compra;
        this.Lista_Facturas[pos].RetencionesFacturas[pos2].Valor =
          Math.round(valorRetencion).toFixed(2);
      }

      // this.Lista_Facturas[pos].ValorIngresado += Math.round(valorRetencion);
    } else if (tipo == 'Descuento') {
      let valorDescuento = parseFloat(
        this.Lista_Facturas[pos].DescuentosFactura[pos2].ValorDescuento,
      );

      this.Lista_Facturas[pos].ValorIngresado =
        parseFloat(this.Lista_Facturas[pos].ValorIngresado) + Math.round(valorDescuento);
    }
  }

  esNotaCredito(codigo_factura) {
    let res = codigo_factura.indexOf('NC');

    if (res < 0) {
      return false;
    }

    return true;
  }

  EnviarArchivo() {
    this.Cargando = true;
    this.Facturas_Multiple = false;
    let datos = new FormData();
    datos.append('archivo', this.Archivo);
    this.http.post(environment.ruta + 'php/comprobantes/subir_facturas.php', datos).subscribe(
      (data: any) => {
        this.ListaFact = data.Facturas;
        this.Lista_Facturas = data.Facturas;
        this.Faltantes = data.Faltantes;
        this.Cargando = false;
        this.ListaFact.length;

        setTimeout(() => {
          this.Retenciones_Totales = this.Lista_Facturas.reduce(this.reducer3, 0);
          this.ActualizaValores('Facturas');
        }, 300);
      },
      (error) => {
        this.Cargando = false;
        this.confirmacionSwal.title = 'Oops!';
        this.confirmacionSwal.text =
          'Se perdió la conexión a internet. Por favor vuelve a intentarlo.';
        this.confirmacionSwal.icon = 'warning';
        this._swal.show(this.confirmacionSwal);
      },
    );
  }

  MostarContenido(tipo) {
    console.log('tipo', tipo);
    if (tipo === 'Si') {
      this.Mostrar = false;
      if (this.Id_Cliente != '') {
        this.Cargando = true;
        this.http
          .get(
            environment.base_url +
              '/php/comprobantes/lista_facturas_clientes.php?id=' +
              this.Id_Cliente,
          )
          .subscribe((data: any) => {
            console.log('data.Facturas', data);

            if (data.Facturas.length > 0) {
              this.Lista_Facturas = data.Facturas;
              console.log('this.Lista_Facturas', this.Lista_Facturas);

              this.Mostrar_Cliente = true;
            } else {
              let swal = {
                icon: 'info',
                title: 'Sin Facturas!',
                text: `${this.findCustomerNameById(this.Id_Cliente)} no tiene facturas asociadas.`,
                timer: null,
                showCancel: false,
              };
              this._swal.show(swal);
              $('input[type=radio]').prop('checked', false);
            }

            this.Cargando = false;
          });
      } else {
        let swal = {
          icon: 'error',
          title: 'Faltan datos!',
          text: 'No se ha seleccionado ningún cliente, por favor selecciona uno.',
          timer: null,
          showCancel: false,
        };
        this._swal.show(swal);
        $('input[type=radio]').prop('checked', false);
      }

      this.Categorias = [
        {
          // Limpiar cuentas contables.
          Cuenta: '',
          Valor: '',
          Cantidad: '',
          Impuesto: 0,
          Observaciones: '',
          Subtotal: 0,
          Total_Impuesto: 0,
        },
      ];

      this.Rentenciones = []; // Limpiar listado de retenciones.

      this.Total_ValorP = 0;
      this.Subtotal_Facturas = 0;
      this.Retenciones_Totales = 0;
    } else if (tipo == 'No') {
      this.Mostrar = true;
      this.Mostrar_Cliente = false;
      this.Lista_Facturas = [];
      this.ListaFact = [];
      this.Subtotal_Ingreso = 0;
      this.Impuesto_Ingreso = 0;
      this.Total_Ingreso = 0;
      this.Subtotal_Retenciones = 0;
    } else if ('Archivo') {
      if (this.Id_Cliente != '' && this.Id_Banco != '') {
        this.Mostrar_Cliente = false;
        this.Lista_Facturas = [];
        this.Mostrar = true;
        this.Facturas_Multiple = false;
      } else {
        let swal = {
          icon: 'error',
          title: 'Faltan datos!',
          text: `No se ha seleccionado el cliente y/o un banco, por favor selecciona ambos.`,
          timer: null,
          showCancel: false,
        };
        this._swal.show(swal);
        $('input[type=radio]').prop('checked', false);
      }
    }
  }

  fechaHoy() {
    let fecha: any = new Date();
    fecha = fecha.toISOString().split('T')[0];
    return fecha;
  }

  get Id_Cliente() {
    return this.form.get('Id_Cliente').value;
  }

  get Id_Banco() {
    return this.form.get('Id_Banco').value;
  }

  // comentado temporalmene
  // BuscarCuenta(cuenta, pos) {
  //   let pos2 = pos + 1;

  //   this.Categorias[pos].Id_Plan_Cuentas = cuenta.Id_Plan_Cuentas;
  //   if (cuenta.Id_Plan_Cuentas) {
  //     if (this.Categorias[pos2] == undefined) {
  //       this.Categorias.push({
  //         Cuenta: '',
  //         Valor: '',
  //         Cantidad: '',
  //         Impuesto: 0,
  //         Observaciones: '',
  //         Subtotal: 0,
  //         Total_Impuesto: 0,
  //       });
  //     }
  //   }
  // }

  // comentado temporalmene
  // Calcular(pos, tipo?) {
  //   this.Categorias[pos].Subtotal = this.Categorias[pos].Cantidad * this.Categorias[pos].Valor;
  //   this.Categorias[pos].Total_Impuesto =
  //     this.Categorias[pos].Cantidad *
  //     this.Categorias[pos].Valor *
  //     (this.Categorias[pos].Impuesto / 100);
  //   this.ActualizaValores();
  // }

  // comentado temporalmene
  // AgregarRetencion() {
  //   this.Rentenciones.push({
  //     Retencion: '',
  //     Valor: '',
  //   });
  // }

  // comentado temporalmene
  // EliminarRetencion(pos) {
  //   this.Rentenciones.splice(pos, 1);
  //   if (this.Rentenciones.length == 0) {
  //     this.Subtotal_Retenciones = 0;
  //   } else {
  //     this.RecalcularRetenciones();
  //   }
  // }

  // COMENTADO TEMPORALMENTE
  // CalcularRetenciones(pos) {
  //   let posicion = this.ListaRetenciones.findIndex(
  //     (x) => x.Id_Retencion == this.Rentenciones[pos].Id_Retencion,
  //   );

  //   let Id_Retencion = this.Rentenciones[pos].Id_Retencion;

  //   if (Id_Retencion == 12) {
  //     this.Rentenciones[pos].Porcentaje = parseFloat(this.ListaRetenciones[posicion].Porcentaje);
  //     this.Rentenciones[pos].Valor =
  //       (parseFloat(this.ListaRetenciones[posicion].Porcentaje) / 100) * this.Impuesto_Ingreso;
  //   } else {
  //     this.Rentenciones[pos].Porcentaje = parseFloat(this.ListaRetenciones[posicion].Porcentaje);
  //     this.Rentenciones[pos].Valor =
  //       (parseFloat(this.ListaRetenciones[posicion].Porcentaje) / 100) * this.Subtotal_Ingreso;
  //   }

  //   setTimeout(() => {
  //     this.RecalcularRetenciones();
  //   }, 200);
  // }
}

/////////////// ---------------- borrar las funciones:
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
