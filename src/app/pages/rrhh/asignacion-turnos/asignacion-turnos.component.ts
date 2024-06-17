import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import moment from 'moment';
import { AsignacionTurnosService } from './asignacion-turnos.service';
import { RotatingTurnService } from '../../ajustes/informacion-base/turnos/turno-rotativo/rotating-turn.service';

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePipe, NgIf, NgFor, NgClass, UpperCasePipe } from '@angular/common';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { MatAccordion } from '@angular/material/expansion';
import { User } from 'src/app/core/models/users.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { GroupCompanyService } from 'src/app/shared/services/group-company.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SemanaTurnoComponent } from './semana-turno/semana-turno.component';
import { HeaderButtonComponent } from '../../../shared/components/standard-components/header-button/header-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import {
  DatePicker,
  DatePickerComponent,
} from '@shared/components/date-picker/date-picker.component';

@Component({
  selector: 'app-asignacion-turnos',
  templateUrl: './asignacion-turnos.component.html',
  styleUrls: ['./asignacion-turnos.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    HeaderButtonComponent,
    NgIf,
    NgFor,
    SemanaTurnoComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    NotDataComponent,
    NgClass,
    TableComponent,
    MatPaginatorModule,
    UpperCasePipe,
    DatePipe,
    AutomaticSearchComponent,
    DatePickerComponent,
  ],
})
export class AsignacionTurnosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  changeWeek = new EventEmitter<any>();

  datePipe = new DatePipe('es-CO');
  loading: boolean;
  loadingHistory: boolean;
  matPanel: boolean;
  date: any;
  estadoFiltros = false;
  formFilters: UntypedFormGroup;
  orderObj: any;
  active_filters: boolean = false;
  permission: Permissions = {
    menu: 'Asignación de turnos',
    permissions: {
      show: true,
      add: true,
    },
  };
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: '',
  };
  user: User;

  groupList: any[] = [];
  dependencyList: any[] = [];
  datosGenerales: any[] = [];
  history: any[] = [];
  turns: any[] = [];
  diaInicialSemana = moment().startOf('week'); //revisar estos, y posiblemente eliminar
  diaFinalSemana = moment().endOf('week'); //se está usando en el formFilter
  startWeek: any;
  endWeek: any;

  dateFilter!: DatePicker;

  constructor(
    private _asignacion: AsignacionTurnosService,
    private _rotatingTurn: RotatingTurnService,
    private fb: UntypedFormBuilder,
    private _permission: PermissionService,
    private _user: UserService,
    public router: Router,
    private _modal: ModalService,
    private _paginator: PaginatorService,
    private readonly groupCompanyService: GroupCompanyService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.user = _user.user;
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();

      this.getUrlFilters();

      this.startWeek = moment().startOf('week').toDate();
      this.endWeek = moment().endOf('week').toDate();
      this.getTurns();
      this.getGroups();
      this.getData();
    } else {
      this.router.navigate(['/notautorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.formFilters.patchValue(this.urlFiltersService.currentFilters);
    const { date_to, date_from } = this.urlFiltersService.currentFilters;
    this.dateFilter = {
      start_date: date_from,
      end_date: date_to,
    };
  }

  onSearchPerson(value: string) {
    this.formFilters.get('person').setValue(value);
    this.makeRequestBySemana();
  }

  selectedDate(dates: DatePicker) {
    this.formFilters.patchValue({
      date_to: dates.end_date,
      date_from: dates.start_date,
    });
    this.makeRequestBySemana();
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    this.getHistory();
  }

  resetFiltros() {
    this._paginator?.resetFiltros(this.formFilters);
    this.active_filters = false;
  }

  openModal(content) {
    this._modal.open(content, 'xl');
    this.getHistory();
  }

  getHistory() {
    this.loadingHistory = true;
    let params = {
      ...this.pagination,
    };
    this._asignacion.getHistory(params).subscribe((res: any) => {
      this.history = res.data.data;
      this.loadingHistory = false;
      this.paginationMaterial = res?.data;
      if (this.paginationMaterial?.last_page < this.pagination?.page) {
        this.paginationMaterial.current_page = 1;
        this.pagination.page = 1;
        this.getHistory();
      }
    });
  }

  SetFiltros(paginacion) {
    return this._paginator?.SetFiltros(paginacion, this.pagination, this.formFilters);
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      week: [moment().format(moment.HTML5_FMT.WEEK)],
      /* company_id: [1], */
      group_id: [''],
      dependency_id: [''],
      person: [''],
      date_from: [''],
      date_to: [''],
    });

    this.formFilters.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.formFilters.get('dependency_id').enable();
        this.getDependencies(valor);
      } else {
        this.formFilters.patchValue({ dependency_id: 0 });
        this.formFilters.get('dependency_id').disable();
      }
    });
  }

  getData() {
    ///  rrhh/turnos/asignacion
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value,
      company_id: this._user.user.person.company_worked.id,
    };
    const fecha_ini =
      this.formFilters.controls.date_from.value == ''
        ? //? moment().format('YYYY-MM-DD')
          moment().startOf('week')
        : this.formFilters.controls.date_from.value;
    const fecha_fin =
      this.formFilters.controls.date_to.value == ''
        ? //? moment().format('YYYY-MM-DD')
          moment().endOf('week')
        : this.formFilters.controls.date_to.value;

    this._asignacion.getPeople(fecha_ini, params).subscribe((r: any) => {
      this.datosGenerales = r.data;
      this.loading = false;
      setTimeout(() => {
        this.changeWeek.emit({
          diaInicialSemana: fecha_ini,
          diaFinalSemana: fecha_fin,
        });
        //this.changeWeek.emit();
      }, 200);
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  private getGroups(): void {
    this.groupCompanyService.getGroupCompany().subscribe({
      next: (res) => {
        this.groupList = res.data;
        this.groupList.unshift({ value: '', text: 'Todos' });
        const { value = 0 } = this.formFilters.get('group_id');
        if (value) this.getDependencies(value as number);
      },
    });
  }

  getDependencies(value: number): void {
    if (!this.groupList.length) return;
    const { dependencies = [] } = this.groupList.find((group) => group.value == value);
    this.dependencyList = [{ value: '', text: 'Todas' }, ...dependencies];
  }

  getTurns() {
    this._rotatingTurn.getAllSelect().subscribe((r: any) => {
      this.turns = r;
    });
  }

  /**
   * revisar, la idea es que funcione con el formulario y no con la variable
   * El emiter lo anvía al padre
   */
  makeRequestBySemana() {
    /* let semana = this.formFilters.get('week').value;
    this.diaInicialSemana = moment(semana).startOf('week');
    this.diaFinalSemana = moment(semana).endOf('week');
    this.startWeek = moment(semana).startOf('week').toDate()
    this.endWeek = moment(semana).endOf('week').toDate()
    this.changeWeek.emit({
      diaInicialSemana: this.diaInicialSemana,
      diaFinalSemana: this.diaFinalSemana
    }); */
    this.getData();
  }

  descargarInformeTurnos(turno) {}

  /* getData() {  ///  rrhh/turnos/asignacion
    this.loading = true;
    this._asignacion
      .getPeople(this.diaInicialSemana, this.formFilters.value)
      .subscribe((r: any) => {
        this.datosGenerales = r.data;
        this.loading = false;
        setTimeout(() => {
          this.changeWeek.emit({
            diaInicialSemana: this.diaInicialSemana,
            diaFinalSemana: this.diaFinalSemana,
          });
          // this.changeWeek.emit();
        }, 200);
      });
  } */
}
