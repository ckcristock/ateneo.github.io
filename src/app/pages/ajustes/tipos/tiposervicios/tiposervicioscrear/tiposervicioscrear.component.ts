import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-tiposervicioscrear',
  templateUrl: './tiposervicioscrear.component.html',
  styleUrls: ['./tiposervicioscrear.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CardComponent,
  ],
})
export class TiposervicioscrearComponent implements OnInit {
  public Lista_Tipo_Soporte = [
    {
      Tipo_Soporte: '',
      Comentario: '',
      Pre_Auditoria: 'No',
      Auditoria: 'No',
    },
  ];

  public tiposervicio = {
    Nombre: '',
    Id_Servicio: '',
    Codigo_CIE: 'No',
    Nota: '',
    Tipo_Lista: 'No_Aplica',
  };

  public Campos_Cabecera: any[] = [
    {
      Nombre: '',
      Tipo: '',
      Requerido: 'No',
      Longitud: '',
      Tipo_Campo: 'Cabecera',
      Edicion: 0,
    },
  ];
  public Campos_Producto: any[] = [
    {
      Nombre: '',
      Tipo: '',
      Requerido: 'No',
      Longitud: '',
      Tipo_Campo: 'Producto',
      Edicion: 0,
      Fecha_Formula: 'No',
      Display: 'false',
      Dias: '0',
    },
  ];

  public Tipo_Campos: any = [
    {
      Nombre: 'Texto',
      Tipo: 'text',
    },
    {
      Nombre: 'Númerico',
      Tipo: 'number',
    },
    {
      Nombre: 'Fecha',
      Tipo: 'date',
    },
  ];

  public Servicios: any = [];
  public Modelo_Campos: any = [];
  public Id_Servicio_Editar: string = '';
  public Accion: string = 'Nuevo';
  public alertOption: SweetAlertOptions = {};
  public Display: boolean = false;

  public ContratosEscogidos: Array<any> = [];
  public ContratoSeleccionado: '';
  public Contratos: Array<any> = [];

  globales = environment;

