import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpenAgendaService } from '../../open-agenda.service';
import Swal from 'sweetalert2';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormsModule } from '@angular/forms';
import { QueryPatient } from '../../query-patient.service';
import { AssingService } from 'src/app/services/assign.service';
import { CitaComponent } from '../disponibilidad-cita/cita.component';
import { QueryAvailabilitySpacesService } from '../../query-availability-spaces.service';
import { ResumenComponent } from './resumen/resumen.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { CrearCitaComponent } from './crear-cita/crear-cita.component';
import { ArchwizardModule } from '@viso-trust/angular-archwizard';

@Component({
  selector: 'app-agendar-citas',
  templateUrl: './agendar-citas.component.html',
  styleUrls: ['./agendar-citas.component.scss'],
  standalone: true,
  imports: [
    ArchwizardModule,
    CitaComponent,
    CrearCitaComponent,
    NgIf,
    ResumenComponent,
    FormsModule,
    NgClass,
    NgFor,
  ],
})
export class AgendarCitasComponent implements OnInit {
  /* @ViewChild('next') next; */
  @ViewChild('next') next: ElementRef;
  @ViewChild(CitaComponent) disponibilidad: CitaComponent;
  @ViewChild('customStep') customStep: ElementRef;

  public dataCita: any = {
    appointment: '',
    patient: '',
    person: '',
    day: '',
    hour: '',
    location: '',
    direction: '',
    cuota: '',
  };

  // bread crumb items
  breadCrumbItems: Array<{}>;

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
  step: any;

  // slotDuration = '02:00' // 2 hours

  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private _openAgendaService: OpenAgendaService,
    private _assingService: AssingService,
  ) {
    // private _queryAvailabilitySpacesService: QueryAvailabilitySpacesService
  }

  ngOnInit(): void {
    this._assingService.returnStep.subscribe((data) => {
      this.step = data;
      this.fnCustomStep(this.step);
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

    this._fetchData();
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
      // tslint:disable-next-line: no-shadowed-variable
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
    // Calender Event Data
    this._openAgendaService.getAppointments(1).subscribe((resp: any) => {
      this.calendarEvents = resp.data.map((element, index) => {
        if (element.status) {
          resp.data[index]['allDay '] = false;
          return element;
        }
        resp.data[index]['allDay '] = false;
        return element;
      });
    });
    // form submit
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

  siguiente(dataCita: any = {}) {
    this.next.nativeElement.click();
  }

  fnCustomStep(step: number) {
    this.disponibilidad.reset();
    this.customStep.nativeElement.click();
  }
}
