import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import moment from 'moment';
import { PayrollFactorService } from './payroll-factor.service';
import { MatAccordion } from '@angular/material/expansion';
import { NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { GlobalService } from '@shared/services/global.service';
import { Observable } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteFcComponent } from '../../../components/autocomplete-fc/autocomplete-fc.component';
import { ActionEditComponent } from '../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { LoadImageComponent } from '../../../shared/components/load-image/load-image.component';
import { TableComponent } from '../../../shared/components/standard-components/table/table.component';
import { HeaderButtonComponent } from '../../../shared/components/standard-components/header-button/header-button.component';
import { CrearNovedadComponent } from './crear-novedad/crear-novedad.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ListFilesComponent } from '../procesos/components/list-files/list-files.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss'],
  standalone: true,
  imports: [
    CrearNovedadComponent,
    CardComponent,
    HeaderButtonComponent,
    AddButtonComponent,
    TableComponent,
    LoadImageComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    AsyncPipe,
    DatePipe,
    MatDatepickerModule,
    MatButtonModule,
    ViewMoreComponent,
  ],
})
export class NovedadesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openModal = new EventEmitter<any>();
  form: UntypedFormGroup;
  people: any[] = [];
  peopleCount: any[] = [];
  people$ = new Observable();
  loading = false;
  paylads: any[] = [];
  downloading = false;

  datePipe = new DatePipe('es-CO');

  activeFilters: boolean = false;

  constructor(
    private _payroll: PayrollFactorService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
    private readonly globalService: GlobalService,
    private readonly urlFiltersService: UrlFiltersService,
    private readonly modalService: NgbModal,
  ) {}
  ngOnInit() {
    this.people$ = this.globalService.getAllPeople$;
    this.createFrom();
    this.getUrlFilters();
    this.cargarNovedades();
    this.getTypes();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.form.patchValue(this.urlFiltersService.currentFilters);
    if (Object.keys(this.urlFiltersService.currentFilters).length > 2) this.activeFilters = true;
  }

  download() {
    let params = this.form.value;
    this.downloading = true;

    this._payroll.download(params).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = `reporte-novedades-${this.datePipe.transform(new Date(), 'yyyy-MM-dd')}`;
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.downloading = false;
      },
      (error) => {
        this.downloading = false;
        this._swal.hardError();
      },
      () => {
        this.downloading = false;
      },
    );
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros;
  }

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  onChangeDate() {
    const { date_end, date_start } = this.form.value;
    this.form.patchValue({
      date_start: moment(date_start).format('YYYY-MM-DD'),
      date_end: moment(date_end).format('YYYY-MM-DD'),
    });
    this.cargarNovedades();
  }

  cargarNovedades() {
    this.count();
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.form.value,
    };
    if (!params.personfill) params.personfill = '';
    if (!params.type) params.type = '';
    this._payroll.getPayrollFactorPeople(params).subscribe((r: any) => {
      this.loading = false;
      this.people = r.data.data;
      this.pagination.length = r.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  count() {
    this._payroll.count(this.form.value).subscribe((r: any) => {
      this.peopleCount = r.data;
      this.paylads = this.peopleCount.reduce(this.reducePayloads, []);
    });
  }
  types: any[] = [];
  getTypes() {
    this._payroll.getTypes().subscribe((res: any) => {
      this.types = res.data;
    });
  }

  createFrom() {
    let dateStart = moment().startOf('month').format(moment.HTML5_FMT.DATE);
    let dateEnd = moment().endOf('month').format(moment.HTML5_FMT.DATE);
    //novedades del mes actual
    this.form = this.fb.group({
      date_start: [dateStart, Validators.required],
      date_end: [dateEnd, Validators.required],
      personfill: [''],
      type: [''],
    });
  }

  openListFiles(list: any[]): void {
    const modalRef = this.modalService.open(ListFilesComponent, { centered: true });
    modalRef.componentInstance.listFiles = list;
    modalRef.componentInstance.isRemove = false;
  }

  resetFiltros() {
    this.form.reset();
    this.activeFilters = false;
  }

  editarNovedad(fact) {
    this.openModal.next({ data: fact });
  }

  get totalVacaciones() {
    return this.paylads.filter((r) => r.disability_type == 'Vacaciones').length;
  }
  get totalIncapacidades() {
    return this.paylads.filter((r) => r.disability_type == 'Incapacidad').length;
  }
  get totalLicencias() {
    return this.paylads.filter((r) => r.disability_type == 'Licencia').length;
  }
  get totalPermisos() {
    return this.paylads.filter((r) => r.disability_type == 'Permisos').length;
  }
  get totalAbandonos() {
    return this.paylads.filter((r) => r.disability_type == 'Abandono').length;
  }
  get totalSuspensiones() {
    return this.paylads.filter((r) => r.disability_type == 'Suspensión').length;
  }

  reducePayloads = (acc, el) => [...acc, ...el.payroll_factors];
}
