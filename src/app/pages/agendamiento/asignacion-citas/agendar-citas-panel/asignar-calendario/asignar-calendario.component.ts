import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpenAgendaService } from '../../../open-agenda.service';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { QueryPatient } from '../../../query-patient.service';
import { QueryAvailabilitySpacesService } from '../../../query-availability-spaces.service';
import { dataCitaToAssignService } from '../../../dataCitaToAssignService.service';
import { AssingService } from 'src/app/services/assign.service';
import esLocale from '@fullcalendar/core/locales/es';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-asignar-calendario',
  templateUrl: './asignar-calendario.component.html',
  styleUrls: ['./asignar-calendario.component.scss'],
  standalone: true,
  imports: [NgIf, FullCalendarModule],
})
export class AsignarCalendarioComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  @Output('siguiente') siguiente = new EventEmitter();
  locales = [esLocale];
  public speciality: Number;
  public person: Number;

  // event form
  formData: UntypedFormGroup;
  formEditData: UntypedFormGroup;
  calendarEvents = [];
  public space;
  // Form submition value
  submitted: boolean;

  calendarWeekends: any;

  // calendar plugin
  calendarPlugins = [dayGridPlugin, bootstrapPlugin, timeGrigPlugin, interactionPlugin, listPlugin];

  public departmentIdFromService = null;
  public regimeIdFromService = null;
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
    dateClick: this.save.bind(this),
    eventClick: this.save.bind(this),
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
  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private _openAgendaService: OpenAgendaService,
    private _queryPatien: QueryPatient,
    private _queryAvailabilitySpacesService: QueryAvailabilitySpacesService,
    private dataCitaToAssignService: dataCitaToAssignService,
    private _assingService: AssingService,
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Wizard', active: true }];
    this._assingService.dataChange.subscribe((data) => {
      this.departmentIdFromService = data;
    });

    /**
     * Event Model validation
     */
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    /**
     * Edit Event Model Data
     */
    this.formEditData = this.formBuilder.group({
      editTitle: [],
      editCategory: [],
    });

    this._queryAvailabilitySpacesService.getspeciality.subscribe((r) => {
      this.speciality = r;
      // this._fetchData();
    });
    this._queryAvailabilitySpacesService.getPerson.subscribe((r: any) => {
      this.person = r?.person;
      if (r?.params) {
        this._fetchData(r?.params);
      } else {
        this.calendarEvents = [];
      }
    });
  }

  save(event: any) {
    const space =
      this.calendarEvents[this.calendarEvents.findIndex((x) => x.id + '' === event.event.id + '')];
    let address = space.address != 'null' ? ' En la dirección ' + space.address : '';
    let message = 'Se dispone a asignar una cita para ' + space.start + address;
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
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, ¡Hazlo !',
        cancelButtonText: 'No, ¡dejeme comprobar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._queryPatien.space.next(event.event.id);
          this.siguiente.emit('');
        }
      });
  }

  private _fetchData(params) {
    params.departemIdPatient = this.departmentIdFromService
      ? this.departmentIdFromService
      : this.dataCitaToAssignService.dateCall['paciente']['department_id'];

    this._openAgendaService.getOpenedSpaceCustom(params).subscribe((resp: any) => {
      this.calendarEvents = resp.data.map((element, index) => {
        resp.data[index]['allDay '] = false;
        return element;
      });
    });

    this.submitted = false;
  }
}
