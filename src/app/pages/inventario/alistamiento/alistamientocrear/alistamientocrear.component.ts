import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import '@assets/charts/amchart/gauge.js';
// import '@assets/charts/amchart/pie.js';
// import '@assets/charts/amchart/serial.js';
// import '@assets/charts/amchart/light.js';
// import '@assets/charts/amchart/ammap.js';
// import '@assets/charts/amchart/worldLow.js';
// import '@assets/charts/amchart/continentsLow.js';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ModalBasicComponent } from '@shared/components/modal-basic/modal-basic.component';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';
import { MatStepperModule } from '@angular/material/stepper';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { UserService } from '@app/core/services/user.service';
import { downloadFile } from '@shared/functions/download-pdf.function';

@Component({
  selector: 'app-alistamientocrear',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    NgFor,
    ModalBasicComponent,
    CabeceraComponent,
    NotDataSaComponent,
    MatStepperModule,
    TableComponent,
    LoadImageComponent,
  ],
  templateUrl: './alistamientocrear.component.html',
  styleUrls: ['./alistamientocrear.component.scss'],
})
export class AlistamientocrearComponent implements OnInit {
  public remision: any = [];
  public Paso: number;
  public Completo = false;
  public pos = 0;
  public pos1: number = 0;
  public albums: Array<any> = [];
  public origen: any = [];
  public productos: any[] = [];
  public destino: any = [];
  public habilitado: boolean = true;
  public Posicion: any[] = [];
  public User: string = '';
  public Consulta1: any;
  public Consulta2: any;
  public Peso_Total_Remision: number = 0;
  public fecha = new Date();
  seleccionado = false;
  public Lista_Productos: any = [
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
  datosCabecera = {
    Titulo: 'Alistamiento',
    Fecha: new Date(),
    Codigo: '',
  };
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
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('CodigoBarra') CodigoBarra: ElementRef;
  @ViewChild('Peso_Balanza') Peso_Balanza: ElementRef;
  @ViewChild('modalBodega') modalBodega: any;
  @ViewChild('modalImagen') modalImagen: any;
  @ViewChild('confirmacionSalir') confirmacionSalir: any;
  public alertOptionMaterial: any = {};
  public alertOptionFase1: any = {};
  public alertOptionFase2: any = {};
  @ViewChild('FormFaseII') private FormFaseII: NgForm;
  headers = new HttpHeaders({
    Accept: 'text/plain',
  });
  Service: any;
  loading = true;
  public globales = environment;
  loadingTable = true;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private readonly swalService: SwalService,
    private readonly userService: UserService,
    // private _lightbox: Lightbox
  ) {
    this.User = userService.user.person.identifier;
    let id = this.route.snapshot.params['id'];

    this.http
      .get(this.globales.base_url + '/php/remision/remision.php', {
        params: { id: id },
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.remision = data.Remision;
        this.datosCabecera.Fecha = this.remision.Fecha;
        this.datosCabecera.Codigo = this.remision.Codigo;
        this.origen = data.Origen;
        if (data.Origen.Id_Bodega != '2' && data.Origen.Id_Bodega != '3') {
          this.display_Interna = 'block';
        }
        this.loading = false;
        this.validar(this.remision.Id_Remision);
        this.productos = data.Productos;
        this.destino = data.Destino;
        this.Paso = parseInt(this.remision.Estado_Alistamiento);

        this.Completo = true;
        // if (this.User == "1098712992") {
        //   if (this.Paso === 1) {
        //     if (localStorage.getItem("combo")) {
        //       this.balanza = JSON.parse(localStorage.getItem("combo"));
        //       this.Consulta1 = TimerObservable.create(0, 600)
        //         .takeWhile(() => this.alive)
        //         .subscribe(() => {
        //           this.http
        //             .get(this.globales.base_url + "php/alistamiento/peso.php", {
        //               params: { balanza: this.balanza },
        //             })
        //             .subscribe((data: any) => {
        //               this.Peso = data.Peso;
        //               this.HablilitarPesoSiguiente(this.Peso);
        //             });
        //         });
        //     } else {
        //       this.modalBodega.show();
        //     }
        //   }
        // }
      });
  }
  validar(remision) {
    let id = this.route.snapshot.params['id'];
    const productList = JSON.parse(localStorage.getItem('Lista_Producto_Inicial')) as Array<any>;

    if (
      parseInt(JSON.parse(localStorage.getItem('Id_Remision'))) == parseInt(id) &&
      productList?.length
    ) {
      this.Lista_Productos = productList;
      this.pos = JSON.parse(localStorage.getItem('posicion')) ?? 0;
      this.Peso_Total_Remision = JSON.parse(localStorage.getItem('Peso_Total_Remision'));
      this.loadingTable = false;
    } else {
      localStorage.setItem('Id_Remision', JSON.stringify(remision));
      this.Peso_Total_Remision = 0;
      this.pos = 0;
      this.http
        .get(this.globales.base_url + '/php/alistamiento/productos_remision.php', {
          params: { id: id },
        })
        .subscribe((res: any) => {
          const { data } = res;
          this.loadingTable = false;
          this.Lista_Productos = data.Productos;
          this.Peso_General = parseInt(data.Peso_General);
          this.Tolerancia_Global = parseInt(data.Tolerancia_Global);
          localStorage.setItem('Tolerancia', JSON.stringify(this.Tolerancia_Global));
        });
    }
  }
  ngOnInit() {}

