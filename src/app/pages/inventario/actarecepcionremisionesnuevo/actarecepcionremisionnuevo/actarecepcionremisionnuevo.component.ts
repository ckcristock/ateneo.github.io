import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Location, NgStyle } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CabeceraComponent } from '@app/components/cabecera/cabecera.component';
import { ProductosactarecepcionComponent } from './productosactarecepcion/productosactarecepcion.component';

@Component({
  selector: 'app-actarecepcionremisionnuevo',
  standalone: true,
  imports: [FormsModule, NgStyle, CabeceraComponent, ProductosactarecepcionComponent],
  templateUrl: './actarecepcionremisionnuevo.component.html',
  styleUrls: ['./actarecepcionremisionnuevo.component.scss'],
})
export class ActarecepcionremisionnuevoComponent implements OnInit {
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('confirmacionSalir') confirmacionSalir: any;
  @ViewChild('FormActa') FormActa: NgForm;
  public Datos: any = {};
  public Requerido: boolean = false;
  public Tratamientos: any[];
  public Lista_Productos: any[] = [];
  public user = JSON.parse(localStorage.getItem('User'));
  public Identificacion_Funcionario = this.user?.Identificacion_Funcionario;
  public Id_Remision = this.route.snapshot.params['id'];
  public Codigo_Rem = this.route.snapshot.params['codigo'];
  public punto_activo = localStorage.getItem('Punto');
  public display_No_Conforme = 'none';
  public NoConforme = 'No';
  public Tipo_Bodega = 'none';
  public Temperatura = '';
  public Observaciones = '';
  public Productos_Pendientes: any = [];
  globales = environment;
  datosCabecera = {
    Titulo: 'Acta de recepción',
    Fecha: new Date(),
    Codigo: '',
  };

  public alertOption: any = {};
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
  ) {
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a Generar esta Acta',
      showCancelButton: true,
      cancelButtonText: 'No, Dejame Comprobar!',
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      type: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.guardarActa(this.FormActa);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  ngOnInit() {
    this.http
      .get(this.globales.base_url + '/php/bodega/acta_recepcion_remision.php', {
        params: { id: this.route.snapshot.params['id'] },
      })
      .subscribe((res: any) => {
        const { data } = res;
        this.Datos = data.Datos;
        this.datosCabecera.Codigo = this.Datos.Codigo;
        this.Temperatura = data.Datos.Temperatura;
        if (data.Datos.Tipo_Bodega == 'REFRIGERADOS') {
          this.Tipo_Bodega = 'table-cell';
        }
        this.Lista_Productos = data.Productos;
        this.Productos_Pendientes = data.Productos_Pendientes;
      });
    this.http
      .get(this.globales.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Causal_No_Conforme' },
      })
      .subscribe((data: any) => {
        this.Tratamientos = data.filter(
          (data: any) =>
            data.Nombre.toUpperCase().includes('PRODUCTO') ||
            data.Nombre.toUpperCase().includes('DEVOLUCION') ||
            data.Nombre.toUpperCase().includes('TRANSPORTADORA'),
        );
      });
  }

  habilitarCampos(i) {
    var checkeado = (document.getElementById('check' + i) as HTMLInputElement).checked;
    switch (checkeado) {
      case true: {
        (document.getElementById('Id_Causal_No_Conforme' + i) as HTMLInputElement).required = false;
        (document.getElementById('Observaciones' + i) as HTMLInputElement).required = false;

        this.Lista_Productos[i].Checkeado = true;
        break;
      }
      case false: {
        (
          document.getElementById('Id_Causal_No_Conforme' + i) as HTMLInputElement
        ).style.visibility = 'visible';
        (document.getElementById('Observaciones' + i) as HTMLInputElement).style.visibility =
          'visible';
        this.display_No_Conforme = 'table-cell';
        (document.getElementById('Id_Causal_No_Conforme' + i) as HTMLInputElement).required = true;

        this.Lista_Productos[i].Checkeado = false;
        break;
      }
    }
  }

  ValidarCantidad(pos) {
    let cantidad = parseInt((document.getElementById('Cantidad' + pos) as HTMLInputElement).value);

    if (parseInt(this.Lista_Productos[pos].Cantidad) > cantidad) {
      this.Lista_Productos[pos].Cantidad_Ingresada = cantidad;
      this.Lista_Productos[pos].Seleccionado = '1';
      this.display_No_Conforme = 'table-cell';
      (document.getElementById('Observaciones' + pos) as HTMLInputElement).required = true;
      (document.getElementById('Id_Causal_No_Conforme' + pos) as HTMLInputElement).required = true;
      (document.getElementById('Observaciones' + pos) as HTMLInputElement).style.display = 'block';
      (document.getElementById('Id_Causal_No_Conforme' + pos) as HTMLInputElement).style.display =
        'block';
      this.Requerido = true;
      this.NoConforme = 'Si';
    } else if (parseInt(this.Lista_Productos[pos].Cantidad) < cantidad) {
      this.Lista_Productos[pos].Cantidad_Ingresada = '';
      this.confirmacionSwal.title = 'Error ';
      this.confirmacionSwal.text =
        'La cantidad recibida no puede ser superior a la cantidad enviada ';
      this.confirmacionSwal.type = 'error';
      this.confirmacionSwal.show();
    } else if (parseInt(this.Lista_Productos[pos].Cantidad) == cantidad) {
      this.Lista_Productos[pos].Seleccionado = '0';
    }
  }

  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNncc',
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

  guardarActa(formulario) {
    let punto = localStorage.getItem('Punto');
    let info = this.normalize(JSON.stringify(formulario.value));
    let prod = this.normalize(JSON.stringify(this.Lista_Productos));

    let datos = new FormData();

    datos.append('datos', info);
    datos.append('productos', prod);
    datos.append('punto', punto);

    this.http
      .post(this.globales.base_url + '/php/bodega_nuevo/guardar_acta_remision_dev.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSalir.title = data.titulo;
        this.confirmacionSalir.html = data.mensaje;
        this.confirmacionSalir.type = data.tipo;
        this.confirmacionSalir.show();
        setTimeout(() => {
          formulario.reset();
        }, 5000);
      });
  }

  VerPantallaLista() {
    this.location.back();
  }
}
