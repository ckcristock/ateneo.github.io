import { Component, OnInit } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { DatePipe, Location, NgFor, NgIf, AsyncPipe, TitleCasePipe } from '@angular/common';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { User } from 'src/app/core/models/users.model';
import { UserService } from 'src/app/core/services/user.service';
import { GroupCompanyService } from 'src/app/shared/services/group-company.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { donutChart } from './data';
import { LateArrivalsService } from './late-arrivals.service';
import { PersonService } from '../../ajustes/informacion-base/services/person/person.service';
import moment from 'moment';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { Observable } from 'rxjs';
import { GlobalService } from '@shared/services/global.service';
import { ImagePipe } from '../../../core/pipes/image.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteFcComponent } from '../../../components/autocomplete-fc/autocomplete-fc.component';
import { DetalleLlegadaComponent } from './detalle-llegada/detalle-llegada.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgChartsModule } from 'ng2-charts';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-llegadas-tardes',
  templateUrl: './llegadas-tardes.component.html',
  styleUrls: ['./llegadas-tardes.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    NgChartsModule,
    NgFor,
    NgIf,
    MatExpansionModule,
    DetalleLlegadaComponent,
    NotDataComponent,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteFcComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    AsyncPipe,
    TitleCasePipe,
    ImagePipe,
  ],
})
export class LlegadasTardesComponent implements OnInit {
  datePipe = new DatePipe('es-CO');

  donutChart = donutChart;

  group_id: any;

  people_id: any;

  dependency_id: any;

  donwloading = false;

  public lineChartData: ChartDataset[] = [{ data: [], label: 'Llegadas tardes' }];

  public lineChartLabels: any = [];

  options: any = {
    scales: {
      yAxes: [
        {
          ticks: {
            precision: 0,
            stepSize: 1,
          },
        },
      ],
    },
    legend: { display: true, labels: { fontColor: 'black' } },
  };

