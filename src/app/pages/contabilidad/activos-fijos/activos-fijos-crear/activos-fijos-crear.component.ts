import { Component, OnInit, ViewChild } from '@angular/core';
import { Location, NgIf, NgFor, DecimalPipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormsModule } from '@angular/forms';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { ActivosFijosService } from '../activos-fijos.service';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivoFijoModel } from '../activo-fijo-model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import swal from 'sweetalert2';
import { TerceroService } from '../../../../core/services/tercero.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PlanCuentasService } from '../../plan-cuentas/plan-cuentas.service';
import { UserService } from 'src/app/core/services/user.service';
import { CustumetypeaheadComponent } from '../../custumetypeahead/custumetypeahead.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
type Person = { value: number; text: string };

@Component({
  selector: 'app-activos-fijos-crear',
  templateUrl: './activos-fijos-crear.component.html',
  styleUrls: ['./activos-fijos-crear.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgbTypeahead,
    NgIf,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    CustumetypeaheadComponent,
    DecimalPipe,
    CurrencyPipe,
  ],
})
export class ActivosFijosCrearComponent implements OnInit {
  alertSwal: any;

  public datosCabecera: any = {
    Titulo: 'Nuevo activo fijo',
    Fecha: new Date(),
    Codigo: '',
    Empresa: {},
  };
  public alertOption: SweetAlertOptions = {};
  public TerceroSeleccionado: any = '';
  public ActivoFijoModel: ActivoFijoModel = new ActivoFijoModel();
  public Crear: boolean = true;
  public Ruta = '/php/activofijo/filtrar.php';
  public typeahead: any = {
    placeholder: 'centro costo',
    name: 'Centro_Costo',
    id: 'Centro_Costo',
    Requerido: true,
  };
  public typeahead_Cuenta_Anticipo: any = {
    placeholder: 'cuenta anticipo',
    name: 'Cta_Anticipo',
    id: 'Cta_Anticipo',
    Requerido: false,
  };

