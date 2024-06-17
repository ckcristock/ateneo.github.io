import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppointmentService } from 'src/app/core/services/appointment.service';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf, NgClass, DatePipe, UpperCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AutocompleteMdlComponent } from '@app/components/autocomplete-mdl/autocomplete-mdl.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';
import { DetalleCitaComponent } from '../../../components/citas/detalle-cita/detalle-cita.component';
import { FilterSchedulingComponent } from '../filter-scheduling/filter-scheduling.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-lista-trabajo',
  templateUrl: './lista-trabajo.component.html',
  styleUrls: ['./lista-trabajo.component.scss'],
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
    DatePipe,
    DetalleCitaComponent,
    ViewMoreComponent,
    StandardModule,
    ActionViewComponent,
    AutocompleteMdlComponent,
    AutomaticSearchComponent,
    UpperCasePipe,
    FilterSchedulingComponent,
    RouterModule,
  ],
})
export class ListaTrabajoComponent implements OnInit, OnDestroy {
  citas: Array<any> = [];
  loading = false;

  constructor(
    private _appointment: AppointmentService,
    readonly urlFiltersService: UrlFiltersService,
    private readonly swalService: SwalService,
  ) {}
  ngOnInit(): void {
    this.getUrlFilters();
    this.getCitas();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = {
      ...this.filters,
      ...this.urlFiltersService.currentFilters,
    };
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
    state: '',
    type_agenda_id: '',
    type_appointment_id: '',
    person_id: '',
    identifier: '',
    eps: '',
  };
  pagination = {
    pageSize: 15,
    page: 1,
    length: 0,
  };
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
    let values = {
      ...this.filters,
      ...filters,
    };
    let send: any = {};
    for (const key in values) {
      if (typeof values[key] != 'undefined' && values[key] != '') {
        send[key] = values[key];
      }
    }

    Object.assign(send, { ...this.pagination });
    send.identifier = this.filters.patient;
    this._appointment.getAppointments(send).subscribe((r: any) => {
      this.loading = false;
      this.citas = r.data.data;
      this.pagination.length = r.data.total;
    });
    this.urlFiltersService.setUrlFilters(send);
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

  confirmarCita(cita) {
    this.swalService
      .customAlert({
        text: 'Se dispone a confirmar una cita',
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
          this._appointment.confirmAppointment(res.value, cita.id).subscribe((r: any) => {
            if (!r.data) {
              console.log('No se pudo completa la opracion');
              return false;
            }
            this.swalService.show({
              icon: 'success',
              title: 'Cita confirmada correctamente',
              text: 'La cita se ha confirmado de manera correcta!',
              showCancel: false,
            });
            this.getCitas();
          });
        };
        if (res.isConfirmed && res.value)
          this.swalService.swalLoading('Se creará una nueva cita', request);
      });
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
