import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { skipContentType } from 'src/app/http.context';
import { ListadoproductosyainventariadosestibaComponent } from '../listadoproductosyainventariadosestiba/listadoproductosyainventariadosestiba.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { CabeceraComponent } from '../../../../components/cabecera/cabecera.component';
import { TableComponent } from '@app/shared/components/standard-components/table/table.component';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';
import { CategoriasService } from '@app/pages/ajustes/informacion-base/empresas/company-configuration/components/categorias/categorias.service';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { ConsecutivosService } from '@app/pages/ajustes/configuracion/consecutivos/consecutivos.service';

@Component({
  selector: 'app-inventario-estibas',
  templateUrl: './inventario-estibas.component.html',
  styleUrls: ['./inventario-estibas.component.scss'],
  standalone: true,
  imports: [
    CabeceraComponent,
    NgIf,
    FormsModule,
    NgFor,
    ListadoproductosyainventariadosestibaComponent,
    TableComponent,
    NotDataSaComponent,
    LoadImageComponent,
  ],
})
export class InventarioEstibasComponent implements OnInit {
  //public InventarioFisicoModel: InventarioFisicoModel = new InventarioFisicoModel();
  public DatosEncabezado: any = {};
  public Funcionario_Digita: any = {};
  public Funcionario_Cuenta: any = {};
  public Inventario: any = {
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
    Titulo: 'Inventario físico estibas',
    Fecha: new Date(),
    Codigo: '',
  };

  // public RutaPrincipal: string = this._generalService.Ruta_Principal;
  public Codigo_Barras = '';
  public productToInventory: any = {
    Lotes: [],
  };
  public Producto_Barras_Fields = [];
  public Cargando: boolean = false;
  public Fecha_Hoy = new Date();
  public alertOption1: SweetAlertOptions = {};
  public alertOption2: SweetAlertOptions = {};
  public alertOption3: SweetAlertOptions = {};
  public alertOptionGuardarSalir: SweetAlertOptions = {};
  public loadingProductos = false;
  public idInventarioParams;
  public Producto_Barras: any = {};

  /** las dos pociones validas en la db */
  GuardarSalirTipo = 'Pendiente Primer Conteo';
  GuardarTerminarTipo = 'Primer Conteo';
  public canSaveProduct: boolean = false;

