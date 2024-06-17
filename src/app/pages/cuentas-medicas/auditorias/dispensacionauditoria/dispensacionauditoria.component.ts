import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { Globales } from '../shared/globales/globales';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { ConfirmarauditoriaService } from 'src/app/pages/inventario/services/confirmarauditoria.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Globales } from 'src/app/pages/inventario/services/globales-datos';
import { ModalconfirmacionComponent } from './modalconfirmacion/modalconfirmacion.component';
import { UserService } from 'src/app/core/services/user.service';
import { skipContentType } from 'src/app/http.context';

// import { ActividadComponent } from 'src/app/pages/cuentas-medicas/auditorias/dispensacionauditoria/actividad/actividad.component';
import { Activity, ActivityComponent } from '@shared/components/activity/activity.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  standalone: true,
  imports: [
    ActivityComponent,
    // ActividadComponent,
    ModalconfirmacionComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    RouterModule,
    NotDataComponent,
  ],
  providers: [ConfirmarauditoriaService, Globales],
  selector: 'app-dispensacionauditoria',
  templateUrl: './dispensacionauditoria.component.html',
  styleUrls: ['./dispensacionauditoria.component.scss'],
})
export class DispensacionauditoriaComponent implements OnInit {
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  public eventsSubject: Subject<any> = new Subject<any>();
  public detalles: any = [];
  public productos: any[];
  public Nombre: any = [];
  public Soportes: any[] = [];
  public Imagen: any = [];
  public Mensaje: any = [];
  public Funcionario: any = [];
  public auditoria: any = [];
  public Mensajes = [
    {
      Nombre: '',
      Mensaje: '',
      Fecha: '',
    },
  ];
  public id: any = '';
  public Fecha;
  public Actividades: any = [];
  public Act: any = {
    Detalles: 'Se crea la auditoria',
    Fecha: '',
    Imagen: '',
    Estado: 'Creacion',
    Funcionario: '',
  };

  public reducer = (accumulator, currentValue) =>
    accumulator + parseInt(currentValue.Cantidad_Formulada);
  public reducer2 = (accumulator, currentValue) =>
    accumulator + parseInt(currentValue.Cantidad_Entregada);
  public cant_formulada = 0;
  public cant_entregada = 0;
  public cant_diferencia = 0;
  public environment: any;
  private Id_Auditoria: number;
  private Id_Funcionario: any;
  public DatosCabecera: any = {
    Titulo: 'Dispensación auditoría',
    Fecha: new Date(null),
    Codigo: '',
  };
  public Cargando = false;

  constructor(
    private confirmacion: ConfirmarauditoriaService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public globales: Globales,
    private readonly _user: UserService,
  ) {
    // this.Id_Funcionario= JSON.parse(localStorage.User);
    // this.Id_Funcionario=this.Id_Funcionario.Identificacion_Funcionario;
  }

  ngOnInit() {
    this.confirmacion.event.subscribe((data: any) => {
      if (data == 'Rechazar' || data == 'Aceptar') {
        this.getDetalleAuditoria();
      }
    });
    this.Id_Auditoria = this.route.snapshot.params['id'];
    this.getDetalleAuditoria();
    this.Id_Funcionario = this._user.user.id;
    this.environment = environment;
    this.scrollToTop();
    /*
    this.http.get(environment.ruta + 'php/dispensacion_auditoria/lista_chat.php', {
      params: { id: id, idfuncionario :this.Id_Funcionario }
    }).subscribe((data: any) => {
      this.Mensajes = data;
    }); */
  }
  getDetalleAuditoria() {
    this.Cargando = true;
    this.http
      .get(environment.ruta + 'php/auditorias/detalle_auditoria_dispensacion.php', {
        params: { id: this.Id_Auditoria },
      })
      .subscribe((data: any) => {
        this.auditoria = data?.Auditoria;
        // this.Act = {
        //   Fecha: data?.Auditoria?.Fecha_Preauditoria,
        //   Imagen: data?.Auditoria?.Imagen,
        //   Funcionario: data?.Auditoria?.FuncionarioPreauditoria,
        //   Detalles: 'Se crea la auditoria',
        //   Estado: 'Creacion',
        // };
        this.detalles = data?.Datos;
        this.DatosCabecera.Codigo = this.detalles?.Codigo;
        this.DatosCabecera.Fecha = this.detalles?.Fecha_Dis;

        this.productos = data?.Productos;

        this.Soportes = data?.Soportes;
        this.cant_formulada = parseInt(this.productos.reduce(this.reducer, 0));

        this.cant_entregada = this.productos.reduce(this.reducer2, 0);
        this.cant_diferencia = this.cant_formulada - this.cant_entregada;
        this.Actividades = data?.AcDispensacion;
        // this.Actividades.unshift(this.Act);
        this.Actividades = this.Actividades.map(
          (res) =>
            ({
              date: res.Fecha,
              description: res.Detalles,
              full_name: res.Funcionario,
              image: res.Imagen,
              title: '',
            }) as Activity,
        );
        this.Cargando = false;
        setTimeout(() => {
          // this.Actividades.unshift(this.Act);
        }, 500);
      });
  }

  EnviarMensaje() {
    // let Id_Auditoria = this.Id_Auditoria;
    var mensaje = (document.getElementById('Mensaje') as HTMLInputElement).value;
    // var funcionario_auditoria = JSON.parse(this.Id_Funcionario);
    // var temporal = this._user.user.id;
    var datosmensaje = {
      Mensaje: mensaje,
      Identificacion_Funcionario: this.Id_Funcionario,
      Id_Auditoria: this.Id_Auditoria,
    };

    let mens = JSON.stringify(datosmensaje);
    let datos = new FormData();
    datos.append('modulo', 'Mensaje');
    datos.append('mensaje', mens);
    this.http
      .post(environment.ruta + 'php/dispensacion_auditoria/guardar_chat.php', datos, {
        context: skipContentType(),
      })
      .subscribe((data: any) => {
        this.Mensaje = '';
        this.RefrescarVentana();
      });
  }
  RefrescarVentana() {
    // let id = this.route.snapshot.params['id'];
    this.Cargando = true;
    this.http
      .get(environment.ruta + 'php/dispensacion_auditoria/lista_chat.php', {
        params: { id: this.Id_Auditoria, idfuncionario: this.Id_Funcionario },
      })
      .subscribe((data: any) => {
        this.Mensajes = data;
        this.Cargando = false;
      });
  }

  AbrirModal1(value) {
    this.eventsSubject.next(value);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
