import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppointmentService } from 'src/app/core/services/appointment.service';
import { errorMessage, successMessage } from 'src/app/core/utils/confirmMessage';
import { Response } from 'src/app/core/response.model';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { AutocompleteMdlComponent } from '@app/components/autocomplete-mdl/autocomplete-mdl.component';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { DetalleCitaComponent } from '../../../components/citas/detalle-cita/detalle-cita.component';
import { FilterSchedulingComponent } from '../filter-scheduling/filter-scheduling.component';

@Component({
  selector: 'app-replay-migrate',
  templateUrl: './replay-migrate.component.html',
  styleUrls: ['./replay-migrate.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatInputModule,
    NgIf,
    NgClass,
    DetalleCitaComponent,
    DatePipe,
    StandardModule,
    ViewMoreComponent,
    StatusBadgeComponent,
    AutocompleteMdlComponent,
    AutomaticSearchComponent,
    FilterSchedulingComponent,
  ],
})
export class ReplayMigrateComponent implements OnInit {
  citas: Array<any> = [];
  public type_appointments: [];
  loading = false;

  constructor(
    private _appointment: AppointmentService,
    readonly urlFiltersService: UrlFiltersService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getCitas();
  }

  private subscription = new Subscription();

  openModalDetalle = new EventEmitter<any>();

  filters: any = {
    date: '',
    company_id: '',
    location_id: '',
    institution: '',
    patient: '',
    speciality: '',
    // state: '',
    type_agenda_id: '',
    type_appointment_id: null,
    person_id: '',
    identifier: '',
  };
  pagination = {
    pageSize: 15,
    page: 1,
    length: 0,
  };
  searching = false;
  searchFailed = false;
  /*   'Agendado','Cancelado','Atendido' */
  states = [
    { value: '', name: 'Seleccione' },
    { value: 'Aperturada', name: 'Aperturada' },
    { value: 'Agendado', name: 'Agendado' },
    { value: 'Cancelado', name: 'Cancelado' },
    { value: 'Atendido', name: 'Atendido' },
  ];
  getCitas(filters?: any) {
    this.loading = true;
    let values = { ...this.filters, ...filters };
    let send: any = {};
    for (const key in values) {
      if (typeof values[key] != 'undefined' && values[key] != '') {
        send[key] = values[key];
      }
    }

    Object.assign(send, { ...this.pagination });
    send.identifier = this.filters.patient;

    this._appointment.getAppointmentsTomigrate(send).subscribe((r: any) => {
      this.loading = false;
      this.citas = r.data.data;
      this.pagination.length = r.data.total;
    });
  }

  detalleCita(cita) {
    let modalDetalle = {
      Id_Cita_Detalle: cita.id,
      Show: true,
    };

    this.openModalDetalle.emit(modalDetalle);
  }
  llamadaPaciente(cita) {
    this.swalService.show({
      icon: 'warning',
      title: 'Función no activa',
      text: 'La función de la llamada saliente no esta disponible aún!',
      showCancel: false,
    });
  }

  setPage(page) {
    this.pagination.page = page;
  }

  Cancel = (cita) => {
    this.swalService
      .customAlert({
        text: 'Se dispone a cancelar una cita',
        icon: 'warning',
        input: 'text',
        inputAttributes: {
          maxlength: '50',
          autocapitalize: 'off',
          autocorrect: 'off',
        },
        showCancelButton: true,
      })
      .then((res) => {
        const request = () => {
          this.subscription.add(
            this._appointment
              .cancelAppointment(cita.id, { reason_cancellation: res.value })
              .subscribe((r: any) => {
                if (!r.data) {
                  console.log('No se pudo completa la opracion');
                  return false;
                }
                this.swalService.show({
                  icon: 'success',
                  title: 'Cita cancelado correctamente',
                  text: 'La cita se ha cancelado de manera correcta!',
                  showCancel: false,
                });
                this.getCitas();
              }),
          );
        };
        if (res.isConfirmed && res.value)
          this.swalService.swalLoading('Se cancelará la cita', request);
      });
  };

  Migrate = (cita) => {
    const request = () => {
      this.subscription.add(
        this._appointment.migrateAppointment(cita).subscribe((res: Response) => {
          res.code === 200 ? successMessage(res.data) : errorMessage(res.err);
          this.getCitas();
        }),
      );
    };
    this.swalService.swalLoading('Migrar cita', request);
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