  constructor(
    private _swalService: SwalService,
    private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute,
    private readonly categoryService: CategoriasService,
  ) {
    this.alertOption1 = {
      title: '¿Estás seguro(a)?',
      text: 'Te dispones a inventariar el producto en el primer conteo',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, inventariar',
      icon: 'warning',
      preConfirm: () => {
        this.addProductAsInventoried();
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
    this.alertOption2 = {
      title: '¿Estás seguro(a)?',
      text: 'Vas a dar por finalizado el primer conteo del inventario',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.saveFinishedCountInBackend();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
    this.alertOption3 = {
      title: 'Advertencia!',
      text: 'Ya existe una persona haciendo este inventario',
      showCancelButton: false,
      confirmButtonText: 'Salir',
      icon: 'info',
      allowEscapeKey: false,
      allowEnterKey: false,
      allowOutsideClick: false,
      timer: 1500,

      preConfirm: () => {
        return new Promise((resolve) => {
          this.router.navigate(['/inventario/inventario-fisico']);
        });
      },
    };
    this.alertOptionGuardarSalir = {
      title: '¿Estás seguro(a)?',
      text: 'Te dispones a guardar y salir del inventario',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Guardar y Salir',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.saveUnfinishedCountInBackend(this.GuardarSalirTipo);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  async ngOnInit() {
    //get Iventory Data
    this.getInventoryDataById();
  }

  getInventoryDataById() {
    this.loadingProductos = true;
    let param: any = {};
    param.Id_Doc_Inventario_Fisico = this.route.snapshot.params['id'];

    this.getInventoryData(param).subscribe({
      next: async (res: any) => {
        if (res.Tipo == 'success') {
          //verificamos que el inventario no lo estén trabajando previamente
          if (res.Data.Estado.toLowerCase() != 'pendiente primer conteo') {
            this._swalService
              .show({
                title: 'Advertencia!',
                text: 'El inventario ya tiene el primer conteo finalizado',
                icon: 'error',
                showCancel: false,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/inventario/inventario-fisico']);
                }
              });
          } else {
            //actualizamos el estado del inventario para que nadie pueda trabajar en él
            let datos = new FormData();
            datos.append('Id_Doc_Inventario_Fisico', param.Id_Doc_Inventario_Fisico);
            datos.append('tipo_accion', 'Haciendo Primer Conteo');
            await this.changeInventoryState(datos).toPromise();

            this.Inventario = res.Data;
            // this.Inventario.Estado = 'Haciendo Primer Conteo';
            this.Funcionario_Cuenta = this.Inventario.Funcionario_Cuenta;
            this.Funcionario_Digita = this.Inventario.Funcionario_Digita;
          }
          if (this.Inventario?.Productos?.length > 0) {
            this.Productos = JSON.parse(JSON.stringify(this.Inventario.Productos));
            let swal = {
              icon: 'success',
              title: 'Continuamos',
              text: 'Continuamos con el inventario del primer conteo',
              showCancel: false,
              timer: 2000,
            };
            this._swalService.show(swal);
          }
          this.DatosCabecera.Codigo = res.Data.Codigo;
          this.loadingProductos = false;
        } else {
          let swal = {
            icon: 'error',
            title: 'Error',
            text: 'Comunícate con el equipo de tecnología',
            showCancel: false,
          };
          this._swalService.show(swal);
          this.router.navigate(['/inventario/inventario-fisico']);
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swalService.incompleteError(formattedErrorMessage);
        }
      },
    });
  }
  public getInventoryData(p: any) {
    return this.http.get(environment.base_url + '/php/inventariofisico/estiba/get_inventario.php', {
      params: p,
    });
  }

  addProductQuantity(codigo_Barras_Produc: number) {
    this.Cargando = true;
    this.Codigo_Barras = '';
    let params: any = {};
    params.Codigo = codigo_Barras_Produc;
    params.Id_Estiba = this.Inventario.Estiba.Id_Estiba;

    let resultado = this.Productos.find(
      (producto) => producto.Codigo_Barras === codigo_Barras_Produc,
    );
    // sino hay productos en this.Inventario entrar al if y hacer llamado a api
    if (!resultado) {
      this.getProductData(params).subscribe({
        next: (data: any) => {
          if (data.Tipo == 'success') {
            this.productToInventory = data.Datos;
            this.productToInventory.Cantidad_Encontrada = '';
            if (this.productToInventory['Lotes'] !== undefined) {
              this.productToInventory['Lotes'] = [];
              this.productToInventory['Lotes'].push({
                Codigo: 'Ingresa uno nuevo ➜',
                Id_Inventario_Nuevo: 0,
                Id_Producto: data.Datos.Id_Producto,
                Lote: '',
                Fecha_Vencimiento: '',
                Cantidad: 0,
                Cantidad_Final: 0,
                Cantidad_Encontrada: '',
              });
              console.log('this.productToInventory', this.productToInventory);
            }

            this.Cargado = true;
            this.categoryService.getCampos(data.Datos.Id_Producto).subscribe({
              next: (data: any) => {
                this.Producto_Barras_Fields = data.data;
              },
              error: (error: HttpErrorResponse) => {
                this.Cargado = false;
                let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
                if (error.error.error) {
                  errorMessage = error.error.error;
                  this._swalService.hardError();
                } else if (error.error.errors) {
                  let errorMessages: string[] = [];
                  for (const field in error.error.errors) {
                    errorMessages.push(error.error.errors[field]);
                  }
                  const formattedErrorMessage = errorMessages.join('<br/>');
                  this._swalService.incompleteError(formattedErrorMessage);
                }
              },
            });
          } else {
            let swal = {
              icon: data.Tipo,
              title: data.Titulo,
              text: data.Texto,
            };
            this._swalService.show(swal);
          }
          this.Cargando = false;
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this._swalService.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this._swalService.incompleteError(formattedErrorMessage);
          }
        },
      });
    } else {
      this.Cargando = false;
      this._swalService.error(
        'ERROR',
        'El producto fue previamente inventariado, por favor intenta con otro',
      );
    }
  }

  public getProductData(p: any) {
    return this.http.get(
      environment.base_url + '/php/inventariofisico/estiba/consulta_producto.php',
      { params: p },
    );
  }

  ValidarLote(pos) {
    if (this.productToInventory['Lotes'][pos].Lote.length < 4) {
      this._swalService.error(
        'Error en lote',
        'La longitud del lote debe ser mayor o igual a tres letras',
      );
      this.productToInventory['Lotes'][pos].Lote = '';
      this.productToInventory['Lotes'][pos].Fecha_Vencimiento = '';
      this.productToInventory['Lotes'][pos].Cantidad_Encontrada = '';
    } else {
      this.productToInventory['Lotes'][pos].Lote =
        this.productToInventory['Lotes'][pos].Lote.trim();
      this.productToInventory['Lotes'][pos].Lote =
        this.productToInventory['Lotes'][pos].Lote.toUpperCase();
      document.getElementById('Vencimiento' + pos).focus();
    }
  }

  saveUnfinishedCount() {
    this._swalService.customAlert(this.alertOptionGuardarSalir);
  }

  saveFinishedCount() {
    this._swalService.customAlert(this.alertOption2);
  }

  VerificarSiExisteEnFila(pos) {
    //verificamos antes de agregar a la fila si existe un lote agregado al mismo producto

    //si solo hay un lote quiere decir que es el de insertar, entonces no es necesario hacer la verificación
    if (this.productToInventory['Lotes'].length > 1) {
      //recorremos los lotes menos el último que es el de insertar buscando coincidencias si la encuentra mande un mensaje de error!
      for (let index = 0; index < this.productToInventory['Lotes'].length - 1; index++) {
        if (
          this.productToInventory['Lotes'][pos].Lote ==
            this.productToInventory['Lotes'][index].Lote &&
          pos != index
        ) {
          let swal = {
            icon: 'error',
            title: 'Error en referencia del lote',
            text: 'Existe un lote del mismo producto agregado, por favor revisa',
          };

          this.productToInventory['Lotes'][pos].Lote = '';
          this.productToInventory['Lotes'][pos].Cantidad_Encontrada = '';
          this.productToInventory['Lotes'][pos].Fecha_Vencimiento = '';
          this._swalService.show(swal);
          document.getElementById('Lote' + pos).focus();
          return false;
        }
      }
    }
    //si no encotró coincidencia agregue a la fila
    this.AgregaFila(pos);
  }

  AgregaFila(pos) {
    if (this.productToInventory['Lotes'][pos + 1] == undefined) {
      this.productToInventory['Lotes'].push({
        Codigo: 'Ingresa uno nuevo ➜',
        Id_Inventario_Nuevo: 0,
        Id_Producto: this.productToInventory.Id_Producto,
        Lote: '',
        Fecha_Vencimiento: '',
        Cantidad: 0,
        Cantidad_Final: '',
        Cantidad_Encontrada: '',
      });
    }
    this.canSaveProduct = true;
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
      this.productToInventory['Lotes'][pos].Fecha_Vencimiento < Fecha_Inferior ||
      this.productToInventory['Lotes'][pos].Fecha_Vencimiento > Fecha_Superior
    ) {
      this._swalService.error(
        'Error en la fecha de vencimiento',
        'Hay un error en la fecha de vencimiento, por favor revisa.',
      );

      this.productToInventory['Lotes'][pos]['Fecha_Vencimiento'] = '';
      this.productToInventory['Lotes'][pos]['Cantidad_Encontrada'] = '';
      this.productToInventory['Lotes'][pos]['Lote'] = '';
    } else {
      //en caso contrario enfoque el siguiente campo para ser rellenado
      document.getElementById('Cantidad' + pos).focus();
    }
  }

  ValidarCantidad(pos) {
    //si en la lista de Lotes solo existe uno (el de ingresar nuevo ) no deja guardar lotes, debe ser agregado previamente a la lista pasando todas las validaciones
    if (
      this.productToInventory['Lotes'][pos].Codigo == 'Ingresa uno nuevo ➜' &&
      this.productToInventory['Lotes'][pos].Cantidad_Encontrada == 0
    ) {
      this._swalService.error(
        'Error en lote',
        'La longitud del lote debe ser mayor o igual a tres letras',
      );

      return false;
    }
    //antes de pasar a agregar a fila y guardar debemos verificar si todos los campos anteriores no están vacios
    let cantidad = this.productToInventory['Lotes'][pos].Cantidad_Encontrada.toString();
    if (
      cantidad == '' ||
      this.productToInventory['Lotes'][pos].Fecha_Vencimiento == '' ||
      this.productToInventory['Lotes'][pos].Lote == ''
    ) {
      let swal = {
        icon: 'error',
        title: 'Hay un error  ',
        text: 'Debe agregar todos los campos , por favor revise ',
      };
      this._swalService.show(swal);
      return false;
    }
    //si todo sale bien verifica si exite en la fila previamente
    this.VerificarSiExisteEnFila(pos);
  }

  guardarvalidado() {
    //validar si existen lotes incompletos para que no guarden vacios

    for (let producto = 0; producto < this.productToInventory['Lotes'].length - 1; producto++) {
      if (
        this.productToInventory['Lotes']['Lote'] == '' ||
        this.productToInventory['Lotes']['Fecha_Vencimiento'] == ''
      ) {
        let swal = {
          icon: 'error',
          title: 'Existe un error  ',
          text: 'Existen lotes con campos incompletos, por favor revise',
        };
        this._swalService.show(swal);

        return false;
      }

      if (this.productToInventory['Lotes']['Codigo'] != '') {
        if (this.productToInventory['Lotes']['Cantidad_Encontrada'] <= 0) {
          {
            let swal = {
              icon: 'error',
              title: 'Existe un error  ',
              text: 'Las cantidades no son correctas por favor revise',
            };
            this._swalService.show(swal);

            return false;
          }
        }
      }

      if (
        this.productToInventory['Lotes']['Cantidad_Encontrada'] === '' ||
        isNaN(this.productToInventory['Lotes']['Cantidad_Encontrada'])
      ) {
        {
          let swal = {
            icon: 'error',
            title: 'Existe un error  ',
            text: 'La cantidad encontrada no puede estar vacía',
          };
          this._swalService.show(swal);

          return false;
        }
      }
    }

    if (this.productToInventory['Lotes'].length < 1) {
      ////////////////// reivsar por qué <=1
      let swal = {
        icon: 'error',
        title: 'Hay un error  ',
        text: 'Debe agregar un lote para poder guardar , por favor revise ',
      };
      this._swalService.show(swal);
    } else {
      //limpiamos el ultimo dato para que ingrese limpio
      let ultimo = this.productToInventory['Lotes'].length - 1;
      this.productToInventory['Lotes'][ultimo].Cantidad_Encontrada = '';
      this.productToInventory['Lotes'][ultimo].Lote = '';
      this.productToInventory['Lotes'][ultimo].Fecha_Vencimiento = '';
      this._swalService.customAlert(this.alertOption1);
    }
  }

  addProductAsInventoried() {
    this.Productos.push(this.productToInventory);
    console.log('this.Productos', this.Productos);
    let productos = functionsUtils.normalize(JSON.stringify(this.Productos));

    let datos = new FormData();
    datos.append('Id_Doc_Inventario_Fisico', this.Inventario['Id_Doc_Inventario_Fisico']);
    datos.append('Productos', productos);

    // this.saveProductToInventory(datos).subscribe({
    //   next: (data: any) => {
    //     if (data.codigo == 'success') {
    //       this.Cargado = false;
    //       let swal = {
    //         icon: data.icon,
    //         title: data.mensaje,
    //         text: data.text,
    //         showCancel: false,
    //         timer: 1800,
    //       };
    //       this._swalService.show(swal);
    //       this.productToInventory = [];
    //     } else {
    //       this._swalService.show(data);
    //     }
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
    //     if (error.error.error) {
    //       errorMessage = error.error.error;
    //       this._swalService.hardError();
    //     } else if (error.error.errors) {
    //       let errorMessages: string[] = [];
    //       for (const field in error.error.errors) {
    //         errorMessages.push(error.error.errors[field]);
    //       }
    //       const formattedErrorMessage = errorMessages.join('<br/>');
    //       this._swalService.incompleteError(formattedErrorMessage);
    //     }
    //   },
    // });

    const request = (resolve: any) => {
      this.saveProductToInventory(datos).subscribe({
        next: (data: any) => {
          if (data.codigo == 'success') {
            this.Cargado = false;
            let swal = {
              icon: data.icon,
              title: data.mensaje,
              text: data.text,
              showCancel: false,
              timer: 1800,
            };
            this._swalService.show(swal);
            this.productToInventory = [];
          } else {
            this._swalService.show(data);
          }
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
          if (error.error.error) {
            errorMessage = error.error.error;
            this._swalService.hardError();
          } else if (error.error.errors) {
            let errorMessages: string[] = [];
            for (const field in error.error.errors) {
              errorMessages.push(error.error.errors[field]);
            }
            const formattedErrorMessage = errorMessages.join('<br/>');
            this._swalService.incompleteError(formattedErrorMessage);
          }
        },
      });
    };
    this._swalService.swalLoading('Vamos a registrar el producto como inventariado', request);
  }
  saveProductToInventory(data: FormData) {
    return this.http.post(
      environment.base_url + '/php/inventariofisico/estiba/agrega_productos.php',
      data,
      {
        context: skipContentType(),
      },
    );
  }
  saveFinishedCountInBackend() {
    // for (let producto = 0; producto < this.Productos.length; producto++) {
    //   for (let lote = 0; lote < this.Productos[producto]['Lotes'].length; lote++) {
    //     if (this.Productos[producto]['Lotes'][lote]['AgregarLote'] == 'block') {
    //       let swal = {
    //         icon: 'error',
    //         title: 'Error Lotes editables',
    //         text: 'Existen lotes en edición y deben ser agregados, Por Favor Revise ',
    //       };
    //       this._swalService.show(swal);
    //       return false;
    //     }
    //   }
    // }

    for (let producto = 0; producto < this.Productos.length; producto++) {
      if (this.Productos[producto]['Lotes'] && Array.isArray(this.Productos[producto]['Lotes'])) {
        for (let lote = 0; lote < this.Productos[producto]['Lotes'].length; lote++) {
          if (this.Productos[producto]['Lotes'][lote]['AgregarLote'] === 'block') {
            let swal = {
              icon: 'error',
              title: 'Error Lotes editables',
              text: 'Existen lotes en edición y deben ser agregados, Por Favor Revise ',
            };
            this._swalService.show(swal);
            return false;
          }
        }
      } else {
        console.error(
          'Lotes no está definido, es null o no es un array para el producto en la posición especificada',
        );
      }
    }

    let productos = functionsUtils.normalize(JSON.stringify(this.Productos));
    let datos = new FormData();
    datos.append('Id_Doc_Inventario_Fisico', this.Inventario['Id_Doc_Inventario_Fisico']);
    datos.append('productos', productos);

    this.AjustarInventarioEstiba(datos).subscribe({
      next: (data: any) => {
        if (data.tipo == 'success') {
          let swal = {
            icon: data.tipo,
            title: data.titulo,
            text: data.mensaje,
            showCancel: false,
          };
          this._swalService.show(swal);
          this.router.navigate(['/inventario/inventario-fisico']);
        } else {
          /* this.respuestaGuardarError.title = data.titulo;
        this.respuestaGuardarError.text = data.mensaje;
        this.respuestaGuardarError.icon = 'error';
        this._swalService.customAlert(this.respuestaGuardarError); */
        }

        // let swal = {
        //   codigo: data.tipo,
        //   titulo: data.titulo,
        //   mensaje: data.mensaje
        // };
        // this._swalService.ShowMessage(swal);

        // this.Productos = [];
        // this.router.navigate(['/listadoinventarios']);
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swalService.incompleteError(formattedErrorMessage);
        }
      },
    });
  }