  constructor(
    private http: HttpClient,
    private swalService: SwalService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.Id_Servicio_Editar = this.route.snapshot.params['id_tipo_servicio'];
    this.alertOption = {
      title: '¿Está Seguro?',
      text: 'Se dispone a guardar este tipo de servicio',
      showCancelButton: true,
      cancelButtonText: 'No, Comprobar!',
      confirmButtonText: 'Si, Guardar!',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarTipoServicioCrear();
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  private GetTipoServicio() {
    let id = this.route.snapshot.params['id_tipo_servicio'];

    this.http
      .get(this.globales.ruta + 'php/tiposervicios/detalle_tipo_servicio.php?id=' + id)
      .subscribe((data: any) => {
        this.tiposervicio = data.Tipo_Servicio;
        this.Lista_Tipo_Soporte = data.Soportes;
        this.Campos_Producto = data.Campos_Producto;
        this.Campos_Cabecera = data.Campos_Cabecera;
        this.InsertarCampos();
      });
  }

  InsertarCampos() {
    this.Campos_Cabecera.push({
      Nombre: '',
      Tipo: '',
      Requerido: 'No',
      Longitud: '',
      Tipo_Campo: 'Cabecera',
      Id_Campos_Tipo_Servicio: '',
      Edicion: 0,
    });
    this.Campos_Producto.push({
      Nombre: '',
      Tipo: '',
      Requerido: 'No',
      Longitud: '',
      Tipo_Campo: 'Producto',
      Id_Campos_Tipo_Servicio: '',
      Edicion: 0,
      Fecha_Formula: 'No',
      Display: 'false',
      Dias: '0',
    });
    this.Lista_Tipo_Soporte.push({
      Tipo_Soporte: '',
      Comentario: '',
      Pre_Auditoria: 'No',
      Auditoria: 'No',
    });
  }

  valuechange(i) {
    let pos = i + 1;
    if (this.Lista_Tipo_Soporte[pos] === undefined) {
      this.Lista_Tipo_Soporte.push({
        Tipo_Soporte: '',
        Comentario: '',
        Pre_Auditoria: 'No',
        Auditoria: 'No',
      });
    }
  }

  ngOnInit() {
    this.Listar_Contratos();
    this.Listar_Servicio();
    if (this.Id_Servicio_Editar != '0') {
      this.Accion = 'Editar';
      this.GetTipoServicio();
    }
  }

  Listar_Contratos() {
    this.http
      .get(this.globales.ruta + 'php/contrato/lista_contrato_select.php')
      .subscribe((data: any) => {
        this.Contratos = data;
      });
  }

  Listar_Servicio() {
    this.http.get(this.globales.ruta + 'php/tiposervicios/servicios.php').subscribe((data: any) => {
      this.Servicios = data;
    });
  }

  GuardarTipoServicioCrear() {
    // // console.log(formulario.value);
    if (this.ValidarModeloProducto() && this.ValidarModeloCabecera()) {
      let modelo = JSON.stringify(this.tiposervicio);
      this.AsignarCampos();

      console.log(this.Modelo_Campos);
      let contratos = JSON.stringify(this.ContratosEscogidos);
      let campos = JSON.stringify(this.Modelo_Campos);
      let soporte = JSON.stringify(this.Lista_Tipo_Soporte);
      let datos = new FormData();

      datos.append('contratos', contratos);
      datos.append('modelo', modelo);
      datos.append('campos', campos);
      datos.append('id_tipo_servicio', this.Id_Servicio_Editar);
      datos.append('tiposoporte', soporte);

      if (this.Id_Servicio_Editar == '0') {
        this.http
          .post(this.globales.ruta + 'php/tiposervicios/save_tipo_servicio.php', datos)
          .subscribe((data: any) => {
            if (data.codigo == 'success') {
              this.swalService.show(data);
              this.LimpiarModelos();
              this.VerPantallaLista();
            } else {
              this.swalService.show(data);
            }
          });
      } else {
        this.http
          .post(this.globales.ruta + 'php/tiposervicios/update_tipo_servicio.php', datos)
          .subscribe((data: any) => {
            if (data.codigo == 'success') {
              this.swalService.show(data);
              this.LimpiarModelos();
              setTimeout(() => {
                this.VerPantallaLista();
              }, 500);
            } else {
              this.swalService.show(data);
            }
          });
      }
    }
  }

  validarContratoCliente(ev) {
    let auditor = 0;
    for (let contratos = 0; contratos <= this.Contratos.length - 1; contratos++) {
      if (this.ContratosEscogidos.length > 0) {
        for (
          let contratosEscodigos = 0;
          contratosEscodigos <= this.ContratosEscogidos.length - 1;
          contratosEscodigos++
        ) {
          let item = this.Contratos.find(
            (contrato) => contrato.Id_Contrato == this.ContratoSeleccionado,
          );

          if (
            this.ContratoSeleccionado == this.ContratosEscogidos[contratosEscodigos].Id_Contrato ||
            item.Id_Cliente == this.ContratosEscogidos[contratosEscodigos].Id_Cliente
          ) {
            auditor = auditor + 1;
          }
        }

        if (auditor > 0) {
          // alert('ya existe este cliente')
          let swal = {
            codigo: 'error',
            mensaje: 'Cliente Duplicado',
            titulo: 'Error CLiente',
          };
          this.swalService.ShowMessage(swal);
          auditor = 0;
          break;
        } else {
          let item = this.Contratos.find(
            (contrato) => contrato.Id_Contrato == this.ContratoSeleccionado,
          );
          this.ContratosEscogidos.push(item);
          break;
        }
      } else {
        if (this.ContratoSeleccionado == this.Contratos[contratos].Id_Contrato) {
          this.ContratosEscogidos.push(this.Contratos[contratos]);
          break;
        }
      }
    }
  }

  EliminarContrato(index) {
    console.log(index);

    this.ContratosEscogidos.splice(index, 1);
  }

  LimpiarModelos() {
    this.Lista_Tipo_Soporte = [
      {
        Tipo_Soporte: '',
        Comentario: '',
        Pre_Auditoria: 'No',
        Auditoria: 'No',
      },
    ];

    this.Campos_Cabecera = [
      {
        Nombre: '',
        Tipo: '',
        Requerido: 'No',
        Longitud: '',
        Tipo_Campo: 'Cabecera',
        Modulo: '',
      },
    ];

    this.Campos_Producto = [
      {
        Nombre: '',
        Tipo: '',
        Requerido: 'No',
        Longitud: '',
        Tipo_Campo: 'Producto',
        Fecha_Formula: 'No',
        Display: 'false',
        Dias: '0',
      },
    ];
    this.tiposervicio = {
      Nombre: '',
      Id_Servicio: '',
      Codigo_CIE: 'No',
      Nota: '',
      Tipo_Lista: '',
    };
  }

  VerPantallaLista() {
    this.router.navigate(['/ajustes/tipos/tipos-servicio']);
  }

  ValidarModeloProducto() {
    if (this.Campos_Producto.length - 1 > 0) {
      for (let index = 0; index < this.Campos_Producto.length - 1; index++) {
        if (this.Campos_Producto[index].Nombre == '') {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'Debe llenar los campos de nombre de la lista Campos Producto',
          ]);
          return false;
        } else if (this.Campos_Producto[index].Tipo == '') {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'Debe llenar los campos de Tipo de la lista Campos Producto',
          ]);
          return false;
        } else if (this.Campos_Producto[index].Longitud == '') {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'Debe llenar los Longitud de Tipo de la lista Campos Producto',
          ]);
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }
  ValidarModeloCabecera() {
    if (this.Campos_Cabecera.length - 1 > 0) {
      for (let index = 0; index < this.Campos_Cabecera.length - 1; index++) {
        if (this.Campos_Cabecera[index].Nombre == '') {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'Debe llenar los campos de nombre de la lista Campos Cabecera',
          ]);
          return false;
        } else if (this.Campos_Cabecera[index].Tipo == '') {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'Debe llenar los campos de Tipo de la lista Campos Cabecera',
          ]);
          return false;
        } else if (this.Campos_Cabecera[index].Longitud == '') {
          this.swalService.ShowMessage([
            'warning',
            'Alerta',
            'Debe llenar los Longitud de Tipo de la lista Campos Cabecera',
          ]);
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  AsignarCampos() {
    let pos = this.Campos_Cabecera.length;
    let pos2 = this.Campos_Producto.length;
    this.Campos_Producto.splice(pos2 - 1, 1);
    this.Campos_Cabecera.splice(pos - 1, 1);
    this.Modelo_Campos = this.Campos_Cabecera.concat(this.Campos_Producto);
  }
  Agregar_Campos_Cabecera(pos, tipo) {
    var pos2 = pos + 1;
    if (tipo == 'Campos_Cabecera') {
      if (this.Campos_Cabecera[pos2] == undefined) {
        this.Campos_Cabecera.push({
          Nombre: '',
          Tipo: '',
          Requerido: 'No',
          Tipo_Campo: 'Cabecera',
          Edicion: 0,
        });
      }
    } else if (tipo == 'Campos_Producto') {
      if (this.Campos_Producto[pos2] == undefined) {
        this.Campos_Producto.push({
          Nombre: '',
          Tipo: '',
          Requerido: 'No',
          Tipo_Campo: 'Producto',
          Edicion: 0,
          Fecha_Formula: 'No',
          Display: 'false',
          Dias: '0',
        });
      }
    }
  }

  EliminarColumna(pos, tipo) {
    let pos2 = pos + 1;
    if (tipo == 'Campos_Producto') {
      if (this.Campos_Producto[pos2] != undefined) {
        this.Campos_Producto.splice(pos);
      }
    } else if (tipo == 'Campos_Cabecera') {
      if (this.Campos_Cabecera[pos2] != undefined) {
        this.Campos_Cabecera.splice(pos, 1);
      }
    }
  }

  EliminarColumnaSoporte(pos) {
    let pos2 = pos + 1;
    if (this.Lista_Tipo_Soporte[pos2] != undefined) {
      this.Lista_Tipo_Soporte.splice(pos, 1);
    }
  }
  MostarCampos(pos) {
    if (this.Campos_Producto[pos].Tipo == 'date') {
      this.Display = true;
      this.Campos_Producto[pos].Display = 'true';
    } else {
      this.Campos_Producto[pos].Display = 'false';
      pos = this.Campos_Producto.findIndex((x) => x.Tipo == 'date');
      if (pos < 0) {
        this.Display = false;
      }
    }
  }
  CambiarEstado(pos, tipo) {
    switch (tipo) {
      case 'Auditoria':
        // // console.log(this.Lista_Tipo_Soporte[pos].Auditoria);
        if (
          this.Lista_Tipo_Soporte[pos].Auditoria == 'No' ||
          this.Lista_Tipo_Soporte[pos].Auditoria == undefined
        ) {
          this.Lista_Tipo_Soporte[pos].Auditoria = 'Si';
        } else if (this.Lista_Tipo_Soporte[pos].Auditoria == 'Si') {
          this.Lista_Tipo_Soporte[pos].Auditoria = 'No';
        }
        break;
      case 'Pre_Auditoria':
        if (
          this.Lista_Tipo_Soporte[pos].Pre_Auditoria == 'No' ||
          this.Lista_Tipo_Soporte[pos].Auditoria == undefined
        ) {
          this.Lista_Tipo_Soporte[pos].Pre_Auditoria = 'Si';
        } else if (this.Lista_Tipo_Soporte[pos].Pre_Auditoria == 'Si') {
          this.Lista_Tipo_Soporte[pos].Pre_Auditoria = 'No';
        }
        break;
    }

    console.log(this.Lista_Tipo_Soporte[pos]);
  }

  CambiarEstadoCampo(modelo: any, tipo: string) {
    let datos = new FormData();
    let info = JSON.stringify(modelo);
    datos.append('modelo', info);
    datos.append('tipo', tipo);
    if (modelo.Longitud > 0) {
      this.http
        .post(this.globales.ruta + 'php/tiposervicios/cambiar_estado_campo.php', datos)
        .subscribe((data: any) => {
          if (data.codigo == 'success') {
            let toastObj = {
              textos: [data.titulo, data.mensaje],
              tipo: data.codigo,
              duracion: 4000,
            };
          } else {
            let toastObj = {
              textos: ['error', 'Ha ocurrido un error cambiando el estado'],
              tipo: 'warning',
              duracion: 4000,
            };
          }
        });
    } else {
      this.swalService.ShowMessage([
        'warning',
        'Alerta',
        'Debe Colocar una longitud mayor que cero',
      ]);
    }
  }

  onSaveInfo(): void {
    swal.fire(this.alertOption);
  }
}
