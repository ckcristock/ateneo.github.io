import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from './job.service';
import Swal from 'sweetalert2';
import { MinicipalityService } from '../../../core/services/municipality.service';
import { DepartmentService } from '../../../core/services/department.service';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe, Location, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import {
  FormControl,
  FormGroup,
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import {
  FilterRolName,
  FilterRolesCompanyComponent,
} from '@shared/components/filter-roles-company/filter-roles-company.component';
import { setFilters } from '@shared/functions/url-filter.function';
import { PaginatorService } from 'src/app/services/paginator.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionButtonComponent } from '../../../shared/components/standard-components/action-button/action-button.component';
import { ActionEditComponent } from '../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    RouterLink,
    TableComponent,
    NgIf,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionButtonComponent,
    ActionDeactivateComponent,
    FilterRolesCompanyComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    DatePipe,
  ],
})
export class VacantesComponent implements OnInit {
  checkCodigo: boolean = true;
  checkPublicacion: boolean = true;
  checkInicio: boolean = true;
  checkFin: boolean = true;
  checkTitulo: boolean = true;
  checkDependencia: boolean = true;
  checkCargo: boolean = true;
  checkDepartamento: boolean = true;
  checkMunicipio: boolean = true;
  checkEstado: boolean = true;
  selectedCampos = [];
  camposForm = new UntypedFormControl(this.selectedCampos);
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }

  matPanel2 = false;
  openClose2() {
    if (this.matPanel2 == false) {
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  loading = false;
  timeout: any;
  user: any;
  page = 1;
  filtros = {
    fecha: '',
    fecha_Inicio: '',
    fecha_Fin: '',
    titulo: '',
    dependencia: '',
    cargo: '',
    departamento: '',
    municipio: '',
    estado: '',
  };
  jobs: any = [];
  TotalItems: number;
  municipalities: any[] = [];
  department: any[] = [];
  orderObj: any;
  filtrosActivos: boolean = false;
  dependencies: any[] = [];
  positions: any[] = [];

  datePipe = new DatePipe('es-CO');

  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  defaultParams!: FilterRolName;

  constructor(
    private _job: JobService,
    private _municipatilies: MinicipalityService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
    private _department: DepartmentService,
    private _swal: SwalService,
    private _paginator: PaginatorService,
    readonly urlFiltersService: UrlFiltersService,
  ) {
    this.paginator.itemsPerPageLabel = 'Items por página:';
  }

  ngOnInit() {
    this.getUrlFilters();
    this.getJobs();
    this.getMunicipalities();
    this.getDepartments();
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
    const { dependencia = 0, cargo = 0 } = this.urlFiltersService.currentFilters;
    this.defaultParams = {
      dependency_id: +dependencia,
      position: +cargo,
    };
    this.filtros = this.urlFiltersService.currentFilters as any;
  }

  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }

  selectedDate() {
    const start = this.range.get('start').value;
    const end = this.range.get('end').value;

    this.filtros.fecha_Inicio = this.datePipe.transform(start, 'yyyy-MM-dd');
    this.filtros.fecha_Fin = this.datePipe.transform(end, 'yyyy-MM-dd');
    this.getJobs();
  }

  onSelectRol(rol: FilterRolName): void {
    this.filtros.dependencia = String(rol.dependency_id);
    this.filtros.cargo = String(rol.position);
    this.getJobs();
  }

  resetFiltros() {
    for (let i in this.filtros) {
      this.filtros[i] = '';
    }
    this.filtrosActivos = false;
    this.getJobs();
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    this.getJobs();
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {}, 100);
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtros.fecha = event;
    } else {
      this.filtros.fecha = '';
    }
  }

  getMunicipalities() {
    this._municipatilies.getMinicipalities().subscribe((r: any) => {
      this.municipalities = r.data;
    });
  }

  getDepartments() {
    this._department.getDepartments().subscribe((r: any) => {
      this.department = r.data;
    });
  }

  getJobs() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this._job.getJobs(params).subscribe((r: any) => {
      this.jobs = r.data.data;
      this.loading = false;
      this.pagination.length = r.data.total;
      this.pagination.pageSize = r.data.per_page;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  cancelar(id) {
    this._swal
      .show({
        text: 'Vamos a cancelar esta vacante',
        title: '¿Estás seguro(a)?',
        icon: 'question',
        showCancel: true,
      })
      .then((result) => {
        if (result.value) {
          this.sendData(id);
        }
      });
  }

  sendData(id) {
    this._job.setState(id, { state: 'Cancelada' }).subscribe((r: any) => {
      if (r.code == 200) {
        this._swal.show({
          text: '',
          title: 'Cancelación exitosa',
          icon: 'success',
          showCancel: false,
          timer: 1000,
        });
      }
      this.getJobs();
    });
  }
}
