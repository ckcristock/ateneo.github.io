import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertasComunService } from './alertas-comun.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { PersonService } from '../../ajustes/informacion-base/services/person/person.service';
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { setFilters } from '@shared/functions/url-filter.function';
import {
  FilterRolName,
  hideSelect,
} from '@shared/components/filter-roles-company/filter-roles-company.component';
import { Location, NgIf, DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '../../../shared/components/automatic-search/automatic-search.component';
import { FilterRolesCompanyComponent } from '../../../shared/components/filter-roles-company/filter-roles-company.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

@Component({
  selector: 'app-alertas-comun',
  templateUrl: './alertas-comun.component.html',
  styleUrls: ['./alertas-comun.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    NgIf,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    FilterRolesCompanyComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    TextFieldModule,
    DatePipe,
  ],
})
export class AlertasComunComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: UntypedFormGroup;
  datas: any[] = [];
  loading: boolean = false;
  groups: any[] = [];
  dependencies: any[] = [];
  people: any[] = [];
  estadoFiltros = false;
  closeResult = '';
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  objDate = {
    start_date: '',
    end_date: '',
  };

  formFilter!: FormGroup;

  defaultParams!: FilterRolName;

  activeFilters: boolean = false;

  addHideSelect: hideSelect = {
    dependency_id: true,
    person_id: true,
    position: true,
  };

  constructor(
    private _alert: AlertasComunService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private _dependecies: DependenciesService,
    private _group: GroupService,
    private _person: PersonService,
    private fb: UntypedFormBuilder,
    private _user: UserService,
    private _swal: SwalService,
    private readonly location: Location,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.initFormFilter();
    this.getUrlFilters();
    this.getAlerts();
    this.getGroups();
    this.createForm();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    let { start_date, end_date, ...paramsForm } = this.urlFiltersService.currentFilters;
    if (start_date || end_date) {
      start_date = new Date(start_date.replaceAll('-', '/'));
      end_date = new Date(end_date.replaceAll('-', '/'));
    }
    this.defaultParams = {
      dependency_id: paramsForm.dependency_id ?? 0,
      person_id: paramsForm.person_id ?? 0,
    };
    this.formFilter.patchValue({ ...paramsForm, start_date, end_date });
  }

  createForm() {
    this.form = this.fb.group({
      person_id: this._user.user.id,
      type: ['', Validators.required],
      group_id: [0, Validators.required],
      dependency_id: [0, Validators.required],
      user_id: [0, Validators.required],
      description: ['', Validators.required],
    });
  }

  private initFormFilter(): void {
    this.formFilter = this.fb.group({
      type: [''],
      start_date: [''],
      end_date: [''],
      dependency_id: [''],
      person_id: [''],
    });
  }

  resetFiltros() {
    this.formFilter.reset();
    this.activeFilters = false;
  }

  onTypeSearch(type: string): void {
    this.formFilter.get('type').setValue(type);
    this.getAlerts();
  }

  onFilterRoles(roles: FilterRolName): void {
    this.formFilter.patchValue({
      dependency_id: roles.dependency_id,
      person_id: roles.person_id,
    });
    this.getAlerts();
  }

  onSelectedDate(): void {
    const endDate = this.formFilter.get('end_date').value;
    const startDate = this.formFilter.get('start_date').value;
    const transformDate = ({ date, month, year }) => {
      return `${year}-${month + 1}-${date}`;
    };
    this.objDate = {
      end_date: transformDate(endDate._i),
      start_date: transformDate(startDate._i),
    };
    this.getAlerts();
  }

  async createAlert(): Promise<void> {
    if (!this.form.valid) {
      this._swal.incompleteError();
      this.form.markAllAsTouched();
      return;
    }
    this.form.patchValue({
      person_id: this._user.user.id,
    });
    try {
      await this._swal.confirm('Vamos a agregar la alerta', {
        preConfirm: () => {
          return this.sendAlert();
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      this._swal.hardError();
    }
    this._swal.show({
      title: 'Agregado con éxito',
      icon: 'success',
      text: '',
      timer: 1000,
      showCancel: false,
    });
  }

  sendAlert() {
    return new Promise((resolve) => {
      this._alert.sendAlert(this.form.value).subscribe(
        (res: any) => {
          this.modalService.dismissAll();
          this.getAlerts();
          this.form.reset();
          resolve(true);
        },
        () => {
          this._swal.hardError();
          resolve(false);
        },
      );
    });
  }

  public openConfirm(confirm) {
    this.addHideSelect = {
      dependency_id: true,
      person_id: true,
      position: true,
    };

    this.modalService.open(confirm, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      scrollable: true,
    });
  }

  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.groups = r.data;
      this.groups.unshift({ text: 'Todas', value: 'Todas' });
    });
  }

  getDependencies(group_id) {
    if (group_id == '0') {
      this.dependencies = [];
      this.dependencies.unshift({ text: 'Todas', value: 'Todas' });
      return false;
    }
    this._dependecies.getDependencies({ group_id }).subscribe((d: any) => {
      this.dependencies = d.data;
      this.dependencies.unshift({ text: 'Todas', value: 'Todas' });
    });
  }

  getPeople(dependencies) {
    this._person.getAll({ dependencies: [dependencies] }).subscribe((r: any) => {
      this.people = r.data;
      this.people.unshift({ value: 'Todos', text: 'Todos' });
    });
  }

  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }

  openModal() {
    this.modal.show();
  }

  getAlerts() {
    this.loading = true;
    const form = {};
    Object.keys(this.formFilter.value).forEach((key) => {
      if (!!this.formFilter.value[key] && !key.includes('date'))
        form[key] = this.formFilter.value[key];
    });
    let person_id = this.route.snapshot.params.pid;
    let param = person_id ? { person_id } : {};
    let params = {
      ...param,
      ...this.pagination,
      ...form,
      ...this.objDate,
    };
    this._alert.getAlerts(params).subscribe((r: any) => {
      this.datas = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  /* ADD */

  onSelectRoleAdd(roles: FilterRolName): void {
    this.addHideSelect.dependency_id = !roles.group_id;
    this.addHideSelect.person_id = !roles.dependency_id;
    const { person_id, ...rolesSelect } = roles;
    this.form.patchValue({ user_id: person_id, ...rolesSelect });
  }
}
