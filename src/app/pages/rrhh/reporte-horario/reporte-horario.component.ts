import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import moment from 'moment';
import { ReporteHorarioService } from './reporte-horario.service';
import { PersonService } from '../../ajustes/informacion-base/services/person/person.service';
import { DatePipe, Location, NgIf } from '@angular/common';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/users.model';
import { HttpParams } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PageEvent } from '@angular/material/paginator';
import { GroupCompanyService } from 'src/app/shared/services/group-company.service';
import { FilterRolName } from '@shared/components/filter-roles-company/filter-roles-company.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterRolesCompanyComponent } from '../../../shared/components/filter-roles-company/filter-roles-company.component';
import { DetalleReporteComponent } from './detalle-reporte/detalle-reporte.component';
import { HeaderButtonComponent } from '../../../shared/components/standard-components/header-button/header-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-reporte-horario',
  templateUrl: './reporte-horario.component.html',
  styleUrls: ['./reporte-horario.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    HeaderButtonComponent,
    DetalleReporteComponent,
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    FilterRolesCompanyComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class ReporteHorarioComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  loading: boolean;
  date: any;
  estadoFiltros = false;
  formFilters: UntypedFormGroup;
  orderObj: any;
  active_filters: boolean = false;
  permission: Permissions = {
    menu: 'Reporte de horarios',
    permissions: {
      show: true,
      add: true,
      modify_hours: true,
    },
  };
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: '',
  };
  user: User;

  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  reporteHorarios: any[] = [];
  groupList: any[] = [];
  dependencyList: any[] = [];
  people: any[] = [];

  defaultParams!: FilterRolName;

  constructor(
    private _reporteHorario: ReporteHorarioService,
    private _people: PersonService,
    private _permission: PermissionService,
    private location: Location,
    private fb: UntypedFormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private _user: UserService,
    private _swal: SwalService,
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
    } else {
      this.router.navigate(['/notautorized']);
    }
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    const { date_from, date_to } = this.urlFiltersService.currentFilters;
    if (date_from || date_to) {
      this.range.patchValue({
        start: new Date(date_from.replaceAll('-', '/')),
        end: new Date(date_to.replaceAll('-', '/')),
      });
    }
    this.formFilters.patchValue(this.urlFiltersService.currentFilters);
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    this.getDiaries();
  }

  resetFiltros() {
    this.formFilters.reset();
    this.active_filters = false;
  }

  SetFiltros(paginacion) {
    let params = new HttpParams();
    params = params.set('pag', paginacion);
    params = params.set('pageSize', this.pagination.pageSize);
    for (const controlName in this.formFilters.controls) {
      const control = this.formFilters.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      turn_type: ['Rotativo'],
      group_id: [''],
      dependency_id: [''],
      person_id: [''],
      date_from: [''],
      date_to: [''],
    });
    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getDiaries();
    });
    this.formFilters.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.formFilters.get('dependency_id').enable();
        this.getDependencies(valor);
      } else {
        this.formFilters.patchValue({ dependency_id: '' });
        this.formFilters.get('dependency_id').disable();
      }
    });
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.formFilters.patchValue({
          date_from: this.datePipe.transform(r.start, 'yyyy-MM-dd'),
          date_to: this.datePipe.transform(r.end, 'yyyy-MM-dd'),
        });
      }
    });
  }

  setFormFilters(filters: FilterRolName): void {
    this.formFilters.patchValue({
      person_id: +filters.person_id,
      dependency_id: +filters.dependency_id,
      group_id: +filters.group_id,
    });
  }

  private handleFormatDate(dateFrom: Date, dateTo: Date): void {
    this.range.patchValue({
      start: dateFrom,
      end: dateTo,
    });
  }

  getDiaries() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value,
    };
    const fecha_ini =
      this.formFilters.controls.date_from.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_from.value;
    const fecha_fin =
      this.formFilters.controls.date_to.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_to.value;
    this._reporteHorario.getFixedTurnsDiaries(fecha_ini, fecha_fin, params).subscribe((r) => {
      this.reporteHorarios = r.data;
      this.loading = false;
      //falta paginación, es necearia??
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  getPeople() {
    this._people.getPersonCompany().subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: '' });
    });
  }

  private getGroup(): void {
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
    const { dependencies } = this.groupList.find((group) => group.value === value);
    this.dependencyList = [{ value: '', text: 'Todas' }, ...dependencies];
  }

  get turn_type_value() {
    const turnType = this.formFilters.get('turn_type').value;
    if (turnType === 'Todos') {
      // Si se selecciona la opción "Todos"
      return ''; // Retorna un valor vacío para que se muestren todos los datos
    }
    return turnType; // De lo contrario, retorna el valor del campo de filtro
  }

  downloading = false;
  download() {
    const fecha_ini =
      this.formFilters.controls.date_from.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_from.value;
    const fecha_fin =
      this.formFilters.controls.date_to.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_to.value;

    this.downloading = true;

    this._reporteHorario.download(fecha_ini, fecha_fin, this.getForm()).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_llegadas_tarde';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.downloading = false;
      },
      (error) => {
        this._swal.hardError();
        this.downloading = false;
      },
      () => {
        this.downloading = false;
      },
    );
  }

  getForm() {
    let form = this.formFilters.value;
    if (form.person_id == null) {
      delete form.person_id;
    }
    return form;
  }
}
