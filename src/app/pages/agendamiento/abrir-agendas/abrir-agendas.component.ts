import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { OpenAgendaService } from '../open-agenda.service';
import { diasSemana } from './dias';
import { QueryPerson } from '../query-person.service';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { CallendarComponent } from '../callendar/callendar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AutocompleteMdlComponent } from '@app/components/autocomplete-mdl/autocomplete-mdl.component';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { FilterSchedulingComponent } from '../filter-scheduling/filter-scheduling.component';

@Component({
  selector: 'app-abrir-agendas',
  templateUrl: './abrir-agendas.component.html',
  styleUrls: ['./abrir-agendas.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatInputModule,
    NgIf,
    MatSlideToggleModule,
    CallendarComponent,
    SearchPipe,
    CardComponent,
    AutocompleteMdlComponent,
    FilterSchedulingComponent,
  ],
})
export class AbrirAgendasComponent implements OnInit {
  public regionalPercent: number = 80;
  public maxRegional: number = 80;

  public isProcedure = false;
  public share: any;

  public timeDuration = { value: 20, text: '20 Minutos' };
  public appointmentId: Number;
  public cups = [];
  public cupId: Number;

  public optionesTime = [
    /*  { value: 5, text: "5 Minutos" },
     { value: 10, text: "10 Minutos" }, */
    { value: 15, text: '15 Minutos' },
    { value: 20, text: '20 Minutos' },
    { value: 25, text: '25 Minutos' },
    { value: 30, text: '30 Minutos' },
    { value: 40, text: '40 Minutos' },
    { value: 60, text: '60 Minutos' },
  ];

  public optionesShare = [
    /*  { value: 5, text: "5 Minutos" },
     { value: 10, text: "10 Minutos" }, */
    { value: 1, text: '1 Cupos' },
    { value: 2, text: '2 Cupos' },
    { value: 3, text: '3 Cupos' },
    { value: 4, text: '4 Cupos' },
    { value: 5, text: '5 Cupos' },
    { value: 6, text: '6 Cupos' },
    { value: 7, text: '7 Cupos' },
    { value: 8, text: '8 Cupos' },
    { value: 9, text: '9 Cupos' },
  ];
  fechaInicio: any = '';
  fechaFin: any = '';
  hour_start: any = '08:00';
  hour_end: any = '18:00';
  long: any = 15;
  days = [];
  company_id: any;

  public diasSemana = diasSemana;
  public today: any;

  filters: any = {};

  loading = false;

  constructor(
    private _openAgendaService: OpenAgendaService,
    public _queryPerson: QueryPerson,
    private _user: UserService,
    private swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.company_id = this._user.user.person.company_worked.id;
    this.share = this.optionesShare[0].value;
    this.getDurations();
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    //this.today = Date.parse(this.today)
    // this.setupSearch();
  }

  reset() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.hour_start = '08:00';
    this.hour_end = '18:00';
    this.long = 15;
    this.days = [];

    this.timeDuration = null;

    /*     this.subappointmentId = null
      this.appointmentId = null
      this.ipsId = null
      this.diasSemana = diasSemana */
    this.timeDuration = { value: 20, text: '20 Minutos' };
  }
  getDurations() {
    this._openAgendaService.getDurations().subscribe((resp: any) => {
      this.optionesTime = resp.data;
    });
  }
  onFilterScheduling(filters: any) {
    this.filters = filters;
    this.getCups();
    this.dispatchPerson();
  }

  private getCups() {
    if (!this.filters?.speciality_id && this.cups.length) return;
    this._openAgendaService
      .searchCustomProcedure('', String(this.filters?.speciality_id))
      .subscribe((resp: any) => {
        this.cups = resp;
      });
  }

  private dispatchPerson() {
    this._queryPerson.person.next(this.filters?.person_id);
  }

  saveAgenda(formulario: NgForm) {
    const body = {
      ...formulario.value,
      ...this.filters,
    };
    const request = () => {
      this._openAgendaService.saveAgendamiento(JSON.stringify(body)).subscribe((resp: any) => {
        if (resp.code != 200) {
          this.swalService.error();
        } else {
          this.swalService.success('La agenda fue aperturada');
          this._queryPerson.person.next(body.person_id);
          this.reset();
        }
      });
    };
    this.swalService.swalLoading('¿Deseas aperturar agenda con esta información?', request);
  }

  showRange = (value: number) => {
    if (value > this.maxRegional) return (this.regionalPercent = this.maxRegional);
    return this.regionalPercent;
  };
}
