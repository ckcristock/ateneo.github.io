import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Location, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { MatRadioModule } from '@angular/material/radio';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-rotativocompras',
  templateUrl: './rotativocompras.component.html',
  styleUrls: ['./rotativocompras.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgFor,
    TableComponent,
    MatRadioModule,
    ModalComponent,
    MatInputModule,
    CurrencyPipe,
    DatePipe,
  ],
})
export class RotativocomprasComponent implements OnInit {
  public Lista_Compras: any[];
  public Lista_Producto: any[] = [
    {
      ATC: 'Test',
      Descripcion:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe animi, deserunt incidunt voluptates asperiores adipisci sunt. Praesentium, consequuntur dignissimos suscipit natus facere veritatis perspiciatis ab sequi autem eos dolor tenetur?',
      Producto: 'Test',
      CUM: 'Test',
      Consumida: 'Test',
      Promedio_Tiempo: 'Test',
      CantidadActual: 'Test',
      CantidadCompras: 'Test',
      CantidadTotal: 'Test',
      Desabilitado: true,
      Compras: [],
    },
  ];
  public Bandera = '';
  public cabecera = true;
  public boton = false;
  public Fecha_Inicial = '';
  public Fecha_Final = '';
  public Fecha = new Date();
  public Mes_Compra = 1;
  //variable que deseo enviarle al localstorage
  public temporal = [];
  public Id_Productos = [];
  public Proveedores: any[] = [];
  public compras = true;
  public habilitar = true;
  public Validar: boolean = false;
  public Lista: boolean = false;
  public Cargando = false;
  public Tipo = 'Medicamentos';
  public Tipo_Medicamento = 'Todos';
  public ExcluirVencimientos = 'Si';

  public filtro_nombre = '';
  public filtro_nit = '';
  public Posicion = '';
  public Posicion_Proveedor = '';
  public Funcionario = JSON.parse(localStorage.getItem('User'));
  public alertOption: SweetAlertOptions = {};
  public ClienteEPS = '';

  // Contratos
  public Contratos: any[] = [];
  public prueba = '';
  public Fecha_Fin = '';
  public Fecha_Inicio = '';
  public idcontrato = '';
  public Nombre_Contrato = '';
  public Lista_Producto_Contrato: any[] = [];
  public ClientesContrato: any[] = [];
  selectedItems = [];
  dropdownSettings: any = {};
  ShowFilter = true;
  myForm: FormGroup;

  @ViewChild('modalProveedor') modalProveedor: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('confirmacionSalir') confirmacionSalir: any;

  globales = environment;

