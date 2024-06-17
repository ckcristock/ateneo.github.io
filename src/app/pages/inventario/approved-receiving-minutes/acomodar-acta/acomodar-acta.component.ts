import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { PuntosPipe } from '../../../../core/pipes/puntos';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { FormsModule } from '@angular/forms';
import { NgIf, DecimalPipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { skipContentType } from '@app/http.context';

@Component({
  selector: 'app-acomodar-acta',
  templateUrl: './acomodar-acta.component.html',
  styleUrls: ['./acomodar-acta.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NotDataComponent,
    DecimalPipe,
    PuntosPipe,
    CabeceraComponent,
    TableComponent,
  ],
})
export class AcomodarActaComponent implements OnInit {
  public Fecha = new Date();
  public id = this.route.snapshot.params['id'];
  public TipoActa = this.route.snapshot.params['tipo'];
  public Lugar = this.route.snapshot.params['lugar'];
  public idLugar = this.route.snapshot.params['idLugar'];
  public Datos!: any;
  public Productos: any[] = [];

  public user = JSON.parse(localStorage.getItem('User'));
  public SubTotalFinal = 0;
  public IvaFinal = 0;
  public TotalFinal = 0;
  public ActividadesActa: any[] = [];

  public alertOption: SweetAlertOptions;
  public alertOptionGuardar: SweetAlertOptions;
  public reducer_subt = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Subtotal);
  public reducer_iva = (accumulator, currentValue) =>
    accumulator + parseFloat(currentValue.Subtotal) * (parseInt(currentValue.Impuesto) / 100);
  public Tipo = 'Bodega';
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('actaAcomodadaSwal') actaAcomodadaSwal: any;
  @ViewChild('inventarioSwal') inventarioSwal: any;

  @ViewChild('codigos') codigoEstibas: any;
  @ViewChild('CodigoBarra') CodigoBarra: Array<ElementRef>;

  headData = {
    Titulo: 'Acta de recepción',
    Fecha: new Date(),
    Codigo: '',
    CodigoFormato: '',
  };

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router,
    private readonly userService: UserService,
    private readonly swalService: SwalService,
  ) {
    this.user = this.userService.user.person.identifier;
    this.alertOption = {
      title: 'Operación exitosa',
      text: 'Se han acomodado e ingresado correctamente el acta al inventario',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      showLoaderOnConfirm: true,
      allowEscapeKey: false,
      icon: 'success',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.redireccionar();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
    this.alertOptionGuardar = {
      title: '¿Está Seguro?',
      text: 'Se dispone a acomodar los productos en las estibas e ingresarlos al inventario',
      showCancelButton: true,
      confirmButtonText: 'Si, Acomodar',
      cancelButtonText: 'No, Dejame Comprobar!',
      showLoaderOnConfirm: true,
      icon: 'warning',

      preConfirm: () => {
        return new Promise((resolve) => {
          this.validarProductos();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges {
    let queryParams = this.route.snapshot.queryParams;
    let params: any = {};
    params.id = this.id;
    params.Tipo_Acta = this.TipoActa;
    params.Lugar = this.Lugar;
    params.idLugar = this.idLugar;
    this.http
      .get(environment.base_url + '/php/bodega_nuevo/detalle_acta_recepcion_acomodar.php', {
        params: params,
      })
      .subscribe((res: any) => {
        this.Datos = res.data.Datos;
        this.headData.Codigo = this.Datos.Codigo;
        this.Productos = res.data.Productos;
        this.loading = false;
        this.varlidarBodegaEnInventario();
      });
  }

  focus() {
    let codigos = document.getElementsByName('CodigoBarra');
    for (let index = 0; index < codigos.length; index++) {
      if (!this.Productos[index]['Id_Estiba']) {
        codigos[index].focus();
        break;
      }
    }
  }
  Puntero() {
    this.focus();
  }
  acomodarProductos() {
    let datos = new FormData();

    datos.append('id', this.id);
    datos.append('funcionario', this.user);
    datos.append('productos', JSON.stringify(this.Productos));
    datos.append('tipo_acta', this.TipoActa);
    datos.append('id_bodega_nuevo ', this.Datos.Id_Bodega_Nuevo);
    datos.append('id_punto_dispensacion', this.Datos.Id_Punto_Dispensacion);

    if (this.Datos.Cambio_Estiba) {
      datos.append('cambio_estiba', '1');
    }

    this.http
      .post(environment.base_url + '/php/actarecepcion_nuevo/acomodar_acta.php', datos, {
        context: skipContentType(),
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.swalService.show({
          title: data.Titulo,
          text: data.Mensaje,
          icon: data.Tipo,
          showCancel: false,
        });
      });
  }
  validarProductos() {
    for (const producto of this.Productos) {
      if (producto.Id_Estiba == '' || producto.Id_Estiba == undefined) {
        this.swalService.show({
          title: 'Productos inválidos',
          text: '¡Existen productos a los que no se les ha asignado una estiba, por favor verifique!',
          icon: 'error',
        });
        return false;
      }
    }

    this.acomodarProductos();
  }
  validarEstiba(elemento, codigo: string) {
    //validar si es ajuste cambio estiba * por ende la estiba debe ser obligatoriamente la ingresada en el mismo
    if (
      typeof elemento['Codigo_Barras_Estiba_Ajuste'] != 'undefined' &&
      elemento['Codigo_Barras_Estiba_Ajuste']
    ) {
      if (elemento.Codigo_Barras_Estiba_Ajuste == codigo.toUpperCase()) {
        elemento['Id_Estiba'] = elemento.Id_Estiba_Ajuste;
      } else {
        if (elemento['Id_Estiba']) {
          elemento['Id_Estiba'] = '';
        }
        elemento['Codgo_Barras_Estiba'] = '';
        this.swalService.error(
          'Error al seleccionar estiba',
          'La estiba que itenta seleccionar no coincide con la seleccionada en el ajuste',
        );
      }
    } else {
      let Lugar = this.Lugar;
      let idLugar = this.idLugar;
      this.http
        .get(environment.base_url + '/php/bodega_nuevo/validar_estiba.php', {
          params: { codigo_barras: codigo, idLugar, Lugar },
        })
        .subscribe((res: any) => {
          const { data } = res;
          if (data.Tipo == 'success') {
            elemento['Id_Estiba'] = data.Estiba.Id_Estiba;
          } else {
            if (elemento['Id_Estiba']) {
              elemento['Id_Estiba'] = '';
            }
            elemento['Codgo_Barras_Estiba'] = '';
          }
          this.swalService.show({
            title: data.Titulo,
            icon: data.Tipo,
            text: data.Mensaje,
            showCancel: false,
          });
          this.focus();
        });
    }
  }
  async varlidarBodegaEnInventario() {
    if (this.Datos.Id_Origen_Destino != '') {
      await this.http
        .get(`${environment.base_url}/php/bodega_nuevo/validar_bodega_en_inventario.php`, {
          params: { Id_Bodega_Nuevo: this.Datos.Id_Origen_Destino },
        })
        .toPromise()
        .then((data: any) => {
          if (data.type == 'error') {
            this.swalService.error(data.title, data.message);
            this.Datos.Id_Origen_Destino = '';
          }
        });
    }
  }
  redireccionar() {
    let dir =
      this.Lugar == 'Punto_Dispensacion'
        ? '/actarecepcionaprobadospuntos'
        : '/inventario/acta-recepcion-aprobados';
    this.router.navigate([dir]);
  }

  onSaveProduct(): void {
    const request = () => {
      this.validarProductos();
    };
    this.swalService.swalLoading(
      'Se dispone a acomodar los productos en las estibas e ingresarlos al inventario.',
      request,
    );
  }
}