  public lineChartColors: any = [
    {
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];

  cargando = true;

  companies: any = [];

  groupList: any[] = [];

  dependencyList: any[] = [];

  dataDiary = {
    percentage: 0,
    allByDependency: [],
    total: 0,
    time_diff_total: '0',
  };

  firstDay: any;

  lastDay: any;

  people$ = new Observable();

  loading: boolean;

  date: any;

  estadoFiltros = false;

  formFilters: UntypedFormGroup;

  orderObj: any;

  active_filters: boolean;

  permission: Permissions = {
    menu: 'Llegadas tarde',
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

  range = new FormGroup({
    start: new FormControl<Date | string | null>(null),
    end: new FormControl<Date | string | null>(null),
  });

  constructor(
    public router: Router,
    private readonly _lateArrivals: LateArrivalsService,
    private readonly _people: PersonService,
    private readonly permissionService: PermissionService,
    private readonly location: Location,
    private readonly fb: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly _user: UserService,
    private readonly _swal: SwalService,
    private readonly groupCompanyService: GroupCompanyService,
    readonly urlFiltersService: UrlFiltersService,
    private readonly globalService: GlobalService,
  ) {
    this.user = _user.user;
    this.getGroup();
    this.permission = this.permissionService.validatePermissions(this.permission);
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
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = event.pageIndex + 1;
    this.getLateArrivals();
  }

  resetFiltros() {
    for (const controlName in this.formFilters.controls) {
      this.formFilters.get(controlName).setValue('');
    }
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

  createFormFilters(): void {
    this.formFilters = this.fb.group({
      group_id: [''],
      dependency_id: [{ value: null, disabled: true }],
      people_id: [''],
      date_from: [''],
      date_to: [''],
    });
    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe((r) => {
      this.getLateArrivals();
      this.getStatisticsByDays();
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

  private handleFormatDate(dateFrom: Date, dateTo: Date): void {
    this.range.patchValue({
      start: dateFrom,
      end: dateTo,
    });
  }

  getLateArrivals() {
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
    this._lateArrivals
      .getLateArrivalsPaginated(fecha_ini, fecha_fin, params)
      .subscribe((res: any) => {
        //debe ir al servicio paginado y no lo está desde el servicio
        this.companies = res.data;
        this.loading = false;
        this.paginationMaterial = res.data;
        if (this.paginationMaterial.last_page < this.pagination.page) {
          this.paginationMaterial.current_page = 1;
          this.pagination.page = 1;
          this.getLateArrivals();
        }
        this.transformData();
      });
    this.urlFiltersService.setUrlFilters(params);
  }

  downloadLateArrivals() {
    let params = this.SetFiltros(this.pagination.page);
    this.donwloading = true;
    const fecha_ini =
      this.formFilters.controls.date_from.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_from.value;
    const fecha_fin =
      this.formFilters.controls.date_to.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_to.value;
    this._lateArrivals.downloadLateArrivals(fecha_ini, fecha_fin, params).subscribe(
      (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_llegadas_tarde';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.donwloading = false;
      },
      (error) => {
        this.donwloading = false;
        this._swal.hardError();
      },
      () => {
        this.donwloading = false;
      },
    );
  }

  getGroup(): void {
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

  getLinearDataset() {
    let params = this.SetFiltros(this.pagination.page);
    let fecha_inicio = moment().subtract(15, 'days').format('YYYY-MM-DD');
    let fecha_final = moment().format('YYYY-MM-DD');
    this._lateArrivals.getStatistcs(fecha_inicio, fecha_final, params).subscribe((r: any) => {
      this.getLast15Days(r.data.lates);
    });
  }

  getLast15Days(lates: any[]) {
    this.lineChartData = [{ data: [], label: 'Llegadas tardes' }];
    this.lineChartLabels = [];
    for (let i = 0; i < 15; i++) {
      let day = moment().subtract(i, 'days').format('DD');
      let dayFinded = lates.find((l) => l.day == day);
      let data = dayFinded ? dayFinded.total : 0;
      this.lineChartData[0].data.unshift(data);
      this.lineChartLabels.unshift(day);
    }
  }

  getStatisticsByDays() {
    let params = { type: 'diary' };
    const fecha_ini =
      this.formFilters.controls.date_from.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_from.value;
    const fecha_fin =
      this.formFilters.controls.date_to.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_to.value;

    this._lateArrivals.getStatistcs(fecha_ini, fecha_fin, params).subscribe((r: any) => {
      this.dataDiary.total = r.data.lates.total;
      this.dataDiary.time_diff_total = r.data.lates.time_diff_total;
      this.dataDiary.percentage = r.data.percentage;

      let d = r.data.allByDependency.reduce(
        (acc, el) => {
          return {
            labels: [...acc.labels, el.name],
            datasets: [...acc.datasets, el.total],
          };
        },
        { labels: [], datasets: [] },
      );

      this.donutChart.datasets[0].data = d.datasets;
      this.donutChart.labels = d.labels;
    });
  }

  transformData() {
    this.companies?.forEach((c) => {
      c.groups.forEach((g) => {
        if (Array.isArray(g.dependencies)) {
        } else {
          g.dependencies = Object.values(g.dependencies);
        }
        g.dependencies.forEach((d) => {
          d.people.forEach((pr) => {
            pr.averageTime = this.tiempoTotal(pr.late_arrivals);
          });
        });
      });
    });
  }

  tiempoEnMilisegundos(horaUno, horaDos) {
    let horaInicial = moment.utc(horaUno, 'HH:mm:ss');
    let horaFinal = moment.utc(horaDos, 'HH:mm:ss');
    if (horaFinal.isBefore(horaInicial)) {
      horaFinal.add(1, 'd');
    }
    let duracion = moment.duration(horaFinal.diff(horaInicial));
    return duracion.as('milliseconds');
  }

  tiempoTotal(llegadasTarde = []) {
    let total = llegadasTarde.length;
    let suma = 0;
    let promedio = 0;
    llegadasTarde.forEach((llegada) => {
      suma += this.tiempoEnMilisegundos(llegada.entry, llegada.real_entry);
    });
    //promedio = suma / total;
    promedio = suma;
    return moment.utc(promedio).format('HH:mm:ss');
  }
}
