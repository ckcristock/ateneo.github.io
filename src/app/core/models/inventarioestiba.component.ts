import { Component, OnInit, ViewChild, Input } from '@angular/core';
import swal, { SweetAlertOptions } from 'sweetalert2';

import { Router, ActivatedRoute } from '@angular/router';
import { InventarioFisicoModel } from './InventarioFisicoModel';
import { GeneralService } from 'src/app/services/general.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ToastService } from '../services/toast.service';
import { InventariofisicoService } from '../services/inventariofisico.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventarioestiba',
  template: '',
  standalone: true,
  styles: '',
})
export class InventarioestibaComponent implements OnInit {
  public InventarioFisicoModel: InventarioFisicoModel = new InventarioFisicoModel();
  public DatosEncabezado: any = {};
  public Funcionario_Digita: any = {};
  public Funcionario_Cuenta: any = {};
  public Model: any = {
    Estiba: {
      Nombre: '',
    },
    Bodega: {
      Nombre: '',
    },
  };
  public Productos: any = [];
  public Cargado = false;
  public Editar = false;
  public DatosCabecera: any = {
    Titulo: 'Inventario Fisico Estibas',
    Fecha: new Date(),
    Codigo: '',
  };

  public RutaPrincipal: string = environment.base_url;

  public Producto_Barras: any = {};
  public Cargando: boolean = false;
  public Codigo_Barras = '';
  public Fecha_Hoy = new Date();
  public alertOption1: SweetAlertOptions = {};
  public alertOption2: SweetAlertOptions = {};
  public alertOption3: SweetAlertOptions = {};
  public alertOptionGuardarSalir: SweetAlertOptions = {};
  @ViewChild('confirmacionGuardar1') confirmacionGuardar1;
  @ViewChild('respuestaGuardarOk') respuestaGuardarOk;
  @ViewChild('respuestaGuardarError') respuestaGuardarError;
  @ViewChild('respuesTrabajando') respuesTrabajando;

  public idInventarioParams;

  /** las dos pociones validas en la db */
  GuardarSalirTipo = 'Pendiente Primer Conteo';
  GuardarTerminarTipo = 'Primer Conteo';