  VerPantallaLista() {
    this.router.navigate(['alistamientos']);
  }
  focus() {
    setTimeout(() => {
      this.CodigoBarra.nativeElement.focus();
    }, 100);
  }
  ActualizarLista() {
    let id = this.route.snapshot.params['id'];
    this.http
      .get(this.globales.base_url + '/php/alistamiento/productos_remision.php', {
        params: { id: id },
      })
      .subscribe((res: any) => {
        const { data } = res;
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
    // this.Consulta1 = TimerObservable.create(0, 600)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {
    //     this.http
    //       .get(this.globales.base_url + "php/alistamiento/peso.php", {
    //         params: { balanza: this.balanza },
    //       })
    //       .subscribe((data: any) => {
    //         this.Peso = data.Peso;
    //         this.HablilitarPesoSiguiente(this.Peso);
    //       });
    //   });
  }

  Puntero() {
    this.focus();
  }
  HablilitarSiguiente(codigo) {
    let longitud = this.Lista_Productos.length;
    longitud = longitud - 1;
    if (this.Lista_Productos[this.pos]['Codigo_Validado'] === false) {
      if (codigo != '') {
        this.http
          .get(this.globales.base_url + '/php/alistamiento/consulta_codigo.php', {
            params: {
              codigo: codigo,
              id: this.Lista_Productos[this.pos].Id_Producto,
            },
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
              this.Lista_Productos[this.pos]['Clase'] = 'habilitado';
              (document.getElementById('CodigoBarra') as HTMLInputElement).value = '';
              localStorage.setItem('Lista_Producto_Inicial', JSON.stringify(this.Lista_Productos));
              localStorage.setItem('Tolerancia', JSON.stringify(this.Tolerancia_Global));
              if (this.pos < longitud) {
                this.pos += 1;
                localStorage.setItem('posicion', JSON.stringify(this.pos));
                this.Lista_Productos[this.pos]['Clase'] = 'noblur';
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
              this.confirmacionSwal.type = 'error';
              this.confirmacionSwal.show();
            }
          });
      }
    } else {
      (document.getElementById('fila' + this.pos) as HTMLInputElement).setAttribute(
        'class',
        'label-success',
      );
      this.pos += 1;
      (document.getElementById('CodigoBarra') as HTMLInputElement).value = '';
    }

    (document.getElementById('CodigoBarra') as HTMLInputElement).value = '';
  }

  open(index: number): void {
    let album = {
      src: this.globales.base_url + '/IMAGENES/PRODUCTOS/' + this.Lista_Productos[index].Imagen,
      caption: 'test',
      thumb: this.globales.base_url + '/IMAGENES/PRODUCTOS/' + this.Lista_Productos[index].Imagen,
    };
    this.albums.push(album);
    // override the default config
    // this._lightbox.open(this.albums, index);
  }
  QuitarObservable() {
    this.Consulta1.unsubscribe();
    if (localStorage.getItem('combo')) {
      this.balanza = JSON.parse(localStorage.getItem('combo'));
    } else {
      this.balanza = (document.getElementById('balanza') as HTMLInputElement).value;
    }
    this.Tolerancia_Global = parseInt(JSON.parse(localStorage.getItem('Tolerancia')));
    // this.Consulta2 = TimerObservable.create(0, 1000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {
    //     this.http
    //       .get(this.globales.base_url + "/php/alistamiento/peso_total.php", {
    //         params: { balanza: this.balanza },
    //       })
    //       .subscribe((data: any) => {
    //         this.Peso = data.Peso;
    //         this.PesoTotal(this.Peso);
    //       });
    //   });
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
        this.confirmacionSwal.type = 'success';
        this.confirmacionSwal.show();
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
          .get(this.globales.base_url + '/php/alistamiento/consultar_peso.php', {
            params: {
              id: this.Lista_Productos[this.pos1].Id_Producto_Remision,
            },
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
              this.confirmacionSwal.type = 'success';
              this.confirmacionSwal.show();
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
    if (this.Lista_Productos[i]['Validado'] === false) {
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
      }
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
    let datos = new FormData();
    datos.append('modulo', 'Remision');
    datos.append('id', id);
    datos.append('funcionario', this.User);
    this.http
      .post(this.globales.base_url + '/php/alistamiento/guardar_fase1.php', datos, {
        headers: this.headers,
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.swalService.show({
          icon: data.tipo,
          title: '',
          text: data.mensaje,
          showCancel: false,
        });
        this.router.navigate(['/inventario/alistamiento']);
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
    datos.append('funcionario', this.User);
    this.http
      .post(this.globales.base_url + '/php/alistamiento/guardar_material.php', datos, {
        headers: this.headers,
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.swalService.show({
          icon: data.tipo,
          title: '',
          text: data.mensaje,
          showCancel: false,
        });
      });
    localStorage.removeItem('Lista_Producto_Inicial');
    localStorage.removeItem('posicion');
    localStorage.removeItem('Tolerancia');
    localStorage.removeItem('Peso_Total_Remision');
  }
  GuardarFaseII(formulario: NgForm) {
    var id = this.route.snapshot.params['id'];
    let prod = JSON.stringify(this.Lista_Productos);
    let peso = this.Peso_Total;
    let datos = new FormData();
    datos.append('modulo', 'Remision');
    datos.append('id', id);
    datos.append('funcionario', this.User);
    datos.append('productos', prod);
    datos.append('peso', peso);
    //this.Consulta2.unsubscribe();
    this.http
      .post(this.globales.base_url + '/php/alistamiento/guardar_fase2.php', datos, {
        headers: this.headers,
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.swalService.show({
          icon: data.tipo,
          title: '',
          text: data.mensaje,
          showCancel: false,
        });
        this.router.navigate(['/inventario/alistamiento']);
        this.downloadZebra();
        localStorage.removeItem('Lista_Producto_Inicial');
        localStorage.removeItem('Tolerancia');
        localStorage.removeItem('Peso_Total_Remision');
      });
  }

  private downloadZebra() {
    const params = {
      id: this.remision.Id_Remision,
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .get(`${environment.base_url}/php/archivos/descarga_zebra.php`, {
        responseType: 'blob' as 'json',
        headers,
        params,
      })
      .subscribe({
        next: (file: any) => {
          downloadFile({ name: 'cebra', file });
        },
      });
  }

  showAlert(tipo: string) {
    if (tipo === 'Material') {
      const request = () => {
        this.GuardarMaterial();
      };
      this.swalService.swalLoading('Se dispone terminar la fase unica de alistamiento', request);
    } else if (tipo === 'Fase1') {
      const request = () => {
        this.GuardarFaseI();
      };
      this.swalService.swalLoading('Se dispone terminar la fase 1 de alistamiento', request);
    } else if (tipo === 'Fase2') {
      const request = () => {
        this.GuardarFaseII(this.FormFaseII);
      };
      this.swalService.swalLoading('Se dispone terminar la fase 2 del alistamiento', request);
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
}