  AjustarInventarioEstiba(data: FormData) {
    return this.http.post(
      environment.base_url + '/php/inventariofisico/estiba/ajustar_inventario.php',
      data,
      {
        context: skipContentType(),
      },
    );
  }

  saveUnfinishedCountInBackend(tipo_accion) {
    for (let producto = 0; producto < this.Productos.length; producto++) {
      // Verifica que 'Lotes' existe y es un array
      if (this.Productos[producto]['Lotes'] && Array.isArray(this.Productos[producto]['Lotes'])) {
        for (let lote = 0; lote < this.Productos[producto]['Lotes'].length; lote++) {
          if (this.Productos[producto]['Lotes'][lote]['AgregarLote'] === 'block') {
            let swal = {
              icon: 'error',
              title: 'Error Lotes editables',
              text: 'Existen lotes en edición y deben ser agregados, Por Favor Revise ',
            };
            this._swalService.show(swal);
            return false;
          }
        }
      } else {
        console.error(
          'Lotes no está definido, es null o no es un array para el producto en la posición especificada',
        );
      }
    }

    let datos = new FormData();

    datos.append('Id_Doc_Inventario_Fisico', this.Inventario['Id_Doc_Inventario_Fisico']);
    datos.append('tipo_accion', tipo_accion);

    this.changeInventoryState(datos).subscribe({
      next: (data: any) => {
        if (data.tipo == 'success') {
          let swal = {
            icon: data.tipo,
            title: data.titulo,
            text: data.mensaje,
            showCancel: false,
          };
          this._swalService.show(swal);
          this.router.navigate(['/inventario/inventario-fisico']);
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrio un error. Intenta nuevamente.';
        if (error.error.error) {
          errorMessage = error.error.error;
          this._swalService.hardError();
        } else if (error.error.errors) {
          let errorMessages: string[] = [];
          for (const field in error.error.errors) {
            errorMessages.push(error.error.errors[field]);
          }
          const formattedErrorMessage = errorMessages.join('<br/>');
          this._swalService.incompleteError(formattedErrorMessage);
        }
      },
    });
  }

  changeInventoryState(data: FormData) {
    return this.http.post(
      environment.base_url + '/php/inventariofisico/estiba/gestion_de_estado.php',
      data,
      {
        context: skipContentType(),
      },
    );
  }

  actualizarProductos() {}

  isValidImageUrl(url: string): boolean {
    // Expresión regular para verificar si la URL comienza con "http" o "https"
    const pattern = /^https?:\/\//i;
    return pattern.test(url);
  }

  enableAndDisableAddPrpdButton(i: number) {
    const loteValue = this.productToInventory.Lotes[i].Lote || '';
    const fechaVencimientoValue = this.productToInventory.Lotes[i].Fecha_Vencimiento || '';
    const cantidadEncontradaValue = this.productToInventory.Lotes[i].Cantidad_Encontrada || '';

    if (
      (loteValue && (!fechaVencimientoValue || !cantidadEncontradaValue)) ||
      (fechaVencimientoValue && (!loteValue || !cantidadEncontradaValue)) ||
      (cantidadEncontradaValue && (!loteValue || !fechaVencimientoValue))
    ) {
      this.canSaveProduct = false;
    } else {
      this.canSaveProduct = true;
    }
  }

  enableAndDisableAddQuantitydButton() {
    const cantidadEncontrada = this.productToInventory.Cantidad_Encontrada;

    if (cantidadEncontrada !== null && cantidadEncontrada !== 0) {
      this.canSaveProduct = true;
    } else {
      this.canSaveProduct = false;
    }
  }
}
