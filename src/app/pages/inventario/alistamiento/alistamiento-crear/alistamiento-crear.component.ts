import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ImagePipe } from '../../../../core/pipes/image.pipe';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import { ArchwizardModule } from '@viso-trust/angular-archwizard';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-alistamiento-crear',
  templateUrl: './alistamiento-crear.component.html',
  styleUrls: ['./alistamiento-crear.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ArchwizardModule,
    NgFor,
    NgClass,
    ModalBasicComponent,
    DatePipe,
    ImagePipe,
    CabeceraComponent,
    MatStepperModule,
  ],
})
export class AlistamientoCrearComponent implements OnInit {
  public remision: any = [];
  public Paso: number;
  public Leer_Estiba: boolean = true;
  public Completo = false;
  public pos = 0;
  public pos1: number = 0;
  public albums: Array<any> = [];
  public origen: any = [];
  public categoria_origen: any = [];
  public productos: any[] = [];
  public destino: any = [];
  public habilitado: boolean = true;
  public Posicion: any[] = [];
  public color = false;
  datosCabecera = {
    Titulo: 'Alistamiento',
    Fecha: new Date(),
    Codigo: '',
  };

  /* TODO auth user */
  public User: any = { Identificacion_Funcionario: '1' };
  public Consulta1: any;
  public Consulta2: any;
  public Peso_Total_Remision: number = 0;
  seleccionado = false;
  public Lista_Productos: any = [
    {
      estiba: {
        nombre_estiba: '',
        productos: {
          lote: '',
          Cantidad_Total: '',
          Nombre_Producto: '',
          Fecha_Vencimiento: '',
          Id_Producto: '',
          Id_Inventario: '',
          Peso_Presentacion_Minima: '',
          Peso_Presentacion_Regular: '',
          CantiPeso_Presentacion_Maximadad: '',
          Codigo_Barras: '',
          Codigo_Ingresado: '',
          Cantidad_Ingresada: '',
          Habilitado: '',
          Clase: '',
        },
      },
    },
  ];
  public Lista: any = [
    {
      lote: '',
      Cantidad_Total: '',
      Nombre_Producto: '',
      Fecha_Vencimiento: '',
      Id_Producto: '',
      Id_Inventario: '',
      Peso_Presentacion_Minima: '',
      Peso_Presentacion_Regular: '',
      CantiPeso_Presentacion_Maximadad: '',
      Codigo_Barras: '',
      Codigo_Ingresado: '',
      Cantidad_Ingresada: '',
      Habilitado: '',
      Clase: '',
    },
  ];
  public Peso: any;
  public pesototal: number;
  public tolerancia: number;
  public alive = true;
  public Peso_General: number;
  public Tolerancia_Global: number;
  public Peso_Total: '';
  public Mensaje: any;
  public Contador: number = 0;
  public Contador1: number = 0;
  public balanza = '';
  public id_remi = '';
  public Imagen = '';
  public display_Interna = 'none';
  private _subscription: Subscription;
  public estado_balanza: boolean;
  public closeResult;
  confirmacionSwal: any;
  @ViewChild('CodigoBarra') CodigoBarra: ElementRef;
  @ViewChild('Peso_Balanza') Peso_Balanza: ElementRef;
  @ViewChild('modalBodega') modalBodega: any;
  @ViewChild('modalImagen') modalImagen: any;
  confirmacionSalir: any;

  confirmacionGuardar: any;
  public alertOptionMaterial: any = {};
  public alertOptionFase1: any = {};
  public alertOptionFase2: any = {};

  @ViewChild('FormFaseII') private FormFaseII: NgForm;

