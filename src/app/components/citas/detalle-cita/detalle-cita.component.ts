import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import {
  NgbAccordionDirective,
  NgbAccordionItem,
  NgbAccordionHeader,
  NgbAccordionToggle,
  NgbAccordionButton,
  NgbCollapse,
  NgbAccordionCollapse,
  NgbAccordionBody,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalBasicComponent } from '../../modal-basic/modal-basic.component';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatExpansionModule,
    FormsModule,
    ModalBasicComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionToggle,
    NgbAccordionButton,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    ModalComponent,
  ],
})
export class DetalleCitaComponent implements OnInit {
  @Input('modalData') modalData!: EventEmitter<any>;
  @ViewChild('detalleCitaModal') detalleCitaModal: any;
  @ViewChild('add') add: any;
  appointment_id!: string;
  panelOpenState1!: boolean;
  panelOpenState!: boolean;
  findCita: any = {
    created_at: '',
    price: '',
    opservation: '',
    space: {
      hour_start: '',
      agendamiento: {
        person: { name: '' },
        sub_type_appointment: { name: '' },
        type_appointment: { name: '' },
        company: { name: '' },
        location: { name: '' },
        speciality: { name: '' },
      },
    },
    call_in: {
      formality: { name: '' },
      patient: {
        state: '',
        type_document_id: '',
        identifier: '',
        firstname: '',
        company: { name: '' },
        eps: { name: '' },
      },
    },
  };
  constructor(
    private _appointment: AppointmentService,
    private modalBD: ModalService,
  ) {}

  ngOnInit(): void {
    this.modalData.subscribe((d) => {
      this.appointment_id = d.Id_Cita_Detalle;
      d.Show ? this.modalBD.openLg(this.add) : this.modalBD.close();
      this.getCita();
    });
  }
  getCita() {
    this._appointment.getAppointment(this.appointment_id).subscribe((d) => {
      this.findCita = d;
    });
  }
}
