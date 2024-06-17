import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { ListaTrabajoService } from '../lista-trabajo.service';
import Swal from 'sweetalert2';
import { DetalleAgendaService } from '../detalle-agenda.service';
import esLocale from '@fullcalendar/core/locales/es';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { TimeLineComponent } from '../../../../components/time-line/time-line.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { SwalService } from '@app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-ver-agenda',
  templateUrl: './ver-agenda.component.html',
  styleUrls: ['./ver-agenda.component.scss'],
  standalone: true,
  imports: [
    TimeLineComponent,
    NgIf,
    NgbAlert,
    FormsModule,
    FullCalendarModule,
    ModalBasicComponent,
    CardComponent,
  ],
})
export class VerAgendaComponent implements OnInit {
  agenda: any = {};
  notOverride = false;
  id: any;
  locales = [esLocale];
  public fechaInicio: any;
  public fechaFin: any;

  constructor(
    private route: ActivatedRoute,
    private _listaTrabajo: ListaTrabajoService,
    private _detalleAgenda: DetalleAgendaService,
    private readonly swalService: SwalService,
  ) {}
  time: History[];

  selected = {
    date: '',
    id: '',
  };

  calendarPlugins = [dayGridPlugin, bootstrapPlugin, timeGrigPlugin, interactionPlugin, listPlugin];
  calendarEvents: EventInput[];

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
    weekends: true,
    dateClick: this.cancel.bind(this),
    eventClick: this.cancel.bind(this),
    bootstrapFontAwesome: {
      close: 'fa-times',
      prev: 'fa-chevron-left',
      next: 'fa-chevron-right',
      prevYear: 'fa-angle-double-left',
      nextYear: 'fa-angle-double-right',
    },
    themeSystem: 'bootstrap',
    locales: this.locales,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: true,
    },
  };

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getAgenda();
  }

  getAgenda() {
    this._listaTrabajo.getAgendamientoDetail(this.id).subscribe((d) => {
      this.agenda = d.data;
      this.notOverride = this.agenda.spaces.some((d) => d.status == 0);
    });
  }

  cancellAgenda() {
    const request = () => {
      let params = {
        id: this.id,
        fecha_inicio: this.fechaInicio,
        fecha_fin: this.fechaFin,
      };

      this._detalleAgenda.cancellAgenda(params).subscribe(
        (d) => {
          if (!d.status) {
            Swal.fire('Error ', d.err, 'error');
            return false;
          }
          this.getAgenda();
          Swal.fire('Buen trabajo', 'Operación exitosa', 'success');
        },
        (error) => {
          console.log(error);
        },
      );
    };
    this.swalService.swalLoading('Se dispone a cancelar agendamiento', request);
  }

  cancel(event) {
    const id = event.event.id;
    let space: any = this.agenda.spaces.find((r) => r.id == id);
    if (space.state == 'Cancelado' || space.status == 0) {
      Swal.fire(
        'No se puede realizar la operación',
        'El espacio ya se encuentra ' +
          (space.state == 'Cancelado' ? 'cancelado' : ' con una cita previa'),
        'warning',
      );
      return false;
    }
    const request = () => {
      this._listaTrabajo.cancelSpace({ id }).subscribe((r: any) => {
        Swal.fire('Operacion procesada', r.data, r.code == 200 ? 'success' : 'error');
        this.getAgenda();
      });
    };
    this.swalService.swalLoading(
      'Se dispone a cancelar un espacio de la agenda ' + space.start,
      request,
    );
  }
}
