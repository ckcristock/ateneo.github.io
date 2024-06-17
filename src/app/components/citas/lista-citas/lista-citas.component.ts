import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../../core/services/appointment.service';
import { QueryPatient } from '../../../pages/agendamiento/query-patient.service';
import { ModalBasicComponent } from '../../modal-basic/modal-basic.component';
import { DetalleCitaComponent } from '../detalle-cita/detalle-cita.component';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-lista-citas',
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbPagination,
    DetalleCitaComponent,
    ModalBasicComponent,
    FormsModule,
    NotDataComponent,
    DatePipe,
  ],
})
export class ListaCitasComponent implements OnInit {
  @ViewChild('cancelarCitaModal') cancelarCitaModal: any;
  @Input('canOverride') canOverride: any;
  citas: any = [];
  @Input('patient') patient: any = '';
  @Input('operation') operation: any = '';
  @Input('getAppointments') getAppointments!: EventEmitter<any>;
  @Output('canceled') canceled = new EventEmitter<any>();
  openModalDetalle = new EventEmitter<any>();

  loading = false;
  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  };

  filters: any = {
    identifier: 0,
  };

  data: any = {
    Id_Especialidad: '',
  };

  cancelCita: any;
  constructor(
    private _appointment: AppointmentService,
    private _queryPatient: QueryPatient,
  ) {}

  ngOnInit(): void {
    this.getAppointments.subscribe((r) => {
      this.getCitas();
    });

    this._queryPatient.patient.subscribe(async (r) => {});
  }

  getCitas(page = 1) {
    this.pagination.page = page;
    this.filters.identifier = this.patient;
    let params: any = Object.assign({}, this.pagination, this.filters);
    this.loading = true;
    this._appointment.getAppointments(params).subscribe((r: any) => {
      this.pagination.collectionSize = r.data.total;
      this.citas = r.data.data;
      this.loading = false;
    });
  }

  cancelarCita(form: NgForm) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿está seguro?',
        text: 'Se dispone a Cancelar una cita',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, ¡cancelar !',
        cancelButtonText: 'No, ¡dejeme comprobar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          //api para cancelar
          this._appointment.cancelAppointment(this.cancelCita.id, form.value).subscribe(
            (ok) => {
              swalWithBootstrapButtons
                .fire('Operación exitosa', 'Cita cancelada exitosamente', 'success')
                .then((r) => {
                  this.canceled.emit();
                  this.getCitas();
                });
              this.cancelarCitaModal.hide();
            },
            (err) => {
              swalWithBootstrapButtons.fire('Operación denegada', 'Ha ocurrido un error', 'error');
              this.cancelarCitaModal.hide();
            },
          );
        }
      });
  }

  openCancelCita(cita: any) {
    this.cancelCita = cita;
    this.cancelarCitaModal.show();
  }

  detalleCita(cita: any) {
    let modalDetalle = {
      Id_Cita_Detalle: cita.id,
      Show: true,
    };
    this.openModalDetalle.emit(modalDetalle);
  }

  finish() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: '¿está seguro?',
        text: 'Se dispone a finalizar la llamada',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, finalizar !',
        cancelButtonText: 'No, ¡dejeme comprobar!',
        reverseButtons: true,
      })
      .then((r) => this.canceled.emit());
  }
}
