/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, ViewChild } from '@angular/core';

import {
  UntypedFormGroup,
  NgForm,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core';
import { HttpClient } from '@angular/common/http';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { ActividadesService } from './actividades.service';
import { Actividad } from 'src/app/core/models/actividad.model';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { CompanyService } from '../../ajustes/informacion-base/services/company.service';
import { PersonService } from '../../ajustes/informacion-base/services/person/person.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { consts } from 'src/app/core/utils/consts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';
import { GroupCompanyService } from 'src/app/shared/services/group-company.service';
import { ViewActivityComponent } from './components/view-activity/view-activity.component';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgFor, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TiposActividadesComponent } from './components/tipos-actividades/tipos-actividades.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss'],
  standalone: true,
  imports: [
    FullCalendarModule,
    TiposActividadesComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgIf,
    TextFieldModule,
    SearchPipe,
  ],
})
export class ActividadesComponent {
  @ViewChild('add') add: any;

  DAYS_OF_WEEK = [...consts.diasSemana];

  daysOfWeek = [];

  Id_Dependencia = 1;
  locales = [esLocale];
  Departamentos: any = [];
  Municipios: any = [];
  Actividades: Array<any> = [];

  userLogin: string;
  userLogin1: any;
  userDepen: string;

  Ver: boolean = false;
  ver: number = 0;
  FuncionariosSele: any[] = [];

  DataActivities: Array<any> = [];
  TiposActividad: Array<any> = [];
  ActividadModel = new Actividad();

  cliente_seleccionado: any = '';
  funcionario_seleccionado: any = '';
  Funcionarios: any[] = [];
  id_activity: any;
  alertOption: any = {};
  private eventoActividad: any;
  eventsModel: any;

  breadCrumbItems: Array<object>;

  // event form
  formData: UntypedFormGroup;
  formEditData: UntypedFormGroup;

  // Form submition value
  submitted: boolean;

  // Form category data
  category: Event[];

  // Date added in event
  newEventDate: Date;

  // Edit event
  editEvent: EventInput;

  // Delete event
  deleteEvent: EventInput;

  calendarWeekends: boolean = true;
  // show events
  calendarEvents: EventInput[];

  date = new Date();

  // calendar plugin
  calendarPlugins = [
    dayGridPlugin,
    bootstrap5Plugin,
    timeGrigPlugin,
    interactionPlugin,
    listPlugin,
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    //plugins: [dayGridPlugin],
    headerToolbar: {
      left: 'prevYear,prev,next,nextYear today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    plugins: this.calendarPlugins,
    eventResizableFromStart: true,
    dayMaxEventRows: true,
    weekends: this.calendarWeekends,
    dateClick: this.accionarEvento.bind(this),
    eventClick: this.accionarEvento.bind(this),
    eventDisplay: 'block',
    themeSystem: 'bootstrap5',
    locales: this.locales,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: true,
    },
  };

  companies: any[] = [];
  groups: any[] = [];
  dependencies: any[] = [];
  editar: boolean = false;

  searchPerson: string = '';

