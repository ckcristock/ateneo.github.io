import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm, NgSelectOption, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { SwalService } from '../../../services/swal.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';

@Component({
  selector: 'app-clientecrear',
  templateUrl: './clientecrear.component.html',
  styleUrls: ['./clientecrear.component.scss'],
  standalone: true,
  imports: [CabeceraComponent, FormsModule, NgSelectModule, NgbTypeahead],
})
export class ClientecrearComponent implements OnInit {
  public alertOption: SweetAlertOptions = {};
  public datosCabecera = {
    Titulo: this.route.snapshot.params['id'] == undefined ? 'Nuevo Cliente' : 'Edicion Cliente',
    Fecha: new Date(),
  };

  public Departamentos!: Array<NgSelectOption>;
  Departamento: any = '';
  Municipio: any = '';
  Municipios: Array<NgSelectOption> = [];
  DireccionesDian: any = [];
  public Zonas: any = [];
  ActividadesEcon!: Array<NgSelectOption>;
  public Cuentas: any = [];
  public ReteicaModel: any = '';
  public RetefuenteModel: any = '';
  public ReteivaModel: any = '';
  public RetePorcentajes: any = {
    Reteica: 0,
    Retefuente: 0,
    Reteiva: 0,
  };
  Rut: any;

  public Model: any = {
    Id_Cliente: '',
    Digito_Verificacion: '',
    Tipo: '',
    Primer_Nombre: '',
    Segundo_Nombre: '',
    Primer_Apellido: '',
    Segundo_Apellido: '',
    Razon_Social: '',
    Nombre: '',
    Direccion: '',
    Telefono_Persona_Contacto: '',
    Celular: '',
    Correo_Persona_Contacto: '',
    Id_Departamento: '',
    Contacto_Compras: '',
    Telefono_Contacto_Compras: '',
    Email_Contacto_Compras: '',
    Contacto_Pagos: '',
    Telefono_Pagos: '',
    Email_Pagos: '',
    Regimen: '',
    Animo_Lucro: '',
    Id_Codigo_Ciiu: 0,
    Agente_Retencion: '',
    Tipo_Reteica: '',
    Id_Plan_Cuenta_Reteica: 0,
    Id_Plan_Cuenta_Retefuente: 0,
    Contribuyente: '',
    Id_Plan_Cuenta_Reteiva: 0,
    Condicion_Pago: '',
    Cupo_Asignado: 0,
    Descuento_Pronto_Pago: 0,
    Descuento_Dias: 0,
    Estado: '',
    Retencion_Factura: '',
    Id_Lista_Ganancia: '',
    Id_Zona: '',
    Impuesto: '',
  };
  Lista_Ganancia: any = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private readonly swalService: SwalService,
  ) {
    this.ListarDireccionesDian();
    this.ListarActividadesEconomicas();
  }

  onCreateProvider() {
    const request = () => {
      this.guardarCliente();
    };
    this.swalService.swalLoading('Se dispone a crear este Proveedor', request);
  }

  @ViewChild('FormProveedor') FormProveedor!: NgForm;
  message: any;

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.Cuentas.filter(
              (v: any) => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 100),
      ),
    );
  formatter1 = (x: { Codigo: string }) => x.Codigo;

  ngOnInit() {
    this.ListarDepartamentos();

    this.ListarCuentas();
    this.ListarListaGanancias();
    this.ListarZonas();

    if (this.paramsIdCliente()) {
      // Si viene un parametro en la URL se pregunta si es el Id de Cliente y/o se obtiene.
      let id = this.paramsIdCliente();

      this.getDatosCLiente(id);
    }
  }

  ListarListaGanancias() {
    this.http.get(environment.ruta + 'php/clientes/lista_ganancia.php').subscribe((data: any) => {
      this.Lista_Ganancia = data;
    });
  }

  BuscarCuenta(model: any, tipo: any) {
    /* if (model.Id_Plan_Cuentas != undefined && model.Id_Plan_Cuentas != '' && model.Id_Plan_Cuentas != null) {
      
    } */

    switch (tipo) {
      case 'Reteica':
        this.Model.Id_Plan_Cuenta_Reteica = model.Id_Plan_Cuentas;
        this.RetePorcentajes.Reteica = (
          parseFloat(model.Porcentaje.replace(',', '.')) * 100
        ).toFixed(2);
        break;

      case 'Retefuente':
        this.Model.Id_Plan_Cuenta_Retefuente = model.Id_Plan_Cuentas;
        this.RetePorcentajes.Retefuente = (
          parseFloat(model.Porcentaje.replace(',', '.')) * 100
        ).toFixed(2);

        break;
      case 'Reteiva':
        this.Model.Id_Plan_Cuenta_Reteiva = model.Id_Plan_Cuentas;
        this.RetePorcentajes.Reteiva = (
          parseFloat(model.Porcentaje.replace(',', '.')) * 100
        ).toFixed(2);
        break;
    }
    console.log(this.Model);
  }

  paramsIdCliente() {
    return this.route.snapshot.params['id'] || false;
  }

  getDatosCLiente(id: any) {
    this.http
      .get(environment.ruta + 'php/clientes/detalle_cliente.php', { params: { id: id } })
      .subscribe((data: any) => {
        this.Model = data.encabezado;
        if (this.Model.Digito_Verificacion == '' || this.Model.Digito_Verificacion == null) {
          this.getDigitoVerificacion(this.Model.Id_Cliente);
        }
        this.ReteicaModel = data.Retenciones.Reteica;
        this.RetefuenteModel = data.Retenciones.Retefuente;
        this.ReteivaModel = data.Retenciones.Reteiva;
        this.validarTipoPersona(this.Model.Tipo);
        this.validarCampoContribuyente(this.Model.Contribuyente);
        this.validarRetencion(this.Model.Agente_Retencion);
        this.ListarMunicipios();
      });
  }

  ListarDepartamentos() {
    this.http
      .get(environment.ruta + 'php/proveedores/lista_departamentos.php')
      .subscribe((data: any) => {
        this.Departamentos = data;
      });
  }
  ListarZonas() {
    this.http.get(environment.ruta + 'php/clientes/lista_zona.php').subscribe((data: any) => {
      this.Zonas = data;
    });
  }

  ListarCuentas() {
    this.http.get(environment.ruta + 'php/proveedores/lista_cuentas.php').subscribe((data: any) => {
      this.Cuentas = data.Activo;
    });
  }

  ListarMunicipios() {
    this.http
      .get(environment.ruta + 'php/proveedores/lista_municipios.php', {
        params: { id_dep: this.Model.Id_Departamento.value },
      })
      .subscribe((data: any) => {
        this.Municipios = data;
      });
  }

  ListarDireccionesDian() {
    this.http
      .get(environment.ruta + 'php/proveedores/lista_direcciones_dian.php')
      .subscribe((data: any) => {
        this.DireccionesDian = data;
      });
  }

  ListarActividadesEconomicas() {
    this.http
      .get(environment.ruta + 'php/proveedores/lista_codigos_ciiu.php')
      .subscribe((data: any) => {
        this.ActividadesEcon = data;
      });
  }

  validarTipoPersona(tipo: any) {
    switch (tipo) {
      case 'Natural':
        $('.Natural').prop('disabled', false).val('');
        $('.Juridica').prop('disabled', true).val('');

        break;

      case 'Juridico':
        $('.Natural').prop('disabled', true).val('');
        $('.Juridica').prop('disabled', false).val('');

        break;
      default:
        $('.Natural').prop('disabled', true).val('');
        $('.Juridica').prop('disabled', true).val('');
        break;
    }
  }

  construirDireccion() {
    let dir1 = (document.getElementById('Dir1') as HTMLInputElement).value.toUpperCase(),
      dir2 = (document.getElementById('Dir2') as HTMLInputElement).value.toUpperCase(),
      dir3 = (document.getElementById('Dir3') as HTMLInputElement).value.toUpperCase(),
      dir4 = (document.getElementById('Dir4') as HTMLInputElement).value.toUpperCase(),
      dir5 = (document.getElementById('Dir5') as HTMLInputElement).value.toUpperCase();

    let direccion: any = [];

    if (dir1 != '') {
      direccion.push(dir1);
    }
    if (dir2 != '') {
      direccion.push(dir2);
    }
    if (dir3 != '') {
      dir3 = dir3.replace('-', ' ');
      direccion.push(dir3);
    }
    if (dir4 != '') {
      direccion.push(dir4);
    }
    if (dir5 != '') {
      direccion.push(dir5);
    }

    setTimeout(() => {
      this.Model.Direccion = direccion.join(' ');
    }, 100);
  }

  getDigitoVerificacion(nit: any) {
    this.http
      .get(environment.ruta + 'php/GENERALES/digitoverificacion/digitoverificacion.php', {
        params: { Nit: nit },
      })
      .subscribe((data: any) => {
        this.Model.Digito_Verificacion = data.Digito_Verificacion;
      });
  }

  validarRetencion(value: any) {
    switch (value) {
      case 'Si':
        $('#Cta_Retefuente').prop('disabled', false);
        break;

      default:
        $('#Cta_Retefuente').prop('disabled', true).val('');
        break;
    }
  }

  validarCampoContribuyente(value: any) {
    switch (value) {
      case 'Si':
        $('#Cta_Reteiva').prop('disabled', true).val('');
        break;

      default:
        $('#Cta_Reteiva').prop('disabled', false);
        break;
    }
  }

  cargarRut(event: any) {
    if (event.target.files.length === 1) {
      this.Rut = event.target.files[0];
    }
  }

  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇçÂ®Ã\n',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnccARA ',
      mapping: any = {};

    for (var i = 0, j = from.length; i < j; i++) mapping[from.charAt(i)] = to.charAt(i);

    return function (str: any) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      return ret.join('');
    };
  })();

  guardarCliente() {
    let info = this.normalize(JSON.stringify(this.Model));

    let datos = new FormData();

    datos.append('datos', info);
    datos.append('modulo', 'Cliente');

    datos.append('Rut', this.Rut);

    this.http
      .post(environment.ruta + 'php/clientes/guardar_cliente.php', datos)
      .subscribe((data: any) => {
        this.message.icon = data.tipo;
        this.message.text = data.mensaje;
        this.message.title = 'Registro!';
        this.swalService.show(this.message);

        if (data.mensaje.indexOf('correctamente') >= 0) {
          // Si se guardó correctamente.
          setTimeout(() => {
            this.router.navigate(['ajustes/informacion-base/clientes']);
          }, 200);
        }
      });
  }
}
