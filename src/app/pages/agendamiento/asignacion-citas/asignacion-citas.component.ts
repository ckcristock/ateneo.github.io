import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { QueryPatient } from '../query-patient.service';
import { Subscription } from 'rxjs';
import { Patient } from 'src/app/core/models/patient.model';
import { TipificationService } from 'src/app/core/services/tipification.service';
import { PermissionService } from '../../../core/services/permission.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { OpenAgendaService } from '../open-agenda.service';
import { ActivatedRoute } from '@angular/router';
import { dataCitaToAssign } from 'src/app/core/interfaces/dataCitaToAssign.model';
import { newCallService } from 'src/app/services/newCallService';
import { AsignacionCitasService } from './tipificacion/asignacion-citas.service';
import { Response } from 'src/app/core/response.model';
import { TipificacionComponent } from './tipificacion/tipificacion.component';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ModalBasicComponent } from '../../../components/modal-basic/modal-basic.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ResumenCitasComponent } from './resumen-citas/resumen-citas.component';
import { SetPacienteComponent } from '../../../components/paciente/set-paciente/set-paciente.component';
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLinkButton,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { OtroConceptoComponent } from './otro-concepto/otro-concepto.component';
import { ListaCitasComponent } from '../../../components/citas/lista-citas/lista-citas.component';
import { AgendarCitasComponent } from './agendar-citas-panel/agendar-citas.component';
import { NgIf } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataSaComponent } from '@app/components/not-data-sa/not-data-sa.component';

@Component({
  selector: 'app-asignacion-citas',
  templateUrl: './asignacion-citas.component.html',
  styleUrls: ['./asignacion-citas.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    TipificacionComponent,
    AgendarCitasComponent,
    ListaCitasComponent,
    OtroConceptoComponent,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLinkButton,
    NgbNavLinkBase,
    NgbNavContent,
    SetPacienteComponent,
    ResumenCitasComponent,
    NgbNavOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ModalBasicComponent,
    CardComponent,
    NotDataSaComponent
  ],
})
export class AsignacionCitasComponent implements OnInit {
  @ViewChild('mymodal') mymodal: any;
  @ViewChild(TipificacionComponent) tipificacion: TipificacionComponent;
  public getClitasE = new EventEmitter<any>();

  active = 1;

  @Output()
  public changeData = new EventEmitter<any>();

  public configComponent: any = {
    menu: 'Asignación de citas',
    permissions: {
      receive_calls: false,
    },
  };

  operation: any = {};
  typeCall = 'Presencial';
  public existPtient;
  public existPtientForShow: boolean = false;
  public getDate;

  public mypatient = {
    name: '',
    identifier: 0,
  };

  public dataFormCall: any = {
    paciente: {},
    llamada: {},
  };
  public subjePatient;
  public citas: any = [];
  public $tramiteSelected: Subscription;
  public $tramiteData: Subscription;
  tramiteData: any;
  public patient;
  public Id_llamada;
  public observation: string = '';

  public dataCitaToAssign = new dataCitaToAssign();

  loadingReqAppointment = false

  constructor(
    private http: HttpClient,
    private _queryPatient: QueryPatient,
    private _tipification: TipificationService,
    private route: ActivatedRoute,
    private _permisson: PermissionService,
    private _appointment: AppointmentService,
    private _openAgenda: OpenAgendaService,
    private _newCallService: newCallService,
    private asignacionCitas: AsignacionCitasService,
    private _swal: SwalService,
  ) {
    if (this.route.snapshot.params.id) {
      this.newCallByWaitingList();
    }

    this.configComponent = this._permisson.validatePermissions(this.configComponent);
    this.existPtient = _queryPatient.existPatient.subscribe((r) => this.Init());
  }

  ngOnInit(): void {
    this.Init();
    this.changeTramite();
    this.getCallPending();
  }

  changeTramite() {
    this.$tramiteSelected = this._queryPatient.tramiteSelected.subscribe((r: any) => {
      this.operation = r;
      if (!r.component) {
        //buscar citas by paciente
        //this.Init()
        this.existPtientForShow = false;
      }

      if (r.component == 'Reasignar Citas' && this.patient) {
        this.getCitas();
      }
    });

    this.$tramiteData = this._queryPatient.tipificationData.subscribe((r) => {
      this.tramiteData = r;
    });
  }

