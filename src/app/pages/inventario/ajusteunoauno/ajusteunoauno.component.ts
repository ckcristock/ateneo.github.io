import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Location, NgClass, NgFor, DatePipe } from '@angular/common';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { CustomcurrencyPipe } from '../../../core/pipes/customcurrency.pipe';
import { ModalBasicComponent } from '../../../components/modal-basic/modal-basic.component';
import { ReporteajusteinventarioComponent } from './reporteajusteinventario/reporteajusteinventario.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { ActionViewComponent } from '../../../shared/components/standard-components/action-view/action-view.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { RouterLink } from '@angular/router';
import { AddButtonComponent } from '../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';

@Component({
  selector: 'app-ajusteunoauno',
  templateUrl: './ajusteunoauno.component.html',
  styleUrls: ['./ajusteunoauno.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    NgClass,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    ReporteajusteinventarioComponent,
    ModalBasicComponent,
    NgFor,
    DatePipe,
    CustomcurrencyPipe,
  ],
})
export class AjusteunoaunoComponent implements OnInit {
  confirmacionSwal: any;

  @ViewChild('modalLotes') modalLotes: any;
  @ViewChild('modalAnular') modalAnular: any;
  @ViewChild('FormEntrada') private FormEntrada: NgForm;
  @ViewChild('FormSalida') private FormSalida: NgForm;

  public alertOption: SweetAlertOptions = {};
  public alertOptionEntrada: SweetAlertOptions = {};
  public alertOptionSalida: SweetAlertOptions = {};
  public ListaProductoBusqueda: any[];
  public ListaProductoSalida: any[] = [];
  public Lista_Productos: any[] = [];
  public Lista_Productos_Salida: any[] = [];
  public Productos = '';
  public Producto_Salida: any = {};
  public temporal = '';
  public Nombre = '';
  public Laboratorio = '';
  public bodegas: any[] = [];
  public puntos: Array<any>;
  public punto: any = '';
  public Lotes: any[] = [];
  public display_bodega = 'block';
  public display_punto = 'none';
  public display_bodega_salida = 'block';
  public display_punto_salida = 'none';
  public Fecha = new Date();
  public User = JSON.parse(localStorage.getItem('User'));
  public perfilUsuario: any = localStorage.getItem('miPerfil');
  public TipoAjuste: any = '';
  public Fecha_minima: any = '';
  public Fecha_Actual: any = '';
  public Ajustes: any = [];
  public CargandoEnt: boolean = false;

  public filtro_cod: string = '';
  public filtro_cli: string = '';
  public filtro_fun: string = '';
  public filtro_tipo: string = '';
  public filtro_bodega: string = '';
  public filtro_fecha: any = '';

  private Id_Punto: any = localStorage.getItem('Punto');

  public ModelAnular: any = {
    Funcionario_Anula: '',
    Observacion_Anulacion: '',
  };

  public Id_Ajuste: any = '';

  myDateRangePickerOptions: any = {
    width: '100px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  ClaseAjustes: any = [];

  miPerfil = localStorage.getItem('miPerfil');

  globales = environment;

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  userId: any;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    private http: HttpClient,
    private location: Location,
    private readonly userService: UserService,
    private readonly swalService: SwalService,
  ) {
    this.userId = userService.user.person.identifier;
    this.ModelAnular.Funcionario_Anula = this.userId;
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Anular este Ajuste Individual',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Anular',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.AnularAjuste();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };

    this.alertOptionEntrada = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar el ajuste de Inventario',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarEntrada(this.FormEntrada);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };

    this.alertOptionSalida = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar Esta salida de Inventario',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarAjuste(this.FormSalida);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };

    let Fecha: any = new Date();
    Fecha.setMonth(Fecha.getMonth() + 18);

    let Fecha_min: any = new Date(Fecha);
    let mes = Fecha_min.getMonth() < 10 ? '0' + Fecha_min.getMonth() : Fecha_min.getMonth();
    let dia = Fecha_min.getDate() < 10 ? '0' + Fecha_min.getDate() : Fecha_min.getDate();
    Fecha_min = Fecha_min.getFullYear() + '-' + mes + '-' + dia;
    this.Fecha_minima = Fecha_min;