  rangeDatePicker = true;

  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    private http: HttpClient,
    private _actividad: ActividadesService,
    private _dependecies: DependenciesService,
    private _group: GroupService,
    private _company: CompanyService,
    private _person: PersonService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private _modal: ModalService,
    private readonly groupCompanyService: GroupCompanyService,
  ) {
    this.GetTiposActividad();
  }
  ngOnInit(): void {
    this.getGroups();
    /*  this.http.get(this.globales.base_url + '/php/lista_generales.php', { params: { modulo: 'Grupo' } }).subscribe((data: any) => {
       this.Grupos = data;
     }); */
    this.GetActividadesMes();
    this.setDayOfWeek([this.date.getDay()]);
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.handleDate(r.start, r.end);
      }
    });
    //alert(`i'm here`);
  }

  closeResult = '';
  public openConfirm(confirm: any): void {
    this.modalService
      .open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        () => {
          this.closeResult = `Dismissed ${this.getDismissReason()}`;
        },
      );
  }
  getDismissReason(): void {
    this.LimpiarModelo();
    this.cliente_seleccionado = '';
  }

  GetActividadesMes(): void {
    this._actividad.getActivities().subscribe((r: any) => {
      this.calendarEvents = r.data;
    });
    this.DataActivities = [];
    this.Actividades = [];
    setTimeout(() => {
      this.eventsModel = this.DataActivities;
    }, 1000);
  }

  handleDate(start, end): void {
    const setRangeDate = (from: any, to: any) => {
      this.ActividadModel.Fecha_Inicio = `${from.year}-${from.month + 1}-${from.date}`;
      this.ActividadModel.Fecha_Fin = `${to.year}-${to.month + 1}-${to.date}`;
    };
    if (this.editar) {
      setRangeDate(start._i, end._i);
      return;
    }
    const from = start._i;
    const to = end._i;
    setRangeDate(from, to);
    this.handleSetDayName(start._d, end._d);
  }

  private handleSetDayName(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start <= end) {
      this.daysOfWeek = [];
      const totalDays: number[] = [];
      let currentDate = new Date(start);

      while (currentDate <= end) {
        if (totalDays.length >= 7) break;
        totalDays.push(currentDate.getDay());
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.setDayOfWeek(totalDays);
    }
  }

  private setDayOfWeek(days: number[]): void {
    days.sort();
    if (days[0] === 0) {
      days.shift();
      days.push(0);
    }
    const sunday = this.DAYS_OF_WEEK.length - 1;
    days.forEach((day) => {
      const indexDay = day - 1;
      this.daysOfWeek.push(this.DAYS_OF_WEEK[day === 0 ? sunday : indexDay]);
    });
  }

  SetCalendarData(): void {
    this.DataActivities = [];
    this.userLogin1 = 1;
    this.Actividades.forEach((actividad) => {
      if (this.userLogin1 == 9) {
        const calendarObj = {
          id: parseInt(actividad.Id_Actividad_Recursos_Humanos),
          // title: actividad.Actividad_Recursos_Humanos,
          description: actividad.NombreDependencia,
          start: actividad.Fecha_Inicio,
          end: actividad.Fecha_Fin,
          color: actividad.Color,
        };
        this.DataActivities.push(calendarObj);
      }
      if (this.userLogin1 == actividad.Id_Dependencia) {
        const calendarObj = {
          id: parseInt(actividad.Id_Actividad_Recursos_Humanos),
          title: actividad.Actividad_Recursos_Humanos,
          description: actividad.NombreDependencia,
          start: actividad.Fecha_Inicio,
          end: actividad.Fecha_Fin,
          color: actividad.Color,
        };
        this.DataActivities.push(calendarObj);
      }
    });
  }

  private getGroups(): void {
    this.groupCompanyService.getGroupCompany().subscribe({
      next: (res) => {
        this.groups = res.data;
        this.groups.unshift({ value: 0, text: 'Todos' });
      },
    });
  }

  getDependencies(): void {
    if (!this.groups.length || !this.ActividadModel.Id_Grupo) {
      if (!this.editar) this.ActividadModel.Id_Dependencia = null;
      const dependencies = this.groups
        .filter((datum) => datum.value != 0)
        .map((datum) => datum.dependencies)
        .flat(1);
      this.dependencies = [{ text: 'Todas', value: 0 }, ...dependencies];
      this.Dependencia_Cargo();
      return;
    }
    this.Dependencia_Cargo();
    const { dependencies } = this.groups.find(
      (group) => group.value === +this.ActividadModel.Id_Grupo,
    );
    this.dependencies = [{ value: 0, text: 'Todas' }, ...dependencies];
  }

  getCompanies(): void {
    this._company.getCompanies().subscribe((d: any) => {
      this.companies = d.data;
      /*  d.data[0]
         ? this.formCompany.patchValue({ company_id: d.data[0].value })
         : ''; */
    });
  }

  GetTiposActividad(): void {
    this._actividad.getActivityTypesActives().subscribe((r: any) => {
      if (r?.data) {
        this.TiposActividad = r.data;
      }
    });
  }
  GuardarTipoActividad(form: NgForm): void {
    this._actividad.saveActivityType(form.value).subscribe((r: any) => {
      if (r.code == 200) {
        form.reset();
        this.GetTiposActividad();
        this._swal.show({
          title: 'Operación exitosa',
          text: 'Se ha guardado correctamente',
          icon: 'success',
        });
        this.modalService.dismissAll();
      }
    });
  }
  CambiarEstadoTipo(id: any, state: any): void {
    this._actividad.setActivityType({ id, state }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          title: 'Operación exitosa',
          text: 'Se ha cambiado el estado',
          icon: 'success',
        });
        this.GetTiposActividad();
      }
    });
  }
  ////////////////FIN FUNCIONES TIPO////////////////////////

  async GuardarActividad(form: NgForm): Promise<void> {
    try {
      await this._swal.confirm(
        this.editar ? 'Vamos a actualizar la actividad' : 'Vamos a guardar la actividad',
        {
          preConfirm: () => {
            return this.saveActivity(form);
          },
          showLoaderOnConfirm: true,
        },
      );
      this._swal.show({
        text: '¡Proceso exitoso!',
        title: this.editar == true ? 'Actualizado con éxito' : 'Guardado con éxito',
        icon: 'success',
        showCancel: false,
        timer: 1000,
      });
    } catch (error) {
      this._swal.hardError();
    }
  }

  saveActivity(form) {
    return new Promise((resolve) => {
      if (form.value.people_id[0] == 0) form.value.people_id = [0];
      const body = {
        date_start: this.ActividadModel.Fecha_Inicio,
        date_end: this.ActividadModel.Fecha_Fin,
        ...form.value,
      };
      if (this.editar) {
        form.value.days = [];
        body.id = this.actividadObj.id;
      }
      this._actividad.saveActivity(body).subscribe(
        () => {
          this.CerrarModal();
          this.GetActividadesMes();
          resolve(true);
        },
        (error) => {
          this._swal.hardError();
          resolve(false);
        },
      );
    });
  }

  CerrarModal(): void {
    this.LimpiarModelo();
    this.modalService.dismissAll();
    this.cliente_seleccionado = '';
  }
  search_funcionario: any = [];
  AsignarFuncionario(): void {
    if (typeof this.funcionario_seleccionado == 'object') {
      this.ActividadModel.Identificacion_Funcionario =
        this.funcionario_seleccionado.Identificacion_Funcionario;
    } else {
      this.ActividadModel.Identificacion_Funcionario = '';
    }
  }

  LimpiarModelo(): void {
    this.FuncionariosSele = [];
    this.ActividadModel = new Actividad();
  }
  editarEvento(): void {
    this.rangeDatePicker = false;
    const data = this.actividadObj;
    this.ActividadModel.id = this.id_activity;
    this.ActividadModel.Id_Actividad_Recursos_Humanos = data.id;
    this.ActividadModel.Fecha_Inicio = moment.utc(data.date_start).format('YYYY-MM-DD');
    //.format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.ActividadModel.Fecha_Fin = moment.utc(data.date_end).format('YYYY-MM-DD');
    this.ActividadModel.Id_Tipo_Actividad_Recursos_Humanos = data.rrhh_activity_type_id;
    this.ActividadModel.Detalles = data.description;
    this.ActividadModel.Actividad_Recursos_Humanos = data.name;
    /*  this.ActividadModel.Funcionario_Asignado        =*/
    this.ActividadModel.Id_Grupo = data.group_id;
    this.ActividadModel.Id_Dependencia = data.dependency_id;

    this.ActividadModel.Hora_Inicio = data.hour_start;
    this.ActividadModel.Hora_Fin = data.hour_end;

    /*  this.FuncionariosSelec(data.Id_Actividad_Recursos_Humanos); */
    this.getDependencies();
    this.verificarUser();
    if (this.ver) this.openViewActivity();
    else this.openConfirm(this.add);
    this.verificarUser();
    this.FuncionariosSelec(this.ActividadModel.Id_Actividad_Recursos_Humanos);
    this.Grupo_Dependencia(this.ActividadModel.Id_Grupo);
    this.Dependencia_Cargo();
  }

  private openViewActivity(): void {
    const modalRef = this.modalService.open(ViewActivityComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.data = {
      ...this.actividadObj,
      group: this.groups.find((g) => g.value === this.actividadObj.group_id)?.text,
    };
  }

  verificarUser(): void {
    /*     let id = this.eventoActividad.detail.event.id;
        this.userLogin = (JSON.parse(localStorage.getItem("User"))).Id_Dependencia */
    /*  this._actividad.getActividadById(id).subscribe((data:any) => {
       if(this.userLogin != data.Id_Dependencia){
         this.Ver = false;
       }else{
         this.Ver = false;
      }
     }) */
  }
  FuncionariosSelec(id: string): void {
    this._actividad.getPeopleActivity(id).subscribe((r: any) => {
      this.FuncionariosSele = r.data;
      if (r.data) {
        this.ActividadModel.Funcionario_Asignado = this.FuncionariosSele.reduce((acc, el) => {
          return [...acc, el.person.id];
        }, []);
      } else {
        this.ActividadModel.Funcionario_Asignado = ['0'];
      }
    });
  }
  anularDia(): void {
    const id = this.actividadObj.id;
    this._actividad.cancelActivity(id).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          text: 'Día anulado correctamente',
          title: 'Operación exitosa',
          icon: 'success',
          showCancel: false,
          timer: 1000,
        });
      }
      this.GetActividadesMes();
    });
  }

  cancelCycle(): void {
    const code = this.actividadObj.code;
    this._actividad.cancelCycleActivity(code, { state: 'Anulada' }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          text: 'Ciclo anulado correctamente',
          title: 'Operación exitosa',
          icon: 'success',
          showCancel: false,
          timer: 1000,
        });
      }
      this.GetActividadesMes();
    });
  }

  // funcion que no desabilita los input
  agregarEvento(): void {
    this.ver = 0;
    this.editar = false;
    this.rangeDatePicker = true;
    /* this.userLogin = (JSON.parse(localStorage.getItem("User"))).Id_Grupo
    this.userDepen = (JSON.parse(localStorage.getItem("User"))).Id_Dependencia */
    this.Grupo_Dependencia(this.userLogin);
    this.ActividadModel.Id_Grupo = this.userLogin;
    this.ActividadModel.Id_Dependencia = this.userDepen;
    this.Dependencia_Cargo();
    /* this.ver = 1; */
    // this.cambiarReadonli();
  }
  accionEvento(accion: string): void {
    /* this.confirmacionAccion.nativeSwal.close(); */
    switch (accion) {
      case 'Ver':
        this.editar = true;
        this.ver = 1;
        this.editarEvento();
        break;
      case 'Editar':
        this.editar = true;
        this.ver = 0;
        this.editarEvento();
        break;
      case 'Anular':
        this.cancelOptions();
        // this.anularEvento();
        break;
    }
  }

  cancelOptions(): void {
    Swal.fire({
      title: 'Anular la actividad',
      icon: 'question',
      showCancelButton: true,
      input: 'select',
      confirmButtonColor: '#333C7E',
      confirmButtonText: 'Continuar',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      inputOptions: {
        cancelAll: 'Anular ciclo',
        cancelDay: 'Anular día',
      },
      inputPlaceholder: 'Seleccionar...',
    }).then((result) => {
      if (result.value) {
        const request = () => {
          result.value == 'cancelDay' ? this.anularDia() : this.cancelCycle();
        };
        this._swal.swalLoading('Vamos a anular la actividad', request);
      }
    });
  }

  actividadObj: any = {};
  accionarEvento(event: { event: { _def: { publicId: any } } }): void {
    //console.log("hola", event)
    if (event.event) {
      const id = event.event._def.publicId;
      this.actividadObj = this.calendarEvents.find((x) => x.id == id);
      this.id_activity = id;
      if (this.actividadObj.state != 'Anulada') {
        this.eventoActividad = event;
        Swal.fire({
          title: 'Elige una acción',
          text: '',
          icon: 'question',
          showCancelButton: true,
          input: 'select',
          confirmButtonColor: '#3849CA',
          confirmButtonText: 'Continuar',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          inputOptions: {
            Ver: 'Ver',
            Editar: 'Editar',
            Anular: 'Anular',
          },
          inputPlaceholder: 'Seleccionar...',
        }).then((result) => {
          if (result.value) {
            this.accionEvento(result.value);
          }
        });

        /*  accionEvento */
      }
    }
  }
  Grupo_Dependencia(Grupo: any): void {
    if (Grupo) {
      const a = 1 + 1;
      a.toFixed();
    }
    /* if (Grupo == "Todas") {
      this.ActividadModel.Id_Dependencia = "Todas";
      this.ActividadModel.Funcionario_Asignado = "Todas";
    } else {
       this.http.get(this.globales.ruta + 'php/alertas/alerta_grupo_dependencia.php', { params: { id: Grupo } }).subscribe((data: any) => {
       this.Dependencias = data;
       });
    } */
  }

  Dependencia_Cargo(): void {
    let params: any = {};
    if (this.ActividadModel.Id_Grupo) params.group_id = +this.ActividadModel.Id_Grupo;
    if (this.ActividadModel.Id_Dependencia)
      params.dependency_id = +this.ActividadModel.Id_Dependencia;
    this._person.getPersonCompany(params).subscribe((r: any) => {
      this.Funcionarios = r.data;
    });
  }

  toggleAllSelection(all: MatOption): void {
    if (all.selected) {
      this.ActividadModel.Funcionario_Asignado = [0].concat(
        this.Funcionarios.map((people) => people.value),
      );
    } else {
      this.ActividadModel.Funcionario_Asignado = [];
    }
  }

  removeAllSelect(all: MatOption): void {
    if (this.ActividadModel.Funcionario_Asignado[0] === 0) {
      this.ActividadModel.Funcionario_Asignado.splice(0, 1);
      all.deselect();
    }
  }
}