  public typeahead_CuentaXPagar: any = {
    placeholder: 'cuenta por pagar',
    name: 'CtaPorPagar',
    id: 'CtaPorPagar',
    Requerido: false,
  };
  public typeahead_Rete_Ica: any = {
    placeholder: 'cuenta reteica',
    name: 'Rete_Ica',
    id: 'Rete_Ica',
    Requerido: false,
  };
  public typeahead_Rete_Fuente: any = {
    placeholder: 'Cuenta retefuente',
    name: 'Rete_Fuente',
    id: 'Rete_Fuente',
    Requerido: false,
  };
  public typeahead_Terceros: any = {
    placeholder: 'Nombre o Nit',
    name: 'Nit',
    id: 'Nit',
    Requerido: false,
  };
  public Campo_Centro_Costo = '';
  public Retenciones: any = [];
  public Ruta_Cuentas = '/php/activofijo/cuentas.php';
  public Ruta_Cuenta_Renteciones = '/php/activofijo/cuentas_retenciones.php';
  public Ruta_Nit = '/php/terceros/filtrar_terceros.php';
  public TipoActivos: Array<any> = [];
  public Campo_Rete_Ica = '';
  public Campo_CtaPorPagar = '';
  public Campo_NitPorPagar = '';
  public Campo_Contrapartida = '';
  public Campo_Rete_Fuente = '';
  public Cuenta = [];
  public Ctas_Anticipo: any = [
    {
      Cta_Anticipo: '',
      Nit_Anticipo: '',
      Id_Plan_Cuenta: '',
      Nit: '',
      Documento: '',
      Detalles: '',
      Valor: 0,
    },
  ];
  public Mostrar_Facturas: boolean = false;
  public Lista_Facturas: any = [];
  position_document: number;
  Facturas: any = [];
  Cliente: any = [];
  Total_Debito: number = 0;
  Total_Credito: number = 0;
  public Tipo_Creacion = 'Nuevo';
  public reducer_anticipo = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Valor);
  private _rutaBase: string = environment.base_url + '/php/terceros/';
  terceros: any[] = [];
  companies: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private swalService: SwalService,
    private _terceroService: TerceroService,
    private _activoFijos: ActivosFijosService,
    private _company: PlanCuentasService,
    private _user: UserService,
  ) {
    this.ActivoFijoModel.company_id = this._user.user.person.company_worked.id;
    this.alertOption = {
      title: '¿Estás seguro(a)?',
      text: 'Vamos a guardar el comprobante',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: '#A3BD30',
      confirmButtonText: '¡Sí, confirmar!',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      focusCancel: true,
      icon: 'question',
      reverseButtons: true,
      input: 'select',
      inputOptions: {
        Pcga: 'Imprimir en PCGA',
        Niif: 'Imprimir en NIIF',
      },
      preConfirm: (value) => {
        return new Promise((resolve) => {
          this.GuardarActivoFijo(value);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  onSaveVoucher() {
    this.swalService.customAlert(this.alertOption);
  }

  ngOnInit() {
    this.getCodigoActivo();
    this.GetTipoActivos();
    this.GetRetenciones();
    this.isAdicion();
    this.http
      .get(environment.base_url + '/php/comprobantes/lista_cuentas.php', {
        params: { company_id: this._user.user.person.company_worked.id },
      })
      .subscribe((data: any) => {
        this.Cuenta = data.Activo;
      });
    this.http
      .get(environment.base_url + this.Ruta_Nit, {
        params: { company_id: this._user.user.person.company_worked.id },
      })
      .subscribe((data: any) => {
        this.Cliente = data;
      });
    this.FiltrarTerceros().subscribe((data: any) => {
      this.terceros = data;
    });
    this.ListasEmpresas();
  }

  FiltrarTerceros(): Observable<any> {
    // let p = {coincidencia:match};
    return this.http.get(this._rutaBase + 'filtrar_terceros.php', {
      params: { company_id: this._user.user.person.company_worked.id },
    });
  }

  ListasEmpresas() {
    this._company.getCompanies().subscribe((data: any) => {
      this.companies = data.data;
    });
  }

  search_tercero = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.terceros
              .filter((v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10),
      ),
      /* debounceTime(200),
        distinctUntilChanged(),
        switchMap( term => term.length < 4 ? [] :
          this.terceros.map(response => response)
        ) */
    );

  formatter_tercero = (x: { Nombre_Tercero: string }) => x.Nombre_Tercero;

  AsignarTercero() {
    if (typeof this.TerceroSeleccionado == 'object') {
      this.ActivoFijoModel.Nit = this.TerceroSeleccionado.Nit;
      this.ActivoFijoModel.Tipo = this.TerceroSeleccionado.Tipo;
    } else {
      this.ActivoFijoModel.Nit = '';
    }
  }

  AsignarConcepto() {
    this.ActivoFijoModel.Concepto = (
      this.ActivoFijoModel.Documento +
      ' ' +
      this.ActivoFijoModel.Nombre
    ).toUpperCase();
  }

  CapturarIdCentroCosto(id: string, tipo: string, pos?: number) {
    if (tipo == 'Centro') {
      this.ActivoFijoModel.Id_Centro_Costo = id;
    } else if (tipo == 'Anticipo') {
      // this.ActivoFijoModel.Id_Cuenta_Anticipo=id;
      this.Ctas_Anticipo[pos].Id_Plan_Cuenta = id != '' ? id : '';

      if (id != '') {
        if (this.Ctas_Anticipo[pos + 1] == undefined) {
          this.Ctas_Anticipo.push({
            Id_Plan_Cuenta: '',
            Nit: '',
            Documento: '',
            Valor: 0,
          });
        }
      }
    } else if (tipo == 'CxP') {
      this.ActivoFijoModel.Id_Cuenta_Cuenta_Por_Pagar = id;
    } else if (tipo == 'Rete_Ica') {
      this.ActivoFijoModel.Id_Cuenta_Rete_Ica = parseInt(id);
      if (id != '') {
        let pos = this.Retenciones.findIndex((x) => x.Id_Plan_Cuenta == id);
        if (pos >= 0) {
          this.ActivoFijoModel.Costo_Rete_Ica = Math.round(
            (parseFloat(this.Retenciones[pos].Porcentaje) / 100) * this.ActivoFijoModel.Base,
          );
          this.ActivoFijoModel.Costo_Rete_Ica_NIIF = Math.round(
            (parseFloat(this.Retenciones[pos].Porcentaje) / 100) * this.ActivoFijoModel.Base_NIIF,
          );

          this.calcularTotales();
        }
      }
    } else if (tipo == 'Nit_Anticipo') {
      // this.ActivoFijoModel.Nit_Anticipo=id;
      this.Ctas_Anticipo[pos].Nit = id != '' ? id : '';
    } else if (tipo == 'Nit_CtaPorPagar') {
      this.ActivoFijoModel.Nit_CtaPorPagar = id;
    } else if (tipo == 'Rete_Fuente') {
      this.ActivoFijoModel.Id_Cuenta_Rete_Fuente = parseInt(id);
      if (id != '') {
        let pos = this.Retenciones.findIndex((x) => x.Id_Plan_Cuenta == id);

        if (pos >= 0) {
          this.ActivoFijoModel.Costo_Rete_Fuente = Math.round(
            (parseFloat(this.Retenciones[pos].Porcentaje) / 100) * this.ActivoFijoModel.Base,
          );
          this.ActivoFijoModel.Costo_Rete_Fuente_NIIF = Math.round(
            (parseFloat(this.Retenciones[pos].Porcentaje) / 100) * this.ActivoFijoModel.Base_NIIF,
          );

          this.calcularTotales();
        }
      }
    }
  }

  getCodigoActivo() {
    this.http
      .get(environment.base_url + '/php/activofijo/get_codigo.php', {
        params: { company_id: this._user.user.person.company_worked.id },
      })
      .subscribe((data: any) => {
        this.datosCabecera.Codigo = data.consecutivo;
      });
  }

  AsignarValor(tipo) {
    if (tipo == 'Pcga') {
      let valor =
        parseFloat(this.ActivoFijoModel.Base.toString()) +
        parseFloat(this.ActivoFijoModel.Iva.toString());
      this.ActivoFijoModel.Costo_PCGA = valor;
    } else {
      let valor =
        parseFloat(this.ActivoFijoModel.Base_NIIF.toString()) +
        parseFloat(this.ActivoFijoModel.Iva_NIIF.toString());
      this.ActivoFijoModel.Costo_NIIF = valor;
    }

    this.RecalcularRetenciones();

    this.calcularTotales();
  }

  RecalcularRetenciones() {
    if (parseFloat(this.ActivoFijoModel.Id_Cuenta_Rete_Fuente.toString()) != 0) {
      let pos = this.Retenciones.findIndex(
        (x) => x.Id_Plan_Cuenta === this.ActivoFijoModel.Id_Cuenta_Rete_Fuente,
      );

      if (pos >= 0) {
        this.ActivoFijoModel.Costo_Rete_Fuente =
          (this.Retenciones[pos].Porcentaje / 100) * this.ActivoFijoModel.Base;
      }
    }
    if (parseFloat(this.ActivoFijoModel.Id_Cuenta_Rete_Ica.toString()) != 0) {
      let pos = this.Retenciones.findIndex(
        (x) => x.Id_Plan_Cuenta === this.ActivoFijoModel.Id_Cuenta_Rete_Ica,
      );
      if (pos >= 0) {
        this.ActivoFijoModel.Costo_Rete_Ica =
          (this.Retenciones[pos].Porcentaje / 100) * this.ActivoFijoModel.Base;
      }
    }
  }

  GuardarActivoFijo(tipo) {
    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    let data = new FormData();
    let modelo = this._activoFijos.normalize(JSON.stringify(this.ActivoFijoModel));
    let ctas_anticipo = this._activoFijos.normalize(JSON.stringify(this.Ctas_Anticipo));
    data.append('modelo', modelo);
    data.append('ctas_anticipo', ctas_anticipo);

    if (this.Tipo_Creacion == 'Nuevo') {
      this.http
        .post(environment.base_url + '/php/activofijo/guardar_activo_fijo.php', data)
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            if (tipo == 'Pcga') {
              // window.open(environment.base_url+'/php/contabilidad/movimientoscontables/movimientos_activo_fijo_pdf.php?id_registro='+data.Id+'&id_funcionario_elabora='+this.ActivoFijoModel.Identificacion_Funcionario,'_blank');
            } else {
              // window.open(environment.base_url+'/php/contabilidad/movimientoscontables/movimientos_activo_fijo_pdf.php?id_registro='+data.Id+'&id_funcionario_elabora='+this.ActivoFijoModel.Identificacion_Funcionario+'&tipo=Niif','_blank');
            }
            this.router.navigate(['/contabilidad/activos-fijos']);
          }
          Swal.fire({
            icon: data.codigo,
            title: data.titulo,
            text: data.mensaje,
          });
          // this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        });
    } else {
      this.http
        .post(environment.base_url + '/php/activofijo/guardar_activo_fijo_adicion.php', data)
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            if (tipo == 'Pcga') {
              // window.open(environment.base_url+'php/contabilidad/movimientoscontables/movimientos_activo_fijo_pdf.php?id_registro='+data.Id+'&activo=Adicion&id_funcionario_elabora='+this.ActivoFijoModel.Identificacion_Funcionario,'_blank');
            } else {
              // window.open(environment.base_url+'php/contabilidad/movimientoscontables/movimientos_activo_fijo_pdf.php?id_registro='+data.Id+'&activo=Adicion&id_adicion='+data.Id_Adicion+'&id_funcionario_elabora='+this.ActivoFijoModel.Identificacion_Funcionario+'&tipo=Niif','_blank');
            }
            this.router.navigate(['/contabilidad/activos-fijos']);
          }
          Swal.fire({
            icon: data.codigo,
            title: data.titulo,
            text: data.mensaje,
          });
          // this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        });
    }
  }

  ValidateBeforeSubmit() {
    if (this.ActivoFijoModel.Costo_NIIF == 0) {
      this.ShowSwal('error', 'Alerta', 'El costo no puede ser 0, verifica el costo NIIF');
      return false;
    } else if (this.ActivoFijoModel.Costo_PCGA == 0) {
      this.ShowSwal('error', 'Alerta', 'El costo no puede ser 0, verica el costo PCGA');
      return false;
    } else if (this.ActivoFijoModel.Id_Centro_Costo == '') {
      this.ShowSwal('error', 'Alerta', 'No ha agregado un centro de costo');
      return false;
    } /* else if (this.ActivoFijoModel.Id_Cuenta_Contrapartida == '' ) {
      this.ShowSwal('warning', 'Alerta', 'No ha agregado una cuenta para la contrapartida!');
      return false;

    } */ else {
      return true;
    }
  }

  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.icon = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.swalService.show(this.alertSwal);
  }

  GetTipoActivos() {
    this.http
      .get(environment.base_url + '/php/tipoactivo/get_tipo_activos.php')
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.TipoActivos = data.query_result;
        } else {
          this.TipoActivos = [];
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }
      });
  }

  GetRetenciones() {
    this.http
      .get(environment.base_url + '/php/activofijo/retenciones.php')
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.Retenciones = data;
        } else {
          this.Retenciones = [];
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }
      });
  }

  showFacturas(pos) {
    let nit = this.Ctas_Anticipo[pos].Nit;

    if (nit) {
      this.position_document = pos;
      let p: any = { nit: nit };
      let id_plan_cuenta = this.Ctas_Anticipo[pos].Id_Plan_Cuenta;

      if (id_plan_cuenta != '') {
        p.id_plan_cuenta = id_plan_cuenta;
      }

      this.http
        .get(environment.base_url + '/php/activofijo/lista_facturas.php', { params: p })
        .subscribe((data: any) => {
          this.Lista_Facturas = data.Facturas;
          this.Mostrar_Facturas = true;
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
  }

  addInvoicesToAccount() {
    let nit = this.Ctas_Anticipo[this.position_document].Nit;
    this.Ctas_Anticipo.splice(this.position_document, 1); // Eliminando una fila para introducir las nuevas cuentas.
    let count = this.Ctas_Anticipo.length; // Total de filas de las cuentas.

    if (this.Ctas_Anticipo[count - 1] != undefined) {
      if (
        this.Ctas_Anticipo[count - 1].Nit == undefined ||
        this.Ctas_Anticipo[count - 1].Nit == ''
      ) {
        this.Ctas_Anticipo.splice(count - 1, 1); // Eliminando ultima fila.
      }
    }

    this.Facturas.forEach((f) => {
      // let plan_cuenta = this.obtenerPlanPorTipo(f.Tipo_Factura);
      let object = {
        Cta_Anticipo: this.obtenerPlanCuenta(f.Codigo),
        Id_Plan_Cuenta: f.Id_Plan_Cuenta,
        Nit_Anticipo: this.getDatosTercero(nit),
        Nit: nit,
        Documento: f.Factura,
        Valor: f.Abono,
      };

      this.Ctas_Anticipo.push(object); // Agregando nueva(s) fila(s)
    });

    this.Ctas_Anticipo.push({
      Id_Plan_Cuenta: '',
      Nit: '',
      Documento: '',
      Valor: 0,
    });

    this.Mostrar_Facturas = false;
    this.Facturas = [];
    this.Lista_Facturas = [];

    setTimeout(() => {
      this.calcularTotales();
    }, 300);
  }

  obtenerPlanCuenta(codigo: string) {
    return this.Cuenta.find((x) => x.Codigo_Cuenta === codigo);
  }

  getDatosTercero(nit) {
    let obj = this.Cliente.find((x) => x.Id == nit);
    return obj;
  }

  calcularTotales() {
    this.Total_Debito = this.ActivoFijoModel.Base + this.ActivoFijoModel.Iva;
    this.Total_Credito =
      this.ActivoFijoModel.Costo_Rete_Fuente +
      this.ActivoFijoModel.Costo_Rete_Ica +
      this.ActivoFijoModel.Valor_CtaPorPagar;
    let total_anticipos = this.Ctas_Anticipo.reduce(this.reducer_anticipo, 0);

    this.Total_Credito += total_anticipos;
  }

  AdicionActivo(id) {
    let p = { id_activo: id };
    this.http
      .get(environment.base_url + '/php/activofijo/get_activo_fijo_adiccion.php', { params: p })
      .subscribe((data: any) => {
        if ((data.codigo = 'success')) {
          this.Tipo_Creacion = 'Adicion';
          this.ActivoFijoModel.Id_Activo_Fijo = data.Id_Activo_Fijo;
          this.datosCabecera.Codigo = data.Codigo;
          this.ActivoFijoModel.Codigo = data.Codigo;
          this.ActivoFijoModel.Tipo_Activo = data.Tipo_Activo;
          this.ActivoFijoModel.Id_Tipo_Activo_Fijo = data.Id_Tipo_Activo_Fijo;
          this.ActivoFijoModel.Id_Centro_Costo = data.Id_Centro_Costo;
          this.ActivoFijoModel.Centro_Costo = data.Centro_Costo;
          this.Crear = false;
        } else {
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }
      });
  }

  isAdicion() {
    let params = this.route.snapshot.queryParams;

    if (Object.keys(params).length > 0) {
      // Validar si existe queryParams, especialmente para saber si es una adicion.
      this.AdicionActivo(params.AF);
    }
  }

  validarCampo(campo, event, tipo) {
    // Funcion que validará los campos de typeahead
    if (typeof campo != 'object' && campo != '') {
      let id = event.target.id;
      // (document.getElementById(id) as HTMLInputElement).focus();
      Swal.fire({
        icon: 'error',
        title: 'Incorrecto!',
        text: `El valor ${tipo} no es valido.`,
      });
      // this.swalService.ShowMessage(swal);
    }
  }

  validarSaldoFactura(pos, event) {
    let saldo = parseFloat(this.Lista_Facturas[pos].Valor_Saldo);
    let abono = parseFloat(this.Lista_Facturas[pos].Abono);

    if (abono > saldo) {
      // Validando que el abono no pueda ser mayor al saldo de una factura de cartera.
      let id = event.target.id;
      // (document.getElementById(id) as HTMLInputElement).focus();
      Swal.fire({
        icon: 'error',
        title: 'Incorrecto!',
        text: `El valor del abono no puede ser mayor al saldo de la factura.`,
      });
      // this.swalService.ShowMessage(swal);
    }
  }

  getCodigo(fecha?: string) {
    let datos: any = {};

    if (fecha != undefined && fecha != null) {
      datos.Fecha = fecha;
    }

    this.http
      .get(environment.base_url + '/php/activofijo/get_codigo.php', { params: datos })
      .subscribe((data: any) => {
        this.datosCabecera.Codigo = data.consecutivo;
      });
  }

  deleteRowCtaAnticipo(pos) {
    this.Ctas_Anticipo.splice(pos, 1);

    setTimeout(() => {
      this.calcularTotales();
    }, 300);
  }
}
