import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { UserService } from '@app/core/services/user.service';
import { AutocompleteFcComponent } from '@app/components/autocomplete-fc/autocomplete-fc.component';
import { OpenAgendaService } from '../open-agenda.service';

@Component({
  selector: 'app-filter-scheduling',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, AutocompleteFcComponent],
  templateUrl: './filter-scheduling.component.html',
  styleUrl: './filter-scheduling.component.scss',
})
export class FilterSchedulingComponent implements OnInit {
  @Input() values: any = {};

  @Input() showAll = true;

  @Output() filterEvent = new EventEmitter();

  formFilter!: FormGroup;

  agendasType = [];

  inquiriesType = [];

  specialties = [];

  professionals = [];

  ipss = [];

  sites = [];

  agendaType: any = {};

  requestType: any = {};

  ips: any = {};

  companyId = 0;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly openAgendaService: OpenAgendaService,
    private readonly userService: UserService,
  ) {
    this.companyId = userService.user.person.company_worked.id;
  }

  ngOnInit(): void {
    this.formInit();
    this.formFilter.patchValue(this.values);
    this.getAgendaType();
    this.getSpecialties();
  }

  private formInit() {
    this.formFilter = this.formBuilder.group({
      type_agenda_id: ['', [Validators.required]],
      type_appointment_id: [{ value: '', disabled: true }],
      speciality_id: [''],
      person_id: [''],
      company_id: ['', [Validators.required]],
      location_id: [''],
    });
  }

  private getAgendaType() {
    this.openAgendaService.getTypeAppointment('').subscribe({
      next: (res: any) => {
        this.agendasType = res.data;
        this.setAllValue(this.agendasType)
        if (this.values?.type_agenda_id) this.getRequestType(true);
      },
    });
  }

  private getSpecialties() {
    if (this.values?.person_id) this.getProfessionals();
    const { value } = this.formFilter.get('location_id');
    this.openAgendaService.getSpecialties(value, this.requestType.procedure).subscribe({
      next: (res: any) => {
        this.specialties = res.data;
        this.setAllValue(this.specialties)
      },
    });
  }

  private getProfessionals() {
    const { company_id, speciality_id, type_appointment_id } = this.formFilter.value;
    this.openAgendaService
      .getProfesionals(company_id, speciality_id, {
        'type-appointment': type_appointment_id,
        company_id: this.companyId,
      })
      .subscribe({
        next: (res: any) => {
          this.professionals = res.data;
          this.setAllValue(this.professionals)
        },
      });
  }

  getRequestType(isFirstLoad?: boolean) {
    if (!isFirstLoad) this.onFilterEvent();
    const typeAppointControl = this.formFilter.get('type_appointment_id');
    const typeAgendaControl = this.formFilter.get('type_agenda_id').value;
    if (!typeAgendaControl) return;
    this.agendaType = this.agendasType.find((agenda) => agenda.value == typeAgendaControl);
    typeAppointControl.disable();
    this.openAgendaService.getSubTypeAppointment(this.agendaType.value).subscribe({
      next: (res: any) => {
        typeAppointControl.enable();
        this.inquiriesType = res.data;
        this.setAllValue(this.inquiriesType)
        if (isFirstLoad) this.getIpss(true);
      },
    });
  }

  onFilterSpecialty() {
    this.getProfessionals();
    this.onFilterEvent();
  }

  onFilterSite() {
    this.getSpecialties();
    this.onFilterEvent();
  }

  getIpss(isFirstLoad?: boolean) {
    if (!isFirstLoad) {
      this.onFilterEvent();
      this.getSpecialties();
    }
    if (this.values?.location_id) this.getSites(true);
    this.requestType = this.inquiriesType.find(
      (req) => req.value == this.formFilter.get('type_appointment_id').value,
    );
    this.openAgendaService.getIps(this.requestType.company_owner ?? '0').subscribe({
      next: (res: any) => {
        this.ipss = res.data;
        this.setAllValue(this.ipss)
      },
    });
  }

  getSites(isFirstLoad?: boolean) {
    if (!isFirstLoad) {
      this.getProfessionals();
      this.onFilterEvent();
    }
    this.openAgendaService
      .getSedes(this.formFilter.get('company_id').value || '0', this.requestType.procedure)
      .subscribe({
        next: (res: any) => {
          this.sites = res.data;
          this.setAllValue(this.sites)
        },
      });
  }

  onFilterEvent() {
    this.filterEvent.emit(this.formFilter.value);
  }

  setAllValue(array: any[]) {
    if (this.showAll)
      array.unshift({
        value: '',
        text: 'TODOS',
      });

  }
}
