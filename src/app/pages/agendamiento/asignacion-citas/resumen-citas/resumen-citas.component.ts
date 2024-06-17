import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { DetalleCitaComponent } from '../../../../components/citas/detalle-cita/detalle-cita.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-resumen-citas',
  templateUrl: './resumen-citas.component.html',
  styleUrls: ['./resumen-citas.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NotDataComponent, DetalleCitaComponent, DatePipe],
})
export class ResumenCitasComponent implements OnInit {
  loading = false;
  @ViewChild('modalCita') modalCita: any;
  openModalDetalle = new EventEmitter<any>();
  //@Input('citas') citas : Array<any>;
  @Input('patient') patient: any = '';
  data: any = {
    Id_Especialidad: '',
  };
  citas: any = [];
  constructor(private _appointment: AppointmentService) {}

  getCitas() {
    this.loading = true;
    console.log(this.patient);
    this._appointment.getAppointments({ identifier: this.patient }).subscribe((r: any) => {
      this.citas = r.data.data;
      this.loading = false;
    });
  }
  ngOnInit(): void {
    this.getCitas();
  }

  detalleCita(cita) {
    let modalDetalle = {
      Id_Cita_Detalle: cita.id,
      Show: true,
    };
    this.openModalDetalle.emit(modalDetalle);
  }
}