  constructor(
    private _generalService: GeneralService,
    private _swalService: SwalService,
    private _toastService: ToastService,
    private inventariofisico: InventariofisicoService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.alertOption1 = {
      title: '¿Está Seguro?',
      text: 'Se dispone a ingresar lotes del Producto al primer conteo',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      color: 'success',
      preConfirm: () => {
        this.GuardaLotes();
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
    this.alertOption2 = {
      title: '¿Está Seguro?',
      text: 'Se dispone a terminar el inventario',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      color: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.AjustarInventario();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
    this.alertOption3 = {
      title: 'Advertencia!',
      text: 'Ya existe una persona haciendo este inventario',
      showCancelButton: false,
      confirmButtonText: 'Salir',
      color: 'info',
      allowEscapeKey: false,
      allowEnterKey: false,
      allowOutsideClick: false,

      preConfirm: () => {
        return new Promise((resolve) => {
          this.router.navigate(['/listadoinventarios']);
        });
      },
    };
    this.alertOptionGuardarSalir = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Guardar y salir del inventario',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar y Salir',
      showLoaderOnConfirm: true,
      focusCancel: true,
      color: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.guardarGeneral(this.GuardarSalirTipo);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  async ngOnInit() {
    let param: any = {};
    param.Id_Doc_Inventario_Fisico = this.route.snapshot.params['idInventarioEstiba'];

    this.inventariofisico.GetInventario(param).subscribe(async (res) => {
      if (res.Tipo == 'success') {
        //verificamos que el inventario no lo estén trabajando previamente
        if (res.Data.Estado != 'Pendiente Primer Conteo') {
          console.log(res.Data.Estado);

          this.respuesTrabajando.show();
        } else {
          //actualizamos el estado del inventario para que nadie pueda trabajar en él
          let datos = new FormData();
          datos.append('Id_Doc_Inventario_Fisico', param.Id_Doc_Inventario_Fisico);
          datos.append('tipo_accion', 'Haciendo Primer Conteo');
          await this.inventariofisico.GestionarEstado(datos).toPromise();

          this.Model = res.Data;

          this.Model.Estado = 'Haciendo Primer Conteo';
          this.Funcionario_Cuenta = this.Model.Funcionario_Cuenta;
          this.Funcionario_Digita = this.Model.Funcionario_Digita;
        }

        if (this.Model.Productos.length > 0) {
          this.Productos = JSON.parse(this.Model.Productos);
          let swal = {
            codigo: 'success',
            titulo: 'Continuamos',
            html: 'Continuamos con el Inventario<br> ¡Muchos Exitos!',
          };
          this._swalService.ShowMessage(swal);
        }
      }
    });
  }

  ConsultaCodigo(codigo) {
    this.Cargando = true;

    let params: any = {};
    params.Codigo = codigo;
    params.Id_Estiba = this.Model.Estiba.Id_Estiba;
    this.Codigo_Barras = '';

    let resultado = this.Productos.find((lote) => lote.Codigo_Barras === codigo);
    console.log(resultado, 'resultado');
    if (!resultado) {
      this.inventariofisico.GetProductoEstiba(params).subscribe((data: any) => {
        if (data.Tipo == 'success') {
          this.Producto_Barras = data.Datos;
          this.Producto_Barras['Lotes'].push({
            Codigo: 'Ingresa uno Nuevo ->',
            Id_Inventario_Nuevo: 0,
            Id_Producto: data.Datos.Id_Producto,
            Lote: '',
            Fecha_Vencimiento: '',
            Cantidad: 0,
            Cantidad_Final: 0,
            Cantidad_Encontrada: '',
          });
          this.Cargado = true;
          console.log(this.Producto_Barras);
        } else {
          let swal = {
            codigo: data.Tipo,
            titulo: data.Titulo,
            html: data.Texto,
            mensaje: '',
          };
          this._swalService.ShowMessage(swal);
        }
        this.Cargando = false;
      });
    } else {
      this.Cargando = false;
      let swal = {
        codigo: 'error',
        titulo: 'ERROR',
        mensaje: 'El Producto fué previamente Inventariado, Por Favor intente con Otro',
      };
      this._swalService.ShowMessage(swal);
    }
  }

  ValidarLote(pos) {
    if (this.Producto_Barras['Lotes'][pos].Lote.length < 4) {
      this._swalService.error(
        'Error en lote',
        'La longitud del lote debe ser mayor o igual a tres letras',
      );
      this.Producto_Barras['Lotes'][pos].Lote = '';
      this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento = '';
      this.Producto_Barras['Lotes'][pos].Cantidad_Encontrada = '';
    } else {
      this.Producto_Barras['Lotes'][pos].Lote = this.Producto_Barras['Lotes'][pos].Lote.trim();
      this.Producto_Barras['Lotes'][pos].Lote =
        this.Producto_Barras['Lotes'][pos].Lote.toUpperCase();

      document.getElementById('Vencimiento' + pos).focus();
    }
  }
  VerificarSiExisteEnFila(pos) {
    //verificamos antes de agregar a la fila si existe un lote agregado al mismo producto

    //si solo hay un lote quiere decir que es el de insertar, entonces no es necesario hacer la verificación
    if (this.Producto_Barras['Lotes'].length > 1) {
      //recorremos los lotes menos el último que es el de insertar buscando coincidencias si la encuentra mande un mensaje de error!
      for (let index = 0; index < this.Producto_Barras['Lotes'].length - 1; index++) {
        if (
          this.Producto_Barras['Lotes'][pos].Lote == this.Producto_Barras['Lotes'][index].Lote &&
          pos != index
        ) {
          console.log('encontre coincidencias', this.Producto_Barras['Lotes'][index].Lote);
          let swal = {
            codigo: 'error',
            titulo: 'Error en referencia del Lote',
            mensaje: 'Existe un Lote del mismo producto agregado , Por Favor Revise ',
          };

          this.Producto_Barras['Lotes'][pos].Lote = '';
          this.Producto_Barras['Lotes'][pos].Cantidad_Encontrada = '';
          this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento = '';
          this._swalService.ShowMessage(swal);
          document.getElementById('Lote' + pos).focus();
          return false;
        }
      }
    }
    //si no encotró coincidencia agregue a la fila
    this.AgregaFila(pos);
  }

  AgregaFila(pos) {
    if (this.Producto_Barras['Lotes'][pos + 1] == undefined) {
      this.Producto_Barras['Lotes'].push({
        Codigo: 'Ingresa uno Nuevo ->',
        Id_Inventario_Nuevo: 0,
        Id_Producto: this.Producto_Barras.Id_Producto,
        Lote: '',
        Fecha_Vencimiento: '',
        Cantidad: 0,
        Cantidad_Final: '',
        Cantidad_Encontrada: '',
      });
    }
  }
  ValidarFecha(pos) {
    this.Fecha_Hoy = new Date();
    var dia = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() - 365));
    var fecha_limite = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() + 3650));
    //Fecha Inferior es un(1) año menos que la actual
    var Fecha_Inferior = dia.toISOString().split('T')[0];
    //Fecha Superior son (10) años mas que la actual
    var Fecha_Superior = fecha_limite.toISOString().split('T')[0];

    //la fecha de vencimiento no puede ser menor a un año ni tamoco puede ser mayor que 10 años, si pasa eso genere un error
    if (
      this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento < Fecha_Inferior ||
      this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento > Fecha_Superior
    ) {
      this._swalService.error(
        'Error en la fecha de vencimiento',
        'Hay un error en la fecha de vencimiento, por favor revisa.',
      );
      this.Producto_Barras['Lotes'][pos]['Fecha_Vencimiento'] = '';
      this.Producto_Barras['Lotes'][pos]['Cantidad_Encontrada'] = '';
      this.Producto_Barras['Lotes'][pos]['Lote'] = '';
    } else {
      //en caso contrario enfoque el siguiente campo para ser rellenado
      document.getElementById('Cantidad' + pos).focus();
    }
  }

