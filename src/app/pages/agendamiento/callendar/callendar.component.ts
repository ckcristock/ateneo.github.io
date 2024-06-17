import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';

import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

import esLocale from '@fullcalendar/core/locales/es';
import { Event } from './event.model';
import { OpenAgendaService } from '../open-agenda.service';
import { QueryPerson } from '../query-person.service';
import { dataCitaToAssignService } from '../dataCitaToAssignService.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-callendar',
  templateUrl: './callendar.component.html',
  styleUrls: ['./callendar.component.scss'],
  standalone: true,
  imports: [
    FullCalendarModule,
    NgIf,
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgFor,
  ],
})
export class CallendarComponent implements OnInit {
  loading = false;
  @Input() person: Number;
  public myperson: any;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  locales = [esLocale];
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

  calendarWeekends: any;
  // show events
  calendarEvents: EventInput[];

  // calendar plugin
  calendarPlugins = [dayGridPlugin, bootstrapPlugin, timeGrigPlugin, interactionPlugin, listPlugin];

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
    dateClick: this.openModal.bind(this),
    eventClick: this.openEditModal.bind(this),
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

  // slotDuration = '02:00' // 2 hours

  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private _openAgendaService: OpenAgendaService,
    private _queryPerson: QueryPerson,
    private dataCitaToAssignService: dataCitaToAssignService,
  ) {
    this._queryPerson.person.subscribe((r: any) => {
      this.myperson = r;
      this._fetchData();
    });
  }
  ngOnInit(): void {
    this._fetchData();

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

    // this._fetchData();
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  /**
   * Open Event Modal
   * @param content modal content
   * @param event calendar event
   */
  openModal(content: any, event: any) {
    this.newEventDate = event.date;
    this.modalService.open(content);
  }

  /**
   * Open Event Modal For Edit
   * @param editcontent modal content
   * @param event calendar event
   */
  openEditModal(editcontent: any, event: any) {
    this.formEditData = this.formBuilder.group({
      editTitle: event.event.title,
      editCategory: event.event.classNames[event.event.classNames.length - 1],
    });
    // tslint:disable-next-line: max-line-length
    this.editEvent = {
      id: event.event.id,
      title: event.event.title,
      start: event.event.start,
      classNames: event.event.classNames[event.event.classNames.length - 1],
    };
    this.modalService.open(editcontent);
  }

  /**
   * Show successfull Save Dialog
   */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  /**
   * Upldated event title save in calendar
   */
  editEventSave() {
    const editTitle = this.formEditData.get('editTitle').value;
    const editCategory = this.formEditData.get('editCategory').value;
    const editId = this.calendarEvents.findIndex((x) => x.id + '' === this.editEvent.id + '');
    // tslint:disable-next-line: radix
    this.calendarEvents[editId] = {
      ...this.editEvent,
      title: editTitle,
      id: this.editEvent.id + '',
      className: editCategory,
    };
    this.formEditData = this.formBuilder.group({
      editTitle: '',
      editCategory: '',
    });
    this.modalService.dismissAll();
  }

  /**
   * Delete the event from calendar
   */
  deleteEventData() {
    const deleteId = this.editEvent.id;
    const deleteEvent = this.calendarEvents.findIndex((x) => x.id + '' === deleteId + '');
    this.calendarEvents[deleteEvent] = { ...this.deleteEvent, id: '' };
    delete this.calendarEvents[deleteEvent].id;
    this.modalService.dismissAll();
  }

  /**
   * Model Data save and show the event in calendar
   */

  saveEvent() {
    if (this.formData.valid) {
      const title = this.formData.get('title').value;
      const category = this.formData.get('category').value;

      this.calendarEvents = this.calendarEvents.concat({
        id: this.calendarEvents.length + 1 + '',
        title,
        className: category,
        start: this.newEventDate || new Date(),
      });
      this.position();
      this.formData = this.formBuilder.group({
        title: '',
        category: '',
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
  }

  /**
   * Open Delete Confirmation Modal
   */
  confirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.deleteEventData();
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
      }
    });
  }

  private _fetchData() {
    if (this.myperson == 'null' || this.myperson == 'undefined') {
      /*       this.myperson = this.person */
    }
    this.loading = true;
    this._openAgendaService.getAppointments(this.myperson).subscribe((resp: any) => {
      this.loading = false;
      this.calendarEvents = resp.data.map((element, index) => {
        if (element.status) {
          return element;
        }
        return element;
      });
    });
    this.submitted = false;
  }

  closeEventModal() {
    const title = this.formData.get('title').value;
    // tslint:disable-next-line: no-shadowed-variable
    const category = this.formData.get('category').value;
    this.formData = this.formBuilder.group({
      title: '',
      category: '',
    });
    this.modalService.dismissAll();
  }
}