    this.SetFechaMinimaVencimiento();
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.filtro_fecha = `${formatDate(this.formRange.value.start as string)} - ${formatDate(
      this.formRange.value.end as string,
    )}`;
    this.filtros();
  }

  onAjustCancel(): void {
    swal.fire(this.alertOption);
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
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term.length < 4
          ? []
          : this.ListaProductoSalida.filter(
              (v) => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1,
            ).slice(0, 10),
      ),
    );
  formatter = (x: { Nombre: string }) => x.Nombre;

  ngOnInit() {
    this.ListarAjustes();
    this.ClaseAjustesIndividual();
  }

  ListarAjustes() {
    this.http
      .get(this.globales.base_url + '/php/ajuste_individual_nuevo/Lista_Ajuste_Individual.php')
      .subscribe((data: any) => {
        this.Ajustes = data.Lista;
        this.pagination.length = data.numReg;
      });
  }

  onPagination() {
    let queryString = this.getQueryString(true);

    this.location.replaceState('/ajusteunoauno', queryString);

    this.http
      .get(
        this.globales.base_url +
          '/php/ajuste_individual_nuevo/Lista_Ajuste_Individual.php' +
          queryString,
      )
      .subscribe((data: any) => {
        this.Ajustes = data.Lista;
        this.pagination.length = data.numReg;
      });
  }
  filtros() {
    let queryString = this.getQueryString();
    this.location.replaceState('/ajusteunoauno', queryString);
    this.http
      .get(
        this.globales.base_url +
          '/php/ajuste_individual_nuevo/Lista_Ajuste_Individual.php' +
          queryString,
      )
      .subscribe((data: any) => {
        this.Ajustes = data.Lista;
        this.pagination.length = data.numReg;
      });
  }
  getQueryString(pagination: boolean = false) {
    let params: any = {};
    let queryString = '';

    params.pag = this.pagination.page;

    if (this.filtro_fun != '') {
      params.fun = this.filtro_fun;
    }
    if (this.filtro_tipo != '') {
      params.tipo = this.filtro_tipo;
    }
    if (this.filtro_fecha != '') {
      params.fecha = this.filtro_fecha;
    }
    if (this.filtro_cod != '') {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_bodega != '') {
      params.bod = this.filtro_bodega;
    }

    queryString =
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    return queryString;
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtro_fecha = event.formatted;
    } else {
      this.filtro_fecha = '';
    }
    this.filtros();
  }

  ListarLotes() {
    if (this.Producto_Salida.Lotes != '' && this.Producto_Salida.Lotes != undefined) {
      var pos = this.Lista_Productos_Salida.findIndex(
        (x) => x.Id_Producto == this.Producto_Salida.Id_Producto,
      );
      if (pos >= 0) {
        this.confirmacionSwal.title = 'Error';
        this.confirmacionSwal.text = 'Este Producto ya se encuentra en la lista';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
        this.Producto_Salida = '';
      } else {
        this.Lotes = this.Producto_Salida.Lotes;
        this.Nombre = this.Producto_Salida.Nombre;
        this.modalLotes.show();
      }
    }
  }

  ListarProductosEntrada() {
    if (this.TipoAjuste == 1) {
      this.CargandoEnt = true;
      this.http
        .get(this.globales.ruta + 'php/ajusteindividual/lista_productos_entrada.php')
        .subscribe((data: any) => {
          this.CargandoEnt = false;
          this.ListaProductoBusqueda = data;
          (document.getElementById('Producto_Entrega') as HTMLInputElement).disabled = false;
        });
    }
  }

  ClaseAjustesIndividual() {
    this.http
      .get(this.globales.base_url + '/php/ajuste_individual_nuevo/clase_ajuste_individual.php')
      .subscribe((data: any) => {
        this.ClaseAjustes = data;
      });
  }

  ListarProductos(Id_Producto) {
    if (Id_Producto != '') {
      var posicion = this.ListaProductoBusqueda.findIndex((x) => x.Id_Producto === Id_Producto);
      if (posicion >= 0) {
        if (this.Lista_Productos.length == 0) {
          this.Lista_Productos.push(this.ListaProductoBusqueda[posicion]);
        } else {
          let model: any = {
            Id_Producto: this.ListaProductoBusqueda[posicion].Id_Producto,
            Nombre: this.ListaProductoBusqueda[posicion].Nombre,
            Nombre_Producto: this.ListaProductoBusqueda[posicion].Nombre_Producto,
            Embalaje: this.ListaProductoBusqueda[posicion].Embalaje,
            Codigo_Cum: this.ListaProductoBusqueda[posicion].Codigo_Cum,
            Laboratorio_Comercial: this.ListaProductoBusqueda[posicion].Laboratorio_Comercial,
            Lote: '',
            Cantidad: '',
            Costo: '',
            Fecha_Vencimiento: '',
            Observaciones: '',
          };

          this.Lista_Productos.push(model);
        }
        this.Productos = '';
      }
    }
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

  GuardarAjuste(formulario: NgForm) {
    let prod = this.normalize(JSON.stringify(this.Lista_Productos_Salida));
    let data = this.normalize(JSON.stringify(formulario.value));
    let datos = new FormData();
    datos.append('productos', prod);
    datos.append('datos', data);
    datos.append('funcionario', this.userId);
    this.http
      .post(this.globales.ruta + 'php/ajusteindividual/guardar_salida.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.title = data.titulo;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.icon = data.tipo;
        this.swalService.show(this.confirmacionSwal);
        this.Lista_Productos_Salida = [];
        this.ListarAjustes();
      });
  }
  GuardarEntrada(formulario: NgForm) {
    let prod = this.normalize(JSON.stringify(this.Lista_Productos));
    let data = this.normalize(JSON.stringify(formulario.value));
    let datos = new FormData();
    datos.append('productos', prod);
    datos.append('datos', data);
    datos.append('funcionario', this.userId);
    this.http
      .post(this.globales.ruta + 'php/ajusteindividual/guardar_entrada.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.title = data.titulo;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.icon = data.tipo;
        this.swalService.show(this.confirmacionSwal);
        this.Lista_Productos = [];
        this.ListarAjustes();
      });
  }
  Tipo(tipo) {
    if (tipo == 'Bodega') {
      this.http
        .get(this.globales.base_url + '/php/lista_generales.php', {
          params: { modulo: 'Bodega' },
        })
        .subscribe((data: any) => {
          this.bodegas = data;
          this.display_bodega = 'block';
          this.display_punto = 'none';
        });
    } else if ((tipo = 'Punto')) {
      this.http
        .get(this.globales.ruta + 'php/GENERALES/puntos/lista_puntos_dispensacion.php')
        .subscribe((data: any) => {
          this.puntos = data;
          this.display_punto = 'block';
          this.display_bodega = 'none';
        });
    }
  }
  listarInventarioBodega(id) {
    this.http
      .get(this.globales.ruta + 'php/ajusteindividual/lista_producto_inventario.php', {
        params: { tipo: 'Bodega', id: id },
      })
      .subscribe((data: any) => {
        this.ListaProductoSalida = data;
        (document.getElementById('Producto') as HTMLInputElement).disabled = false;
      });
  }
  listarInventarioPunto(id) {
    this.http
      .get(this.globales.ruta + 'php/ajusteindividual/lista_producto_inventario.php', {
        params: { tipo: 'Punto', id: id },
      })
      .subscribe((data: any) => {
        this.ListaProductoSalida = data;
        (document.getElementById('Producto') as HTMLInputElement).disabled = false;
      });
  }

  TipoSalida(tipo) {
    if (tipo == 'Bodega') {
      this.http
        .get(this.globales.base_url + '/php/lista_generales.php', {
          params: { modulo: 'Bodega' },
        })
        .subscribe((data: any) => {
          this.bodegas = data;
          this.display_bodega_salida = 'block';
          this.display_punto_salida = 'none';
        });
    } else if ((tipo = 'Punto')) {
      this.http
        .get(this.globales.ruta + 'php/GENERALES/puntos/lista_puntos_dispensacion.php')
        .subscribe((data: any) => {
          this.puntos = data;
          this.display_punto_salida = 'block';
          this.display_bodega_salida = 'none';
        });
    }
  }
  habilitarCampos(i) {
    var checkeado = (document.getElementById('check' + i) as HTMLInputElement).checked;
    switch (checkeado) {
      case true: {
        var posicion = this.Lista_Productos_Salida.findIndex(
          (x) => x.Id_Inventario == this.Lotes[i].Id_Inventario,
        );
        if (posicion < 0) {
          this.Lista_Productos_Salida.push(this.Lotes[i]);
        } else {
          this.confirmacionSwal.title = 'Error';
          this.confirmacionSwal.text = 'Este Lote ya se encuentra en la lista, por favor revise';
          this.confirmacionSwal.icon = 'error';
          this.swalService.show(this.confirmacionSwal);
        }
        break;
      }
    }
  }
  ValidarCantidad(cantidad, i) {
    if (parseInt(cantidad) > 0) {
      if (parseInt(cantidad) <= parseInt(this.Lista_Productos_Salida[i].Cantidad)) {
        this.Lista_Productos_Salida[i].Cantidad_Actual = cantidad;
      } else {
        this.confirmacionSwal.title = 'Error';
        this.confirmacionSwal.text = `La cantidad no puede ser mayor a la que se tiene en inventario (${this.Lista_Productos_Salida[i].Cantidad}). Por favor revise`;
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
        this.Lista_Productos_Salida[i].Cantidad_Actual = this.Lista_Productos_Salida[i].Cantidad;
      }
    } else {
      this.confirmacionSwal.title = 'Error';
      this.confirmacionSwal.text = 'La cantidad no puede ser igual a Cero, Por Favor revise';
      this.confirmacionSwal.icon = 'error';
      this.swalService.show(this.confirmacionSwal);
      this.Lista_Productos_Salida[i].Cantidad_Actual = this.Lista_Productos_Salida[i].Cantidad;
    }
  }
  limpiar_Producto_Salida() {
    this.Producto_Salida = '';
  }
  EliminarProductoEnt(i) {
    this.Lista_Productos.splice(i, 1);
  }
  EliminarProducto(i) {
    this.Lista_Productos_Salida.splice(i, 1);
  }
  validarFechaVenc(value) {
    if (value < this.Fecha_minima) {
      this.confirmacionSwal.title = 'Error';
      this.confirmacionSwal.text = 'La fecha de vencimiento no puede ser menor a 18 meses.';
      this.confirmacionSwal.icon = 'error';
      this.swalService.show(this.confirmacionSwal);
      (document.getElementById('btn_guardar_entrada') as HTMLInputElement).disabled = true;
    } else {
      (document.getElementById('btn_guardar_entrada') as HTMLInputElement).disabled = false;
    }
  }
  capturarDigitacionEnt(pos) {
    let lote = (document.getElementById('Lote' + pos) as HTMLInputElement).value;
    let cantidad = (document.getElementById('Cantidad' + pos) as HTMLInputElement).value;
    let Costo = (document.getElementById('Costo' + pos) as HTMLInputElement).value;
    let fecha_vencimiento = (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement)
      .value;
    let observaciones = (document.getElementById('Observaciones' + pos) as HTMLInputElement).value;

    this.Lista_Productos[pos].Lote = lote;
    this.Lista_Productos[pos].Cantidad = cantidad;
    this.Lista_Productos[pos].Costo = Costo;
    this.Lista_Productos[pos].Fecha_Vencimiento = fecha_vencimiento;
    this.Lista_Productos[pos].Observaciones = observaciones;
  }

  AnularAjuste() {
    let datos = new FormData();

    datos.append('Id_Ajuste', this.Id_Ajuste);
    datos.append('Motivo_Anulacion', this.ModelAnular.Observacion_Anulacion);
    datos.append('Funcionario', this.userId);

    this.http
      .post(this.globales.ruta + 'php/ajuste_individual_nuevo/anular.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.icon = data.type;
        this.confirmacionSwal.title = data.title;
        this.confirmacionSwal.text = data.text;
        this.swalService.show(this.confirmacionSwal);

        this.modalAnular.hide();

        this.ModelAnular = {
          Funcionario_Anula: this.userId,
          Observacion_Anulacion: '',
        };
      });
  }

  getFechaMaxima() {
    var Fecha_Hoy = new Date();
    var dia = new Date(Fecha_Hoy.setDate(Fecha_Hoy.getDate() + 3650));
    var Fecha_Maxima = dia.toISOString().split('T')[0];
    return Fecha_Maxima;
  }

  getFechaMinimaVenc() {
    var Fecha_Hoy = new Date();
    var dia = new Date(Fecha_Hoy.setDate(Fecha_Hoy.getDate() + 60));
    var Fecha_Maxima = dia.toISOString().split('T')[0];

    return Fecha_Maxima;
  }

  getFechaActualFormateada() {
    var Fecha_Hoy = new Date();
    var fecha_actual = Fecha_Hoy.toISOString().split('T')[0];

    return fecha_actual;
  }

  validarFecha(pos, fecha) {
    if (fecha != '') {
      let fecha_maxima_permitida = this.getFechaMaxima();
      if (fecha > fecha_maxima_permitida) {
        this.confirmacionSwal.title = 'Error!';
        this.confirmacionSwal.text = 'La Fecha de Vencimiento no es permitida.';
        this.confirmacionSwal.icon = 'error';
        this.swalService.show(this.confirmacionSwal);
        (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).value = '';
        (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).focus();
      } else {
        let fecha_minima_venc = this.getFechaMinimaVenc();
        if (fecha <= fecha_minima_venc) {
          this.confirmacionSwal.title = 'Error!';
          this.confirmacionSwal.text = 'La Fecha de Vencimiento debe ser superior a dos meses.';
          this.confirmacionSwal.icon = 'error';
          this.swalService.show(this.confirmacionSwal);
          (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).value = '';
          (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).focus();
        }
      }
    }
  }

  validarFecha2(pos, fecha) {
    if (this.Id_Punto != 3) {
      // ESTA VALIDACIÓN ES TEMPORAL PARA DISPENSAR DESDE EL PUNTO DE PRO-H PRINCIPAL DISPENSACIONES DE MANTIS DEL AÑO 2018 CON PRODUCTOS QUE YA ESTÁN VENCIDOS -- ING. KENDRY 11/12/2019
      if (fecha != '') {
        let fecha_actual = this.getFechaActualFormateada();

        if (fecha < fecha_actual) {
          this.confirmacionSwal.title = 'Error!';
          this.confirmacionSwal.text =
            'La Fecha de Vencimiento debe ser superior a la fecha actual.';
          this.confirmacionSwal.icon = 'error';
          this.swalService.show(this.confirmacionSwal);
          (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).value = '';
          (document.getElementById('Fecha_Vencimiento' + pos) as HTMLInputElement).focus();
        }
      }
    }
  }

  private SetFechaMinimaVencimiento() {
    let Fecha: any = new Date();
    Fecha.setDate(Fecha.getDate() + 1);

    let Fecha_min: any = new Date(Fecha);
    let mes = Fecha_min.getMonth() < 10 ? '0' + Fecha_min.getMonth() : Fecha_min.getMonth();
    let dia = Fecha_min.getDate() < 10 ? '0' + Fecha_min.getDate() : Fecha_min.getDate();
    Fecha_min = Fecha_min.getFullYear() + '-' + mes + '-' + dia;
    this.Fecha_Actual = Fecha_min;
  }

  public ConsultarCodigoBarras(codigoBarras: string) {
    if (codigoBarras != '') {
      let tipo = (document.getElementById('tipo') as HTMLInputElement).value;
      let valor_tipo = (document.getElementById('valor_tipo') as HTMLInputElement).value;

      this.http
        .get(this.globales.ruta + 'php/ajusteindividual/producto_codigo_barras.php', {
          params: {
            codigo: codigoBarras,
            IO: this.TipoAjuste,
            tipo: tipo,
            id: valor_tipo,
          },
        })
        .subscribe((data: any) => {
          (document.getElementById('producto_pistoleado') as HTMLInputElement).value = ''; // Limpio el campo de codigo de barras...

          if (data.codigo == 'success') {
            if (this.TipoAjuste == '1') {
              let producto = {
                Id_Producto: data.query_result.Id_Producto,
                Nombre_Producto: data.query_result.Nombre_Comercial,
                Embalaje: data.query_result.Embalaje,
                Laboratorio_Comercial: data.query_result.Laboratorio_Comercial,
                Lote: '',
                Cantidad_Actual: '',
                Fecha_Vencimiento: '',
                Observaciones: '',
                Costo: data.query_result.Costo,
              };

              this.Lista_Productos.push(producto);
              localStorage.setItem('Lista_Producto', JSON.stringify(this.Lista_Productos));
              setTimeout(() => {
                this.SetFocusPistolear();
              }, 100);
            } else {
              this.Producto_Salida = data.query_result;

              if (this.Producto_Salida.Lotes != '' && this.Producto_Salida.Lotes != undefined) {
                var pos = this.Lista_Productos_Salida.findIndex(
                  (x) => x.Id_Producto == this.Producto_Salida.Id_Producto,
                );
                if (pos >= 0) {
                  this.confirmacionSwal.title = 'Error';
                  this.confirmacionSwal.text = 'Este Producto ya se encuentra en la lista';
                  this.confirmacionSwal.icon = 'error';
                  this.swalService.show(this.confirmacionSwal);
                  this.Producto_Salida = '';
                } else {
                  this.Lotes = this.Producto_Salida.Lotes;
                  this.Nombre = this.Producto_Salida.Nombre;
                  this.modalLotes.show();
                }
              }
            }
          } else {
            this.confirmacionSwal.title = 'No existe';
            this.confirmacionSwal.html =
              'El código de barras ingresado: ' +
              codigoBarras +
              ' no corresponde a ningun de los productos registrados en nuestra Base de Datos';
            this.confirmacionSwal.icon = 'error';
            this.swalService.show(this.confirmacionSwal);
          }
        });
    }
  }

  private SetFocusPistolear() {
    (document.getElementById('producto_pistoleado') as HTMLInputElement).focus();
  }
}
