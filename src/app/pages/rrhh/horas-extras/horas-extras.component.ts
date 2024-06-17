import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { ExtraHoursService } from './extra-hours.service';
import { PersonService } from '../../ajustes/informacion-base/services/person/person.service';
import { MatAccordion } from '@angular/material/expansion';
import {
  DatePipe,
  Location,
  NgIf,
  NgFor,
  NgClass,
  AsyncPipe,
  TitleCasePipe,
} from '@angular/common';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/users.model';
import { PageEvent } from '@angular/material/paginator';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { Observable } from 'rxjs';
import { GlobalService } from '@shared/services/global.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutocompleteFcComponent } from '../../../components/autocomplete-fc/autocomplete-fc.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ListaFijosComponent } from './lista-fijos/lista-fijos.component';
import { LoadImageComponent } from '../../../shared/components/load-image/load-image.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    NgIf,
    NgFor,
    LoadImageComponent,
    NgClass,
    ListaFijosComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    AutocompleteFcComponent,
    MatDatepickerModule,
    MatButtonModule,
    NotDataComponent,
    AsyncPipe,
    TitleCasePipe,
  ],
})
export class HorasExtrasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  datePipe = new DatePipe('es-CO');
  loading: boolean;
  matPanel: boolean;
  date: any;
  estadoFiltros = false;
  formFilters: UntypedFormGroup;
  orderObj: any;
  permission: Permissions = {
    menu: 'Validación horas extras',
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

  primerDiaSemana = moment().startOf('week').format('YYYY-MM-DD');
  ultimoDiaSemana = moment().endOf('week').format('YYYY-MM-DD');
  semana = moment().format(moment.HTML5_FMT.WEEK);
  horasExtras: any[] = [];
  diasSemanaActual: any[] = [];
  turnType = 'Rotativo';
  person_id = '';
  people$ = new Observable();
  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  activeFilters = false;

  constructor(
    private _extraHours: ExtraHoursService,
    private _people: PersonService,
    private _userService: UserService,
    private _permission: PermissionService,
    private location: Location,
    private fb: UntypedFormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private readonly urlFiltersService: UrlFiltersService,
    private readonly globalService: GlobalService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();

      this.getUrlFilters();

      this.people$ = this.globalService.getAllPeople$;
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

    if (Object.keys(this.urlFiltersService.currentFilters).length > 2) this.activeFilters = true;
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    this.getPeople();
  }

  resetFiltros() {
    for (const controlName in this.formFilters.controls) {
      this.formFilters.get(controlName).setValue('');
    }
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
      person_id: [''],
      date_from: [''],
      date_to: [''],
    });
    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getPeople();
    });
    this.range.valueChanges.subscribe((r) => {
      if (r.start && r.end) {
        this.formFilters.patchValue({
          date_from: this.datePipe.transform(r.start, 'yyyy-MM-dd'),
          date_to: this.datePipe.transform(r.end, 'yyyy-MM-dd'),
        });
      }
    });
    //Falta chequear la relación entre los filtros para establecer las peticiones al cambiar la seleccion
    /*  this.formFilters.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.formFilters.get('dependency_id').enable();
        //this.getDependencies(valor);
      } else {
        this.formFilters.patchValue({ dependency_id: 0 });
        this.formFilters.get('dependency_id').disable();
      }
    }); */
  }

  private handleFormatDate(dateFrom: Date, dateTo: Date): void {
    this.range.patchValue({
      start: dateFrom,
      end: dateTo,
    });
  }

  getPeople() {
    ///rrhh/turnos/horas-extras
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value,
      company_id: this._userService.user.person.company_worked.id,
    };
    const fecha_ini =
      this.formFilters.controls.date_from.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_from.value;
    const fecha_fin =
      this.formFilters.controls.date_to.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_to.value;
    this._extraHours
      .getPeople(
        fecha_ini,
        fecha_fin,
        //this.turnType,
        this.formFilters.controls.turn_type.value,
        params,
      )
      .subscribe((r: any) => {
        this.loading = false;
        this.horasExtras = r.data;
      });
    this.urlFiltersService.setUrlFilters(params);
  }
}