  ValidarCantidad(pos) {
    //si en la lista de Lotes solo existe uno (el de ingresar nuevo ) no deja guardar lotes, debe ser agregado previamente a la lista pasando todas las validaciones
    if (
      this.Producto_Barras['Lotes'][pos].Codigo == 'Ingresa uno Nuevo ->' &&
      this.Producto_Barras['Lotes'][pos].Cantidad_Encontrada == 0
    ) {
      console.log('es uno nuevo', this.Producto_Barras['Lotes'][pos]);
      let swal = {
        codigo: 'error',
        titulo: 'Hay un error  ',
        mensaje: 'Los lotes nuevos deben ser mayor a 0, Por favor revise',
      };
      this._swalService.ShowMessage(swal);

      return false;
    }
    //antes de pasar a agregar a fila y guardar debemos verificar si todos los campos anteriores no están vacios
    let cantidad = this.Producto_Barras['Lotes'][pos].Cantidad_Encontrada.toString();
    if (
      cantidad == '' ||
      this.Producto_Barras['Lotes'][pos].Fecha_Vencimiento == '' ||
      this.Producto_Barras['Lotes'][pos].Lote == ''
    ) {
      let swal = {
        codigo: 'error',
        titulo: 'Hay un error  ',
        mensaje: 'Debe agregar todos los campos , por favor revise ',
      };
      this._swalService.ShowMessage(swal);
      return false;
    }
    //si todo sale bien verifica si exite en la fila previamente
    this.VerificarSiExisteEnFila(pos);
  }

  guardarvalidado() {
    //validar si existen lotes incompletos para que no guarden vacios

    for (let producto = 0; producto < this.Producto_Barras['Lotes'].length - 1; producto++) {
      if (
        this.Producto_Barras['Lotes'][producto]['Lote'] == '' ||
        this.Producto_Barras['Lotes'][producto]['Fecha_Vencimiento'] == ''
      ) {
        let swal = {
          codigo: 'error',
          titulo: 'Existe un error  ',
          mensaje: 'Existen lotes con campos incompletos, por favor revise',
        };
        this._swalService.ShowMessage(swal);

        return false;
      }

      if (this.Producto_Barras['Lotes'][producto]['Codigo'] != '') {
        if (this.Producto_Barras['Lotes'][producto]['Cantidad_Encontrada'] <= 0) {
          {
            let swal = {
              codigo: 'error',
              titulo: 'Existe un error  ',
              mensaje: 'Las cantidades no son correctas por favor revise',
            };
            this._swalService.ShowMessage(swal);

            return false;
          }
        }
      }

      if (
        this.Producto_Barras['Lotes'][producto]['Cantidad_Encontrada'] === '' ||
        isNaN(this.Producto_Barras['Lotes'][producto]['Cantidad_Encontrada'])
      ) {
        {
          let swal = {
            codigo: 'error',
            titulo: 'Existe un error  ',
            mensaje: 'La cantidad encontrada no puede estar vacía',
          };
          this._swalService.ShowMessage(swal);

          return false;
        }
      }
    }

    if (this.Producto_Barras['Lotes'].length <= 1) {
      let swal = {
        codigo: 'error',
        titulo: 'Hay un error  ',
        mensaje: 'Debe agregar un lote para poder guardar , por favor revise ',
      };
      this._swalService.ShowMessage(swal);
    } else {
      //limpiamos el ultimo dato para que ingrese limpio
      console.log(
        this.Producto_Barras['Lotes'][this.Producto_Barras['Lotes'].length - 1],
        ' cantidad ',
      );
      let ultimo = this.Producto_Barras['Lotes'].length - 1;
      console.log('ultimo', ultimo);

      this.Producto_Barras['Lotes'][ultimo].Cantidad_Encontrada = '';
      this.Producto_Barras['Lotes'][ultimo].Lote = '';
      this.Producto_Barras['Lotes'][ultimo].Fecha_Vencimiento = '';

      this.confirmacionGuardar1.show();
    }
  }