  Service: any;
  public alertOptionInventario: any = {};
  nombreMapa = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private readonly swalService: SwalService,
  ) {
    //consultar el estado de la Balanza (aplica o no)
    this.http.get(environment.base_url + '/php/balanza/estado.php').subscribe((data: any) => {
      // this.estado_balanza = data.data;
      this.estado_balanza = true;
    });

    let id = this.route.snapshot.params['id'];
    let tipo = this.route.snapshot.params['tipo'];
    if (tipo == 'Remision') {
      this.buscarRem(id, tipo);
    } else if (tipo == 'Devolucion') {
      this.buscarDevolucion(id, tipo);
    }

    this.alertOptionMaterial = {
      title: '¿Está Seguro?',
      text: 'Se dispone Terminar la Fase unica de Alistamiento',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarMaterial();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
    this.alertOptionFase1 = {
      title: '¿Está Seguro?',
      text: 'Se dispone Terminar la Fase 1 de Alistamiento',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarFaseI();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
    this.alertOptionFase2 = {
      title: '¿Está Seguro?',
      text: 'Se dispone Terminar la Fase 2 del Alistamiento',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarFaseII(this.FormFaseII);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  buscarRem(id, tipo) {
    this.http
      .get(environment.base_url + '/php/remision_nuevo/remision.php', {
        params: { id: id },
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.remision = data.Remision;
        this.datosCabecera.Codigo = this.remision.Codigo;
        this.origen = data.Origen;
        let mapaUrl = `${environment.base_url}/IMAGENES/MAPABODEGA/${data.Origen.Mapa}`;
        //Modal Mapa Bodega
        this.alertOptionInventario = {
          title: 'Mapa de la Bodega',
          text: 'Ubicación de las Estibas',
          imageUrl: mapaUrl,
          imageWidth: 700,
          width: 800,
        };

        this.categoria_origen = data.Categoria_Origen;
        /*     if(data.Origen.Id_Bodega!='2' && data.Origen.Id_Bodega!='3' && !this.estado_balanza){
            this.display_Interna='block'
          }
        */
        this.validar(this.remision.Id_Remision, tipo);
        this.productos = data.Productos;
        this.destino = data.Destino;
        this.Paso = parseInt(this.remision.Estado_Alistamiento);

        this.Completo = true;
        if (this.estado_balanza) {
          if (this.Paso === 1) {
            if (localStorage.getItem('combo')) {
              this.balanza = JSON.parse(localStorage.getItem('combo'));
              this.Consulta1 = timer(600).subscribe(() => {
                this.http
                  .get(environment.base_url + '/php/alistamiento/peso.php', {
                    params: { balanza: this.balanza },
                  })
                  .subscribe((data: any) => {
                    this.Peso = data.Peso;
                    this.HablilitarPesoSiguiente(this.Peso);
                  });
              });
            } else {
              this.modalBodega.show();
            }
          }
        }
      });
  }
  buscarDevolucion(id, tipo) {
    this.http
      .get(environment.base_url + '/php/noconforme/devolucion_alistamiento.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        this.remision = data.Remision;
        this.origen = data.Origen;
        let mapaUrl = `${environment.base_url}/IMAGENES/MAPABODEGA/${data.Origen.Mapa}`;
        //Modal Mapa Bodega
        this.alertOptionInventario = {
          title: 'Mapa de la Bodega',
          text: 'Ubicación de las Estibas',
          imageUrl: mapaUrl,
          imageWidth: 700,
          width: 800,
        };
        this.destino = data.Destino;

        // this.categoria_origen = data.Categoria_Origen;

        this.validar(this.remision.Id_Remision, tipo);
        this.productos = data.Productos;
        this.Paso = parseInt(this.remision.Estado_Alistamiento);

        this.Completo = true;
        /*      if (this.estado_balanza) {
             if (this.Paso === 1) {
               if (localStorage.getItem("combo")) {
                 this.balanza = JSON.parse(localStorage.getItem('combo'));

                 this.Consulta1 = TimerObservable.create(0, 600).takeWhile(() => this.alive)
                   .subscribe(() => {
                     this.http.get(environment.ruta + 'php/alistamiento/peso.php', { params: { balanza: this.balanza } }).subscribe((data: any) => {
                       this.Peso = data.Peso;
                       this.HablilitarPesoSiguiente(this.Peso)
                     });
                   });
               } else {
                 this.modalBodega.show();
               }

             }
           }
      */
      });
  }
  validar(remision, tipo) {
    let id = this.route.snapshot.params['id'];
    var local = JSON.parse(localStorage.getItem('Id_Remision'));
    if (
      parseInt(JSON.parse(localStorage.getItem('Id_Remision'))) == parseInt(id) &&
      localStorage.getItem('Lista_Producto_Inicial')
    ) {
      this.Lista_Productos = JSON.parse(localStorage.getItem('Lista_Producto_Inicial'));
      this.pos = JSON.parse(localStorage.getItem('posicion'));
      this.Peso_Total_Remision = JSON.parse(localStorage.getItem('Peso_Total_Remision'));
    } else {
      localStorage.setItem('Id_Remision', JSON.stringify(remision));
      this.Peso_Total_Remision = 0;
      this.pos = 0;
      this.http
        .get(environment.base_url + '/php/alistamiento_nuevo/productos_remision.php', {
          params: { id: id, tipo },
        })
        .subscribe((res: any) => {
          const { data } = res;
          this.Lista_Productos = data.Productos;
          this.Peso_General = parseInt(data.Peso_General);
          this.Tolerancia_Global = parseInt(data.Tolerancia_Global);
          // localStorage.setItem('Lista_Producto_Inicial', JSON.stringify(this.Lista_Productos));
          localStorage.setItem('Tolerancia', JSON.stringify(this.Tolerancia_Global));
        });
    }
  }
  ngOnInit() {}

  VerPantallaLista() {
    this.router.navigate(['/inventario/alistamiento']);
  }
  focus() {
    setTimeout(() => {
      this.CodigoBarra.nativeElement.focus();
    }, 100);
  }
  ActualizarLista() {
    let id = this.route.snapshot.params['id'];
    this.http
      .get(environment.base_url + '/php/alistamiento_nuevo/productos_remision.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        this.Lista = data.Productos;

        this.Peso_General = parseInt(data.Peso_General);
        this.Tolerancia_Global = parseInt(data.Tolerancia_Global);
        for (let index = 0; index < this.Lista_Productos.length; index++) {
          if (this.Lista[index] == undefined) {
            this.Lista.push({
              lote: '',
              Cantidad_Total: '',
              Nombre_Producto: '',
              Fecha_Vencimiento: '',
              Id_Producto: '',
              Id_Inventario: '',
              Peso_Presentacion_Minima: '',
              Peso_Presentacion_Regular: '',
              CantiPeso_Presentacion_Maximadad: '',
              Codigo_Barras: '',
              Codigo_Ingresado: '',
              Cantidad_Ingresada: '',
              Habilitado: '',
              Clase: '',
            });
            if (
              this.Lista_Productos[index]['Id_Producto'] == this.Lista[index]['Id_Producto'] &&
              this.Lista_Productos[index]['Lote'] == this.Lista[index]['Lote'] &&
              this.Lista_Productos['Fecha_Vencimiento'] == this.Lista['Fecha_Vencimiento']
            ) {
              this.Lista_Productos[index].Cantidad = this.Lista[index]['Cantidad'];
            } else {
              this.Lista_Productos.splice(index, 1);
            }
          } else {
            if (
              this.Lista_Productos[index]['Id_Producto'] == this.Lista[index]['Id_Producto'] &&
              this.Lista_Productos[index]['Lote'] == this.Lista[index]['Lote'] &&
              this.Lista_Productos['Fecha_Vencimiento'] == this.Lista['Fecha_Vencimiento']
            ) {
              this.Lista_Productos[index].Cantidad = this.Lista[index]['Cantidad'];
            } else {
              this.Lista_Productos.splice(index, 1);
            }
          }
        }
        localStorage.setItem('Lista_Producto_Inicial', JSON.stringify(this.Lista_Productos));
        localStorage.setItem('Tolerancia', JSON.stringify(this.Tolerancia_Global));
      });
  }
  GuardaBalanza() {
    this.modalBodega.hide();
    this.balanza = (document.getElementById('balanza') as HTMLInputElement).value;
    localStorage.setItem('combo', JSON.stringify(this.balanza));
    this.Consulta1 = timer(0, 600).subscribe(() => {
      this.http
        .get(environment.base_url + '/php/alistamiento/peso.php', {
          params: { balanza: this.balanza },
        })
        .subscribe((data: any) => {
          this.Peso = data.Peso;
          this.HablilitarPesoSiguiente(this.Peso);
        });
    });
  }

  Puntero() {
    //(document.getElementById("CodigoBarra") as HTMLInputElement).value = '';
    this.focus();
  }
  HablilitarSiguiente(codigo) {
    let longitud = this.Lista_Productos.length;
    longitud = longitud - 1;
    if (this.Lista_Productos[this.pos]?.Estiba_Validado) {
      if (this.Lista_Productos[this.pos]['Codigo_Validado'] === false) {
        if (codigo != '') {
          this.Leer_Estiba = false;
          let tipo = this.route.snapshot.params['tipo'];
          let mod = tipo == 'Devolucion' ? 'Devolucion_Compra' : 'Remision';

          this.http
            .get(environment.base_url + '/php/alistamiento_nuevo/consulta_codigo.php', {
              params: { codigo: codigo, mod, id: this.Lista_Productos[this.pos].Id_Producto },
            })
            .subscribe((data: any) => {
              if (data) {
                (document.getElementById('fila' + this.pos) as HTMLInputElement).setAttribute(
                  'class',
                  'label-success',
                );
                (document.getElementById('fila' + this.pos) as HTMLInputElement).disabled;
                this.Lista_Productos[this.pos]['Codigo_Ingresado'] = codigo;
                this.Lista_Productos[this.pos]['Codigo_Validado'] = true;
                this.Lista_Productos[this.pos]['Clase'] = this.color ? 'habilitado' : 'habilitado2';
                (document.getElementById('CodigoBarra') as HTMLInputElement).value = '';
                localStorage.setItem(
                  'Lista_Producto_Inicial',
                  JSON.stringify(this.Lista_Productos),
                );
                localStorage.setItem('Tolerancia', JSON.stringify(this.Tolerancia_Global));
                if (this.pos < longitud) {
                  this.pos += 1;
                  if (!this.Lista_Productos[this.pos]['Estiba_Validado']) {
                    this.Leer_Estiba = true;
                  }
                  localStorage.setItem('posicion', JSON.stringify(this.pos));
                  //this.Lista_Productos[this.pos]["Habilitado"]="false";

                  /*
                this.Lista_Productos[this.pos]["Clase"] = "noblur"; */
                  localStorage.setItem(
                    'Lista_Producto_Inicial',
                    JSON.stringify(this.Lista_Productos),
                  );
                  (document.getElementById('CodigoBarra') as HTMLInputElement).value = '';
                }
              } else {
                this.confirmacionSwal.title = 'Error En Codigo';
                this.confirmacionSwal.text =
                  'El codigo de barras no concuerda con el registrado en la base de Datos';
                this.confirmacionSwal.icon = 'error';
                this.swalService.show(this.confirmacionSwal);
              }
            });
        }
      } else {
        (document.getElementById('fila' + this.pos) as HTMLInputElement).setAttribute(
          'class',
          'label-success',
        );
        this.pos += 1;
        // this.pos+=1;
        (document.getElementById('CodigoBarra') as HTMLInputElement).value = '';
      }
    } else {
      this.Leer_Estiba = true;
      this.http
        .get(environment.base_url + '/php/alistamiento_nuevo/consulta_codigo_estiba.php', {
          params: { codigo: codigo, id: this.Lista_Productos[this.pos].Id_Estiba },
        })
        .subscribe((data: any) => {
          if (data) {
            this.Leer_Estiba = false;
            this.Lista_Productos.forEach((p, posicion) => {
              if (p.Id_Estiba == data.Id_Estiba) {
                p['Clase'] = 'noblur';
                p['Estiba_Validado'] = true;
                p['Codigo_Barras_Ingresado'] = codigo;
                p['Label'] = true;
                this.color = !this.color;
              }
            });
          } else {
            this.confirmacionSwal.title = 'Error En Codigo Estiba';
            this.confirmacionSwal.text = 'El codigo de barras de la estiba es incorrecto';
            this.confirmacionSwal.icon = 'error';
            this.swalService.show(this.confirmacionSwal);
          }
        });
    }

    (document.getElementById('CodigoBarra') as HTMLInputElement).value = '';
  }

  open(index: number): void {
    let album = {
      src: environment.base_url + '/IMAGENES/PRODUCTOS/' + this.Lista_Productos[index].Imagen,
      caption: 'test',
      thumb: environment.base_url + '/IMAGENES/PRODUCTOS/' + this.Lista_Productos[index].Imagen,
    };
    /*   this.albums.push(album); */
    // override the default config
    /*  this._lightbox.open(this.albums, index); */
  }
  QuitarObservable() {
    this.Consulta1.unsubscribe();
    if (localStorage.getItem('combo')) {
      this.balanza = JSON.parse(localStorage.getItem('combo'));
    } else {
      this.balanza = (document.getElementById('balanza') as HTMLInputElement).value;
    }
    this.Tolerancia_Global = parseInt(JSON.parse(localStorage.getItem('Tolerancia')));
    this.Consulta2 = timer(1000).subscribe(() => {
      this.http
        .get(environment.base_url + '/php/alistamiento/peso_total.php', {
          params: { balanza: this.balanza },
        })
        .subscribe((data: any) => {
          this.Peso = data.Peso;
          this.PesoTotal(this.Peso);
        });
    });
  }
  PesoTotal(peso) {
    peso = parseInt(peso);
    if (peso != '') {
      if (peso >= this.Peso_Total_Remision && this.Contador1 === 3) {
        this.Peso_Total = peso;
        this.Contador1 = 0;
        this.confirmacionSwal.title = 'Peso Correcto';
        this.confirmacionSwal.text =
          'El Peso general concuerda con el registrado en Base de Datos, puede retirar los productos';
        this.confirmacionSwal.icon = 'success';
        this.swalService.show(this.confirmacionSwal);
        this.Consulta2.unsubscribe();
      } else if (peso >= this.Peso_Total_Remision) {
        this.Contador1 += 1;
      } else {
        this.Mensaje = 'Peso Incorrecto!';
        this.Peso_Total = '';
      }
    }
  }
  HablilitarPesoSiguiente(peso) {
    var longitud = this.Lista_Productos.length;
    if (longitud > this.pos1) {
      if (this.Lista_Productos[this.pos1]['Validado'] === false) {
        this.http
          .get(environment.base_url + '/php/alistamiento/consultar_peso.php', {
            params: { id: this.Lista_Productos[this.pos1].Id_Producto_Remision },
          })
          .subscribe((data: any) => {
            this.pesototal = data.Peso_Total;
            this.tolerancia = parseInt(this.Lista_Productos[this.pos1]['Tolerancia_Individual']);
            var Rangoinferior = this.pesototal - this.tolerancia;
            var Rangosuperior = this.pesototal + this.tolerancia;

            if (
              parseInt(peso) >= Rangoinferior &&
              parseInt(peso) <= Rangosuperior &&
              this.Contador === 3
            ) {
              this.Lista_Productos[this.pos1]['Peso'] = peso;
              this.Lista_Productos[this.pos1]['Validado'] = true;
              this.Lista_Productos[this.pos1]['Mensaje'] = 'Peso Correcto!';
              this.Peso_Total_Remision += peso;
              localStorage.setItem('Peso_Total_Remision', JSON.stringify(this.Peso_Total_Remision));
              (document.getElementById('peso' + this.pos1) as HTMLInputElement).setAttribute(
                'class',
                'label-success',
              );
              this.pos1 += 1;
              this.confirmacionSwal.title = 'Peso Correcto';
              this.confirmacionSwal.text =
                'El Peso concuerda con el registrado en la base de Datos coloque el siguiente Producto en el peso';
              this.confirmacionSwal.icon = 'success';
              this.swalService.show(this.confirmacionSwal);
              this.Contador = 0;
              localStorage.setItem('Lista_Producto_Inicial', JSON.stringify(this.Lista_Productos));
            } else if (parseInt(peso) >= Rangoinferior && parseInt(peso) <= Rangosuperior) {
              this.Contador += 1;
            } else {
              (document.getElementById('peso' + this.pos1) as HTMLInputElement).setAttribute(
                'class',
                'label-danger',
              );
              this.pos1 += this.pos1;
              this.Lista_Productos[this.pos1]['Peso'] = '';
              //this.Lista_Productos[this.pos1]["Mensaje"]="Peso Incorrecto!"
            }
          });
      } else {
        (document.getElementById('peso' + this.pos1) as HTMLInputElement).setAttribute(
          'class',
          'label-success',
        );
      }
    }
  }

  HablilitarCantidadSiguiente(i, cant) {
    var longitud = this.Lista_Productos.length;
    if (cant === this.Lista_Productos[i]['Cantidad']) {
      this.Lista_Productos[i]['Cantidad_Ingresada'] = cant;
      this.Lista_Productos[i]['Validado'] = true;
      this.Lista_Productos[i]['Mensaje'] = 'Cantidad Correcta!';
      (document.getElementById('canti' + i) as HTMLInputElement).setAttribute(
        'class',
        'label-success',
      );
      this.pos1 += 1;
      this.Contador = 0;
      localStorage.setItem('Lista_Producto_Inicial', JSON.stringify(this.Lista_Productos));
    } else {
      (document.getElementById('canti' + i) as HTMLInputElement).setAttribute(
        'class',
        'label-danger',
      );
      this.Lista_Productos[i]['Cantidad_Ingresada'] = cant;
      this.Lista_Productos[i]['Validado'] = false;
      this.Lista_Productos[i]['Mensaje'] = 'Cantidad Incorrecta!';
    }
  }

  GuardarFaseI() {
    var id = this.route.snapshot.params['id'];
    var tipo = this.route.snapshot.params['tipo'];
    let datos = new FormData();
    let mod = '';
    mod = tipo == 'Devolucion' ? 'Devolucion_Compra' : 'Remision';

    datos.append('modulo', mod);
    datos.append('id', id);
    datos.append('tipo', tipo);
    datos.append('funcionario', this.User.Identificacion_Funcionario);
    const headers = new HttpHeaders({
      Accept: 'text/plain',
    });

    this.http
      .post(environment.base_url + '/php/alistamiento_nuevo/guardar_fase1.php', datos, { headers })
      .subscribe((data: any) => {
        this.confirmacionSalir.title = 'Operación exitosa';
        this.confirmacionSalir.text = data.mensaje;
        this.confirmacionSalir.icon = data.tipo;
        this.swalService.show(this.confirmacionSalir).then((res) => {
          if (res.isConfirmed) this.VerPantallaLista();
        });
      });
    localStorage.removeItem('Lista_Producto_Inicial');
    localStorage.removeItem('posicion');
    localStorage.removeItem('Tolerancia');
    localStorage.removeItem('Peso_Total_Remision');
  }
  GuardarMaterial() {
    var id = this.route.snapshot.params['id'];
    let datos = new FormData();
    let prod = JSON.stringify(this.Lista_Productos);

    datos.append('modulo', 'Remision');
    datos.append('id', id);
    datos.append('productos', prod);
    datos.append('funcionario', this.User.Identificacion_Funcionario);
    this.http
      .post(environment.base_url + '/php/alistamiento/guardar_material.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSalir.title = 'Operación exitosa';
        this.confirmacionSalir.text = data.mensaje;
        this.confirmacionSalir.icon = data.tipo;
        this.swalService.show(this.confirmacionSalir).then((res) => {
          if (res.isConfirmed) this.VerPantallaLista();
        });
      });
    localStorage.removeItem('Lista_Producto_Inicial');
    localStorage.removeItem('posicion');
    localStorage.removeItem('Tolerancia');
    localStorage.removeItem('Peso_Total_Remision');
  }
  GuardarFaseII(formulario: NgForm) {
    var tipo = this.route.snapshot.params['tipo'];
    var id = this.route.snapshot.params['id'];
    var idc = this.route.snapshot.params['idc'];
    let prod = JSON.stringify(this.Lista_Productos);
    let peso = this.Peso_Total;
    let datos = new FormData();
    let mod = tipo == 'Devolucion' ? 'Devolucion_Compra' : 'Remision';
    datos.append('modulo', mod);
    datos.append('id', id);
    datos.append('idc', idc);
    datos.append('funcionario', this.User.Identificacion_Funcionario);
    datos.append('productos', prod);
    datos.append('peso', peso);
    this.http
      .post(environment.base_url + '/php/alistamiento_nuevo/guardar_fase2.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSalir.title = data.title;
        this.confirmacionSalir.text = data.mensaje;
        this.confirmacionSalir.icon = data.tipo;
        this.swalService.show(this.confirmacionSalir).then((res) => {
          if (res.isConfirmed) this.VerPantallaLista();
        });
        if (data.tipo == 'success') {
          window.open(environment.base_url + '/php/archivos/descarga_zebra.php?id=' + this.id_remi);
          localStorage.removeItem('Lista_Producto_Inicial');
          localStorage.removeItem('Tolerancia');
          localStorage.removeItem('Peso_Total_Remision');
        }
      });
  }
  showAlert(evt: any, tipo) {
    switch (tipo) {
      case 'Material':
        this.swalService.show(this.alertOptionMaterial);
        break;
      case 'Fase1':
        const request = () => {
          this.GuardarFaseI();
        };
        this.swalService.swalLoading('Se dispone terminar la fase 1 de alistamiento', request);
        break;
      case 'Fase2':
        this.swalService.show(this.alertOptionFase2);
        break;
    }
  }

  validarCantidades() {
    let response = true;

    for (const item of this.Lista_Productos) {
      if (item.Cantidad != item.Cantidad_Ingresada) {
        response = false;
        break;
      }
    }

    return response;
  }

  abrirMApa() {
    this.swalService.show(this.alertOptionInventario);
  }
}