  getCitas() {
    setTimeout(() => {
      this.getClitasE.emit({ identifier: this.patient.paciente.identifier });
    }, 200);
  }

  getCallPending() {
    if(!this.configComponent.permissions.receive_calls) return
    this.asignacionCitas.getCallPending().subscribe((res: Response) => {
      if (res && res.data) {
        this.Id_llamada = res.data.id;
        this.mypatient.name = res.data.patient.firstname + ' ' + res.data.patient.surname;
        this.mypatient.identifier = res.data.patient.identifier;
        this.mymodal.show();
      }
    });
  }

  Init() {
    if (this.configComponent.permissions.receive_calls) {
      this.getDate = setInterval(() => {
        this.existPtientForShow = false;
        this.GetData();
      }, 3000);
    } else {
    }
  }

  GetData() {
    this.http.get(`${environment.base_url}/get-patient`).subscribe((req: any) => {
      if (req.code == 200) {
        let data = req.data;
        if (!data.paciente) {
          data = this.newPatient(data, req);
        }
        this.patient = data;
        this._queryPatient.patient.next(data);
        this.existPtientForShow = true;
        clearInterval(this.getDate);
      }
    });
  }
  ngOnDestroy(): void {
    this.$tramiteSelected.unsubscribe();
    this.$tramiteData.unsubscribe();
    clearInterval(this.getDate);
  }

  newCall(form) {
    if (!form.valid) {
      this._swal.show({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Llena todos los datos para poder continuar',
        showCancel: false,
      });
    } else {
      this.loadingReqAppointment = true
      this.dataCitaToAssign.resetData();
      // this.http.post(`${environment.base_url}/presentianCall`, JSON.stringify(form.value))
      this._newCallService.newCall(form).subscribe((req: any) => {
        if (req.code == 200) {
          let data = req.data;
          if (req.data.isNew) {
            data = this.newPatient(data, req);
          }
          this.patient = data;
          this._queryPatient.patient.next(data);
          this.existPtientForShow = true;
          clearInterval(this.getDate);
        }
      });
    }
  }

  newCallByWaitingList() {
    //TODO: refactor traer waitin list sin apointment agendado
    // this.http.post(`${environment.base_url}/patientforwaitinglist`, this.route.snapshot.params.id)
    this._newCallService.newCallByWaitingList(this.route.snapshot.params.id).subscribe(
      (req: any) => {
        if (req.code == 200) {
          let data = req.data;
          if (req.data.isNew) {
            data = this.newPatient(data, req);
          }

          this.patient = data;
          this._queryPatient.patient.next(data);
          this._queryPatient.infowailist.next(data);
          this.existPtientForShow = true;
          clearInterval(this.getDate);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  newPatient(data, req) {
    data.paciente = new Patient();
    data.paciente.identifier = req.data.llamada.Identificacion_Paciente;
    data.paciente.isNew = true;
    return data;
  }

  canceledAppointment(event) {
    if (this.operation.name != 'Reasignación de Citas') {
      //this.getCitas();
      this._queryPatient.existPatient.next('');
      this._queryPatient.resetModels();
      this._openAgenda.getClean(this.patient.llamada.id).subscribe((r) => { });
    }
  }

  finalizedCall() {
    this.tipificacion.data.Id_Llamada;
    this.tipificacion.data.Id_Ambito;
    this.tipificacion.data.Id_Tramite;
    this.tipificacion.data.Id_Tipo_Servicio;

    let params = {
      Id_Llamada: this.Id_llamada,
      observation: this.observation,
      Id_Ambito: this.tipificacion.data.Id_Ambito,
      Id_Tramite: this.tipificacion.data.Id_Tramite,
      Id_Tipo_Servicio: this.tipificacion.data.Id_Tipo_Servicio,
    };

    this.asignacionCitas.finalizedCall(params).subscribe((data: Response) => {
      if (data.status) {
        this.mymodal.hide();
        this.getCallPending();
      }
    });
  }
}