  GuardaLotes() {
    this.Productos.push(this.Producto_Barras);
    this.Producto_Barras = [];
    let productos = this._generalService.normalize(JSON.stringify(this.Productos));

    let datos = new FormData();
    datos.append('Id_Doc_Inventario_Fisico', this.Model['Id_Doc_Inventario_Fisico']);
    datos.append('Productos', productos);

    this.inventariofisico.SaveLoteEstiba(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this._swalService.ShowMessage(data);
        this.Cargado = false;
      } else {
        this._swalService.ShowMessage(data);
      }
    });
  }
  editLote(pos, pos2) {
    this.Productos[pos].Lotes[pos2].AgregarLote = 'block';
    this.Editar = true;
  }
  addLote(pos, pos2) {
    //el último lote agregado le cambiamos su propiedad a none para que no sea editable
    this.Productos[pos].Lotes[pos2].AgregarLote = 'none';
    if (!this.Editar) {
      let fila = {
        Codigo: 'Ingresa uno Nuevo ->',
        Lote: '',
        Fecha_Vencimiento: '',
        Cantidad_Encontrada: '',
        Cantidad_Inventario: 0,
        Id_Inventario_Nuevo: 0,
        AgregarLote: 'none',
        Id_Producto: this.Productos[pos].Id_Producto,
      };

      this.Productos[pos].Lotes.push(fila);
      this.reGuardarLotes();
    } else {
      this.Editar = false;
    }
  }
  mostrarUltimo(producto) {
    this.Productos[producto].Lotes[this.Productos[producto].Lotes.length - 1].AgregarLote = 'block';
  }

  verModelos(pos, pos2) {
    console.log(pos, pos2);

    console.log(this.Productos[pos].Lotes[pos2]);

    console.log(
      'cantidad encontrada',
      this.Productos[pos].Lotes[pos2].Cantidad_Encontrada,
      'Lote:',
      this.Productos[pos].Lotes[pos2].Lote,
      'Fecha V',
      this.Productos[pos].Lotes[pos2].Fecha_Vencimiento,
    );
    if (
      (this.Productos[pos].Lotes[pos2].Lote == '' ||
        this.Productos[pos].Lotes[pos2].Fecha_Vencimiento == '' ||
        this.Productos[pos].Lotes[pos2].Cantidad_Encontrada == '',
      this.Productos[pos].Lotes[pos2].Cantidad_Encontrada == undefined,
      this.Productos[pos].Lotes[pos2].Cantidad_Encontrada == null)
    ) {
      console.log('datos erroneos');
      return false;
    }

    if (
      this.Productos[pos].Lotes[pos2].Lote != '' &&
      this.Productos[pos].Lotes[pos2].Fecha_Vencimiento != '' &&
      this.Productos[pos].Lotes[pos2].Cantidad_Encontrada >= 0
    ) {
      this.Productos[pos].Lotes[pos2].AgregarLote = 'none';
      console.log('entró');
      return false;
      //this.Productos[pos].Lotes[pos2].EditLote = false;
    }
  }

  reValidarFecha(producto, lote) {
    console.log(this.Productos[producto].Lotes[lote], 'revalidar fecha');

    this.Fecha_Hoy = new Date();
    var dia = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() - 365));
    var fecha_limite = new Date(this.Fecha_Hoy.setDate(this.Fecha_Hoy.getDate() + 3650));
    //Fecha Inferior es un(1) año menos que la actual
    var Fecha_Inferior = dia.toISOString().split('T')[0];
    //Fecha Superior son (10) años mas que la actual
    var Fecha_Superior = fecha_limite.toISOString().split('T')[0];

    //la fecha de vencimiento no puede ser menor a un año ni tamoco puede ser mayor que 10 años, si pasa eso genere un error
    if (
      this.Productos[producto].Lotes[lote].Fecha_Vencimiento < Fecha_Inferior ||
      this.Productos[producto].Lotes[lote].Fecha_Vencimiento > Fecha_Superior
    ) {
      let swal = {
        codigo: 'error',
        titulo: 'Error en la Fecha de Vencimiento ',
        mensaje: 'Hay un error en la fecha de la Vencimiento, Por Favor Revise ',
      };
      this._swalService.ShowMessage(swal);
      this.Producto_Barras[producto][lote].Fecha_Vencimiento = '';
    } else {
      //en caso contrario enfoque el siguiente campo para ser rellenado
      console.log('fecha esta ok');

      //document.getElementById("Cantidad"+pos).focus();
    }
  }

  reValidarLote(producto, lote) {
    console.log(this.Productos[producto].Lotes[lote], 'revalidar lote');

    if (this.Productos[producto].Lotes[lote].Lote.length < 4) {
      this._swalService.error(
        'Error en lote',
        'La longitud del lote debe ser mayor o igual a tres letras',
      );
      this.Productos[producto].Lotes[lote].Lote = '';
    } else {
      this.Productos[producto].Lotes[lote].Lote = this.Productos[producto].Lotes[lote].Lote.trim();
      this.Productos[producto].Lotes[lote].Lote =
        this.Productos[producto].Lotes[lote].Lote.toUpperCase();
      console.log('Lote ok');

      return false;
    }
  }
  reValidarCantidad(producto, lote) {
    console.log(this.Productos[producto].Lotes[lote], 'revalidar cantiadad');
    //si en la lista de Lotes solo existe uno (el de ingresar nuevo ) no deja guardar lotes, debe ser agregado previamente a la lista pasando todas las validaciones
    if (
      this.Productos[producto].Lotes[lote].Codigo == 'Ingresa uno Nuevo ->' &&
      this.Productos[producto].Lotes[lote].Cantidad_Encontrada == 0
    ) {
      console.log('es uno nuevo', this.Productos[producto].Lotes[lote]);
      let swal = {
        codigo: 'error',
        titulo: 'Hay un error  ',
        mensaje: 'Los lotes nuevos deben ser mayor a 0, Por favor revise',
      };
      this._swalService.ShowMessage(swal);

      return false;
    }
    //antes de pasar a agregar a fila y guardar debemos verificar si todos los campos anteriores no están vacios
    let cantidad = this.Productos[producto].Lotes[lote].Cantidad_Encontrada.toString();
    if (
      cantidad == '' ||
      this.Productos[producto].Lotes[lote].Fecha_Vencimiento == '' ||
      this.Productos[producto].Lotes[lote].Lote == ''
    ) {
      let swal = {
        codigo: 'error',
        titulo: 'Hay un error  ',
        mensaje: 'Debe agregar todos los campos , por favor revise ',
      };
      this._swalService.ShowMessage(swal);
      return false;
    }
    //si todo sale bien verifica si exite en la fila previamente
    console.log(' cantidad correcta');

    this.reVerificarSiExisteEnFila(producto, lote);
  }

  reVerificarSiExisteEnFila(producto, lote) {
    //verificamos antes de agregar a la fila si existe un lote agregado al mismo producto

    //si solo hay un lote quiere decir que es el de insertar, entonces no es necesario hacer la verificación
    if (this.Productos[producto].Lotes.length > 1) {
      //recorremos los lotes menos el último que es el de insertar buscando coincidencias si la encuentra mande un mensaje de error!
      for (let index = 0; index < this.Productos[producto].Lotes.length - 1; index++) {
        //SI el producto con el lote correspondiente es
        if (
          this.Productos[producto].Lotes[lote].Lote == this.Productos[producto].Lotes[index].Lote &&
          this.Productos[producto].Lotes[lote] != this.Productos[producto].Lotes[index]
        ) {
          this.Productos[producto].Lotes[lote].Lote = '';
          this.Productos[producto].Lotes[lote].Fecha_Vencimiento = '';
          this.Productos[producto].Lotes[lote].Cantidad_Encontrada = '';
          console.log('encontre coincidencias', this.Productos[producto].Lotes[index].Lote);
          let swal = {
            codigo: 'error',
            titulo: 'Error en referencia del Lote',
            mensaje: 'Existe un Lote del mismo producto agregado , Por Favor Revise ',
          };
          this._swalService.ShowMessage(swal);
          return false;
        }
      }
    }
    //si no encotró coincidencia agregue a la fila

    this.addLote(producto, lote);
  }

  reGuardarLotes() {
    let productos = JSON.stringify(this.Productos);
    let datos = new FormData();
    datos.append('Id_Doc_Inventario_Fisico', this.Model['Id_Doc_Inventario_Fisico']);
    datos.append('Productos', productos);
    console.log(datos, 'prueba datos');
    this.inventariofisico.saveLote(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this._swalService.ShowMessage(data);
        this.Cargado = false;
        // localStorage.setItem("ProductosInventario", this._generalService.normalize(JSON.stringify(this.Productos)));
      } else {
        this._swalService.ShowMessage(data);
      }
    });
  }

  AjustarInventario() {
    for (let producto = 0; producto < this.Productos.length; producto++) {
      for (let lote = 0; lote < this.Productos[producto]['Lotes'].length; lote++) {
        if (this.Productos[producto]['Lotes'][lote]['AgregarLote'] == 'block') {
          let swal = {
            codigo: 'error',
            titulo: 'Error Lotes editables',
            mensaje: 'Existen lotes en edición y deben ser agregados, Por Favor Revise ',
          };
          this._swalService.ShowMessage(swal);
          return false;
        }
      }
    }

    let productos = this._generalService.normalize(JSON.stringify(this.Productos));
    let datos = new FormData();
    datos.append('Id_Doc_Inventario_Fisico', this.Model['Id_Doc_Inventario_Fisico']);
    datos.append('productos', productos);

    this.inventariofisico.AjustarInventarioEstiba(datos).subscribe((data: any) => {
      if (data.tipo == 'success') {
        this.respuestaGuardarOk.title = data.titulo;
        this.respuestaGuardarOk.text = data.mensaje;
        this.respuestaGuardarOk.type = 'success';
        this.respuestaGuardarOk.show();
      } else {
        this.respuestaGuardarError.title = data.titulo;
        this.respuestaGuardarError.text = data.mensaje;
        this.respuestaGuardarError.type = 'error';
        this.respuestaGuardarError.show();
      }

      // let swal = {
      //   codigo: data.tipo,
      //   titulo: data.titulo,
      //   mensaje: data.mensaje
      // };
      // this._swalService.ShowMessage(swal);

      // this.Productos = [];
      // this.router.navigate(['/listadoinventarios']);
    });
  }

  guardarGeneral(tipo_accion) {
    for (let producto = 0; producto < this.Productos.length; producto++) {
      for (let lote = 0; lote < this.Productos[producto]['Lotes'].length; lote++) {
        if (this.Productos[producto]['Lotes'][lote]['AgregarLote'] == 'block') {
          let swal = {
            codigo: 'error',
            titulo: 'Error Lotes editables',
            mensaje: 'Existen lotes en edición y deben ser agregados, Por Favor Revise ',
          };
          this._swalService.ShowMessage(swal);
          return false;
        }
      }
    }

    let datos = new FormData();

    datos.append('Id_Doc_Inventario_Fisico', this.Model['Id_Doc_Inventario_Fisico']);
    datos.append('tipo_accion', tipo_accion);
    this.inventariofisico.GestionarEstado(datos).subscribe((data: any) => {
      if (data.tipo == 'success') {
        this.respuestaGuardarOk.title = data.titulo;
        this.respuestaGuardarOk.text = data.mensaje;
        this.respuestaGuardarOk.type = 'success';

        this.respuestaGuardarOk.show();
      } else {
        this.respuestaGuardarError.title = data.titulo;
        this.respuestaGuardarError.text = data.mensaje;
        this.respuestaGuardarError.type = 'error';
        this.respuestaGuardarError.show();
      }
    });
  }

  actualizarProductos() {}
}