  formRange = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private readonly modalService: NgbModal,
  ) {
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a guardar esta Precompra',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.generarPrecompra();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  ngOnInit() {
    this.consultarClientes();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id_Cliente',
      textField: 'Nombre',
      selectAllText: 'Selecciona Todos',
      unSelectAllText: 'Deseleccionar Todos',
      allowSearchFilter: this.ShowFilter,
    };
  }

  onFilterDate(): void {
    const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
    this.Fecha_Inicial = formatDate(this.formRange.value.start as string);
    this.Fecha_Final = formatDate(this.formRange.value.end as string);
  }

  ValidarDias() {
    /* fecha inicio debe ser siempre el 01 de cada mes */
    /* fecha fin debe ser siempre el ultimo dia del mes */
    /* fecha fin no puede ser menor a fecha inicio */
    let FIni = this.Fecha_Inicial;
    let F_Ini = FIni.split('-');

    let FFin = this.Fecha_Final;
    let F_Final = FFin.split('-');

    // if (parseInt(F_Ini[2]) != 1) {
    //   this.confirmacionSwal.title = 'Error en la Fecha';
    //   this.confirmacionSwal.text = 'La Fecha Inicial, debe ser el primer día de un mes';
    //   this.confirmacionSwal.type = 'error';
    //   // this.confirmacionSwal.show();
    //   this.Fecha_Inicial = '';
    // }

    // if (parseInt(F_Final[2]) < 28) {
    //   this.confirmacionSwal.title = 'Error en la Fecha';
    //   this.confirmacionSwal.text = 'La Fecha Final, debe ser el último día de un mes';
    //   this.confirmacionSwal.type = 'error';
    //   // this.confirmacionSwal.show();
    //   this.Fecha_Final = '';
    // }
  }
  consultarContratos(Contratos) {
    if (Contratos === 'Contrato') {
      this.http
        .get(this.globales.ruta + '/php/rotativoscompras/get_contratos.php')
        .subscribe((data: any) => {
          this.Contratos = data.Contratos;
          this.Lista_Producto = [];
          this.Validar = false;
        });
    } else {
      this.Lista_Producto_Contrato = [];
      this.Nombre_Contrato = '';
      this.idcontrato = '';
      this.Validar = false;
    }
  }
  consultarClientes() {
    this.http
      .get(this.globales.ruta + '/php/rotativoscompras/get_clientes_contratos.php')
      .subscribe((data: any) => {
        this.ClientesContrato = data.Clientes;
      });
  }
  // onItemSelect(item: any) {
  //   console.log(item);
  // }
  // onSelectAll(items: any) {
  //   console.log(items);
  // }

  fechasContrato(Contrato) {
    this.http
      .get(this.globales.ruta + '/php/rotativoscompras/get_contratos.php', {
        params: { id: Contrato },
      })
      .subscribe((data: any) => {
        this.Fecha_Fin = data.Contrato[0].Fecha_Fin;
        this.Fecha_Inicio = data.Contrato[0].Fecha_Inicio;
        this.idcontrato = data.Contrato[0].Id_Contrato;
      });
  }
  consultarRemisiones() {
    this.temporal = [];
    var fecha = this.Fecha.toISOString().split('T')[0];
    this.Lista = false;
    if (this.Tipo != 'Contrato') {
      var fechaInicial = this.Fecha_Inicial;
      var fechaFinal = this.Fecha_Final;
    } else {
      fechaInicial = this.Fecha_Inicio;
      fechaFinal = this.Fecha_Fin;
    }
    if (this.Fecha_Inicial > this.Fecha_Final) {
      this.confirmacionSwal.title = 'Error en la Fecha';
      this.confirmacionSwal.text = 'La Fecha de inicio no puede ser mayor a la Fecha Final ';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
      this.Fecha_Inicial = '';
    } else if (this.Fecha_Final > fecha) {
      this.confirmacionSwal.title = 'Error en la Fecha';
      this.confirmacionSwal.text = 'La Fecha de Final no puede ser mayor a la Fecha Actual ';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
      this.Fecha_Final = '';
    } else {
      if (fechaInicial != '' && fechaFinal != '') {
        this.Validar = true;

        let params = {
          inicio: `${fechaInicial}`,
          final: `${fechaFinal}`,
          tiempo: `${this.Mes_Compra}`,
          tipo: `${this.Tipo}`,
          tipo_medicamento: `${this.Tipo_Medicamento}`,
          excluir_vencimientos: `${this.ExcluirVencimientos}`,
          idContrato: `${this.idcontrato}`,
          clienteps: `${this.ClienteEPS}`,
        };

        let queryParams = new HttpParams({ fromObject: params });

        //api para consultar los productos de las remisiones
        this.http
          .get(this.globales.ruta + '/php/rotativoscompras/lista_rotativo_compra.php', {
            params: queryParams,
          })
          .subscribe((data: any) => {
            if (data['type'] == 'error') {
              this.confirmacionSwal.type = data.type;
              this.confirmacionSwal.title = data.title;
              this.confirmacionSwal.text = data.text;
              this.confirmacionSwal.show();
              this.Validar = false;
            } else {
              console.log(data);
              if (data.length == 0) {
                this.Validar = false;
                this.Lista_Producto_Contrato = [];
                this.Nombre_Contrato = '';
              } else {
                if (data[0].Nombre_Contrato || data[0].Nombre_Contrato == '') {
                  this.Lista_Producto_Contrato = data;
                  this.Nombre_Contrato = data[0].Nombre_Contrato;
                  this.boton = true;
                  this.Validar = false;
                  if (this.Lista_Producto_Contrato.length == 0) {
                    this.Lista = true;
                  }
                } else {
                  this.Lista_Producto = data;
                  this.boton = true;
                  this.Validar = false;
                  if (this.Lista_Producto.length == 0) {
                    this.Lista = true;
                  }
                }
              }
            }
          });
      }
    }
  }
  HabilitarCampos(pos) {
    this.Posicion_Proveedor = pos;
    this.Proveedores[pos].Desabilitado = false;
  }
  AgregarProveedor() {
    if (
      this.Proveedores[this.Posicion_Proveedor].Cantidad != '' &&
      this.Proveedores[this.Posicion_Proveedor].Precio != ''
    ) {
      if (this.Lista_Producto[this.Posicion].Compras.length == 1) {
        this.Lista_Producto[this.Posicion].Compras = [];
      }
      this.Lista_Producto[this.Posicion].Compras.push({
        Codigo: 'Pendiente',
        Fecha: new Date(),
        NombreProveedor: this.Proveedores[this.Posicion_Proveedor].Nombre,
        Cantidad: this.Proveedores[this.Posicion_Proveedor].Cantidad,
        Total: this.Proveedores[this.Posicion_Proveedor].Precio,
        Id_Proveedor: this.Proveedores[this.Posicion_Proveedor].Id_Proveedor,
        DivMensaje: false,
        nombre: '',
        DivEncabezado: '1',
        Id_Producto: this.Lista_Producto[this.Posicion].Id_Producto,
      });

      this.modalService.dismissAll();
      this.Lista_Producto[this.Posicion].Desabilitado = false;
    }
  }
  AgregarProveedorContrato() {
    if (
      this.Proveedores[this.Posicion_Proveedor].Cantidad != '' &&
      this.Proveedores[this.Posicion_Proveedor].Precio != ''
    ) {
      if (this.Lista_Producto_Contrato[this.Posicion].Compras.length == 1) {
        this.Lista_Producto_Contrato[this.Posicion].Compras = [];
      }
      this.Lista_Producto_Contrato[this.Posicion].Compras.push({
        Codigo: 'Pendiente',
        Fecha: new Date(),
        NombreProveedor: this.Proveedores[this.Posicion_Proveedor].Nombre,
        Cantidad: this.Proveedores[this.Posicion_Proveedor].Cantidad,
        Total: this.Proveedores[this.Posicion_Proveedor].Precio,
        Id_Proveedor: this.Proveedores[this.Posicion_Proveedor].Id_Proveedor,
        DivMensaje: false,
        nombre: '',
        DivEncabezado: '1',
        Id_Producto: this.Lista_Producto_Contrato[this.Posicion].Id_Producto,
      });

      this.modalService.dismissAll();
      this.Lista_Producto_Contrato[this.Posicion].Desabilitado = false;
    }
  }
  searchProduct(pos) {
    this.Posicion = pos;
    this.Proveedores = [];
    this.filtro_nit = '';
    this.filtro_nombre = '';
    this.modalService.open(this.modalProveedor, { size: 'lg' });
    // console.log(this.Lista_Producto[pos].Compras);
  }
  filtros() {
    let params: any = {};
    if (this.filtro_nit != '' || this.filtro_nombre != '') {
      if (this.filtro_nit != '') {
        params.nit = this.filtro_nit;
      }
      if (this.filtro_nombre != '') {
        params.nombre = this.filtro_nombre;
      }
      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.http
        .get(this.globales.ruta + '/php/rotativoscompras/proveedor_buscar.php?' + queryString)
        .subscribe((data: any) => {
          this.Cargando = false;
          this.Proveedores = data;
        });
    }
  }
  buscar(event) {
    if ((event.keyCode === 13 || event.keyCode === 120) && !event.shiftKey) {
      this.filtros();
    }
  }
  titulo(valor) {
    if (valor != this.Bandera) {
      this.Bandera = valor;
      this.cabecera = true;
      return true;
    } else {
      this.cabecera = false;
      return false;
    }
  }
  showAlert(evt: any) {
    // this.confirmacionGuardar.show();
  }
  seleccionarCompra(i, j) {
    //// console.log(this.Lista_Producto[i]);

    var idProveedor = this.Lista_Producto[i].Compras[j].Id_Proveedor;
    var laboratorio = this.Lista_Producto[i].Compras[j].NombreProveedor;
    var idProducto = this.Lista_Producto[i].Compras[j].Id_Producto;
    var cantidad = this.Lista_Producto[i].CantidadTotal;
    var total = this.Lista_Producto[i].Compras[j].Total;
    var Cantidad_Minima = this.Lista_Producto[i].Compras[j].Cantidad_Minima;
    var Cantidad_Maxima = this.Lista_Producto[i].Compras[j].Cantidad_Maxima;
    var nombre = this.Lista_Producto[i].Compras[j].nombre;

    // pregunto si la longitud es mayor que 0
    if (this.temporal.length > 0) {
      const id = this.temporal.findIndex((lista) => lista.Posicion === i);
      if (id >= 0) {
        const id_producto = this.temporal[id].Productos.findIndex(
          (X) => X.Id_Producto === idProducto,
        );
        if (this.temporal[id].Id_Proveedor != idProveedor) {
          this.temporal[id].Productos.splice(id_producto, 1);
          if (this.temporal[id].Productos.length == 0) {
            this.temporal.splice(id, 1);
          }
        }
      }
      setTimeout(() => {
        const index = this.temporal.findIndex((lista) => lista.Id_Proveedor === idProveedor);
        if (index >= 0) {
          const pos = this.temporal[index].Productos.length;
          const id_producto = this.temporal[index].Productos.findIndex(
            (X) => X.Id_Producto === idProducto,
          );
          if (id_producto >= 0) {
            this.temporal[index].Posicion = i;
            this.temporal[index].Productos[id_producto] = {
              Id_Producto: idProducto,
              Cantidad: cantidad,
              Costo: total,
            };
          } else {
            this.temporal[index].Posicion = i;
            this.temporal[index].Productos[pos] = {
              Id_Producto: idProducto,
              Cantidad: cantidad,
              Costo: total,
            };
          }
        } else {
          this.temporal.push({
            Id_Proveedor: idProveedor,
            Posicion: i,
            Productos: [
              {
                Id_Producto: idProducto,
                Cantidad: cantidad,
                Costo: total,
              },
            ],
          });
        }
      }, 500);
    } else {
      // creo la primera posicion
      this.temporal.push({
        Id_Proveedor: idProveedor,
        Posicion: i,
        Productos: [
          {
            Id_Producto: idProducto,
            Cantidad: cantidad,
            Costo: total,
          },
        ],
      });
    }
    console.log(this.temporal);
  }
  seleccionarCompraContrato(i, j) {
    //// console.log(this.Lista_Producto[i]);

    var idProveedor = this.Lista_Producto_Contrato[i].Compras[j].Id_Proveedor;
    var laboratorio = this.Lista_Producto_Contrato[i].Compras[j].NombreProveedor;
    var idProducto = this.Lista_Producto_Contrato[i].Compras[j].Id_Producto;
    var cantidad = this.Lista_Producto_Contrato[i].CantidadTotal;
    var total = this.Lista_Producto_Contrato[i].Compras[j].Total;
    var Cantidad_Minima = this.Lista_Producto_Contrato[i].Compras[j].Cantidad_Minima;
    var Cantidad_Maxima = this.Lista_Producto_Contrato[i].Compras[j].Cantidad_Maxima;
    var nombre = this.Lista_Producto_Contrato[i].Compras[j].nombre;

    // pregunto si la longitud es mayor que 0
    if (this.temporal.length > 0) {
      const id = this.temporal.findIndex((lista) => lista.Posicion === i);
      if (id >= 0) {
        const id_producto = this.temporal[id].Productos.findIndex(
          (X) => X.Id_Producto === idProducto,
        );
        if (this.temporal[id].Id_Proveedor != idProveedor) {
          this.temporal[id].Productos.splice(id_producto, 1);
          if (this.temporal[id].Productos.length == 0) {
            this.temporal.splice(id, 1);
          }
        }
      }
      setTimeout(() => {
        const index = this.temporal.findIndex((lista) => lista.Id_Proveedor === idProveedor);
        if (index >= 0) {
          const pos = this.temporal[index].Productos.length;
          const id_producto = this.temporal[index].Productos.findIndex(
            (X) => X.Id_Producto === idProducto,
          );
          if (id_producto >= 0) {
            this.temporal[index].Posicion = i;
            this.temporal[index].Productos[id_producto] = {
              Id_Producto: idProducto,
              Cantidad: cantidad,
              Costo: total,
            };
          } else {
            this.temporal[index].Posicion = i;
            this.temporal[index].Productos[pos] = {
              Id_Producto: idProducto,
              Cantidad: cantidad,
              Costo: total,
            };
          }
        } else {
          this.temporal.push({
            Id_Proveedor: idProveedor,
            Posicion: i,
            Productos: [
              {
                Id_Producto: idProducto,
                Cantidad: cantidad,
                Costo: total,
              },
            ],
          });
        }
      }, 500);
    } else {
      // creo la primera posicion
      this.temporal.push({
        Id_Proveedor: idProveedor,
        Posicion: i,
        Productos: [
          {
            Id_Producto: idProducto,
            Cantidad: cantidad,
            Costo: total,
          },
        ],
      });
    }
    console.log(this.temporal);
  }
  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunnccN',
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
  generarPrecompra() {
    console.log('clientes seleccionados');
    console.log(this.ClientesContrato);

    if (this.temporal.length > 0) {
      let productos = this.normalize(JSON.stringify(this.temporal));
      // let clientes=this.normalize(JSON.stringify(this.ClientesContrato))
      let datos = new FormData();
      let info: any = {};

      info.Tipo = this.Tipo;
      info.Tipo_Medicamento = this.Tipo_Medicamento;
      info.ExcluirVencimientos = this.ExcluirVencimientos;
      info.Fecha_Inicial = this.Fecha_Inicial;
      info.Fecha_Final = this.Fecha_Final;
      info.Meses = this.Mes_Compra;
      info.Id_Contrato = this.idcontrato;

      datos.append('Funcionario', this.Funcionario.Identificacion_Funcionario);
      datos.append('Datos', JSON.stringify(info));
      datos.append('Clientes', JSON.stringify(this.ClientesContrato));
      datos.append('Productos', productos);

      this.http
        .post(this.globales.ruta + 'php/rotativoscompras/guardar_rotativo_compra.php', datos)
        .subscribe(
          (data: any) => {
            this.confirmacionSalir.title = 'Precompra Guardada';
            this.confirmacionSalir.html = data.Texto;
            this.confirmacionSalir.type = data.Tipo;
            this.confirmacionSalir.show();
          },
          (error) => {
            this.confirmacionSwal.title = 'Error';
            this.confirmacionSwal.text = 'Ha ocurrido un error inesperado de conexión.';
            this.confirmacionSwal.type = 'error';
            this.confirmacionSwal.show();
          },
        );
    } else {
      this.confirmacionSalir.title = 'Error en la Selección';
      this.confirmacionSalir.html =
        'Por favor seleccione al menos un producto para generar la Precompra';
      this.confirmacionSalir.type = 'warning';
      this.confirmacionSalir.show();
    }
  }
  VerPantallaLista() {
    this.router.navigate(['comprasnacionales']);
  }
  validarLista() {
    if (this.Lista_Producto == undefined) {
      return false;
    } else {
      return true;
    }
  }
  save() {}
  exportexcel(): void {
    this.Lista_Producto_Contrato.length;
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    // const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    // XLSX.writeFile(wb, 'RotativoCompra.xlsx');
  }
}
