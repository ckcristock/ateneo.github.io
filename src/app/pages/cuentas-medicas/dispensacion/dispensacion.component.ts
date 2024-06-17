import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globales } from 'src/app/pages/inventario/services/globales-datos';
import { CommonModule, DatePipe } from '@angular/common';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalactaentregaComponent } from '../dispensaciones/modalactaentrega/modalactaentrega.component';
import { skipContentType } from 'src/app/http.context';
import { UserService } from 'src/app/core/services/user.service';
import { ActividadComponent } from 'src/app/pages/cuentas-medicas/auditorias/dispensacionauditoria/actividad/actividad.component';
import { Activity, ActivityComponent } from '@shared/components/activity/activity.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { CabeceraComponent } from 'src/app/components/cabecera/cabecera.component';
import { NotDataSaComponent } from 'src/app/components/not-data-sa/not-data-sa.component';

@Component({
  standalone: true,
  imports: [
    CabeceraComponent,
    TableComponent,
    ModalactaentregaComponent,
    ActividadComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    NgbDropdownModule,
    ActivityComponent,
    NotDataSaComponent,
  ],
  providers: [Globales, Router],
  selector: 'app-dispensacion',
  // moduleId: module.id,
  templateUrl: './dispensacion.component.html',
  styleUrls: ['./dispensacion.component.scss'],
})
export class DispensacionComponent implements OnInit {
  // @ViewChild("confirmacionGuardar") public guardarDisSwal: SwalComponent;

  public Cargando = false;
  public cambiosDispensacion = false;
  public editarDisp = false;
  public detalles: any = [];
  public productos: any[];
  public reclamante: any;
  public acdisp: any[];
  public punto_activo = '';
  public Punto: any = {};
  public Soportes: any[] = [];
  public Auditoria: any = {
    Id_Auditoria: '',
    Archivo: '',
  };
  public Factura: any = {};
  public Mostrar = false;

  public reducer = (accumulator, currentValue) =>
    accumulator + parseInt(currentValue.Cantidad_Formulada);
  public reducer2 = (accumulator, currentValue) =>
    accumulator + parseInt(currentValue.Cantidad_Entregada);
  public cant_formulada = 0;
  public cant_entregada = 0;
  public cant_diferencia = 0;
  public environ: any;
  private funcionarioId = this._user.user.id;
  // public alertOption: SweetAlertOptions = {};
  public idDispensacion: any;
  public DatosCabecera: any = {
    Titulo: 'Dispensación auditoría',
    Fecha: new Date(null),
    Codigo: '',
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private datePipe: DatePipe,
    private _swalService: SwalService,
    private readonly _user: UserService,
  ) {
    // this.alertOption = {
    //   title: '¿Está Seguro?',
    //   text: 'Se dispone a Realizar cambios en la Dispensación',
    //   showCancelButton: true,
    //   cancelButtonText: 'No, Dejame Comprobar!',
    //   confirmButtonText: 'Si, Guardar',
    //   showLoaderOnConfirm: true,
    //   focusCancel: true,
    //   type: "info",
    //   preConfirm: () => {
    //     return new Promise((resolve) => {
    //       this.guardarDispensacion();
    //     });
    //   },
    //   allowOutsideClick: () => !swal.isLoading(),
    // };
  }
  detalleDispensacion() {
    this.Cargando = true;
    this.cambiosDispensacion = false;
    // let id = this.route.snapshot.params['id'];
    this.idDispensacion = this.route.snapshot.params['id'];
    this.http
      .get(environment.base_url + '/php/dispensaciones/detalle_dispensacion.php', {
        params: { id: this.idDispensacion },
      })
      .subscribe((data: any) => {
        this.detalles = data.Datos;
        this.DatosCabecera.Codigo = this.detalles?.Codigo;
        this.DatosCabecera.Fecha = this.detalles?.Fecha_Dis;
        this.reclamante = data.Reclamante;
        this.punto_activo = this.detalles?.Id_Punto_Dispensacion;
        this.Auditoria = data.Auditoria;
        this.Soportes = data.Soportes || [];
        this.Cargando = false;
        this.http
          .get(environment.ruta + 'php/genericos/detalle.php', {
            params: { modulo: 'Punto_Dispensacion', id: this.punto_activo },
          })
          .subscribe((data: any) => {
            this.Punto = data;
          });
        this.productos = data.Productos;
        this.acdisp = data.AcDispensacion;
        this.acdisp = data.AcDispensacion.map(
          (res) =>
            ({
              date: res.Fecha,
              description: res.Detalle,
              full_name: res.Nombre,
              image: res.Imagen,
              title: '',
            }) as Activity,
        );

        this.cambiosDispensacion = false;
        if (data.Factura)
          if (data.Factura.Nombre) {
            this.Mostrar = true;
            this.Factura = data.Factura;
          }
        this.actualizarSumas();
        if (
          !(data?.Datos?.Estado_Dispensacion == 'Anulada') &&
          data?.Auditoria.Estado == 'Aceptar'
        ) {
          this.EditarDis();
        }
      });
  }
  ngOnInit() {
    this.detalleDispensacion();
    this.environ = environment;
  }

  actualizarSumas() {
    this.cant_formulada = parseInt(this.productos.reduce(this.reducer, 0));
    this.cant_entregada = this.productos.reduce(this.reducer2, 0);
    this.cant_diferencia = this.cant_formulada - this.cant_entregada;
  }

  verificarCambios() {
    let cambio = false;
    this.productos.forEach((p) => {
      if (p.Cantidad_Formulada != p.Cantidad_Formulada_Total) {
        cambio = true;
      }
    });
    this.cambiosDispensacion = cambio;
  }

  EditarDis() {
    let funcionario = this.funcionarioId;
    let params = new FormData();
    params.append('id', funcionario);
    params.append('modulo', 'Dispensaciones');

    this.http
      .post(environment.ruta + '/php/tablero/detalle_perfil.php', params, {
        context: skipContentType(),
      })
      .subscribe((data) => {
        this.editarDisp = data[0].Editar == '1' ? true : false;
      });
    // return false;
  }
  guardarDispensacion() {
    let funcionario = this._user.user.id;
    let productos = JSON.stringify(this.productos);
    let params = new FormData();
    params.append('funcionario', funcionario);
    params.append('productos', productos);
    params.append('metodo', 'Editar');

    // let payload = { funcionario: funcionario, productos: this.productos };

    let url = environment.ruta + '/php/dispensaciones/guardar_dispensacion.php';

    this.http
      .post(url, params, {
        context: skipContentType(),
      })
      .subscribe(
        (data: any) => {
          if (data.Actividad.includes('Guardada')) {
            this._swalService.ShowMessage(['success', 'Guardado', 'Dispensacion modificada']);
            this.detalleDispensacion();
          } else {
            this._swalService.ShowMessage(['success', 'Guardado', 'No se guardaron cambios']);
          }
        },
        (e) => {
          this._swalService.ShowMessage([
            'error',
            'No Guardado',
            'No se guardaron cambios ' + e.status,
          ]);
        },
      );
  }

  confirmarGuardar() {
    this._swalService
      .confirm('Te dispones a realizar cambios en la dispensación')
      .then((result) => {
        // Verifica si el usuario confirmó la anulación
        if (result.isConfirmed) {
          // Llama a la función para suspender la dispensación
          this.guardarDispensacion();
        }
      });
  }
}
