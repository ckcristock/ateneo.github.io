import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/services/person/person.service';
import { ChartDataset, ChartType } from 'chart.js';
import moment from 'moment';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import {
  NgClass,
  NgIf,
  AsyncPipe,
  UpperCasePipe,
  DecimalPipe,
  TitleCasePipe,
  DatePipe,
} from '@angular/common';
import { DotacionService } from '../../dotacion.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { GlobalService } from '@shared/services/global.service';
import { Observable } from 'rxjs';
import { PuntosPipe } from '../../../../../core/pipes/puntos';
import { ModalBasicComponent } from '../../../../../components/modal-basic/modal-basic.component';
import { TableStockComponent } from '../table-stock/table-stock.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutocompleteMdlComponent } from '../../../../../components/autocomplete-mdl/autocomplete-mdl.component';
import { NgChartsModule } from 'ng2-charts';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CabeceraComponent } from 'src/app/components/cabecera/cabecera.component';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';

@Component({
  selector: 'app-table-inventary',
  templateUrl: './table-inventary.component.html',
  styleUrls: ['./table-inventary.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    HeaderButtonComponent,
    TableComponent,
    NgClass,
    DropdownActionsComponent,
    ActionButtonComponent,
    NgChartsModule,
    NgIf,
    AutocompleteMdlComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    TableStockComponent,
    ModalBasicComponent,
    AsyncPipe,
    UpperCasePipe,
    DecimalPipe,
    TitleCasePipe,
    DatePipe,
    PuntosPipe,
    ActionActivateComponent,
    ActionDeactivateComponent,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    CabeceraComponent,
  ],
})
export class TableInventaryComponent implements OnInit {
  @ViewChild('tablestock') tablestock;

  public flagDotacionApp = '';

  selectedMes: string;

  nombre = '';

  public TotalesMes = 0;

  public Totales = 0;

  public TotalesDotaciones = 0;

  public totalEpp = 0;

  public CantidadTotal: 0;

  public SumaMes = 0;

  people$ = new Observable();

  person = '';

  persontwo = '';

  cod = '';

  type = '';

  delivery = '';

  art = '';

  filtrosVer = false;

  downloading = false;

  public Empleados: any[] = [];

  public Lista_Dotaciones: any = [];

  filtros: any = {
    cod: '',
    type: '',
    recibe: '',
    entrega: '',
    name: '',
    description: '',
    fechaD: '',
    delivery: '',
    state: '',
  };

  pagination = {
    pageSize: 15,
    page: 1,
    length: 0,
  };

  headerData: any = {
    Titulo: 'Nueva entrega de dotación',
    Fecha: new Date(),
  };

  datePipe = new DatePipe('es-CO');

  date = new Date();

  formDateRange = new FormGroup({
    start: new FormControl<Date | string | null>(
      new Date(this.date.setDate(this.date.getDay() - 30)),
    ),
    end: new FormControl<Date | string | null>(new Date()),
  });

  loading = false;

  constructor(
    private readonly _dotation: DotacionService,
    private readonly _person: PersonService,
    private readonly _swal: SwalService,
    private readonly _modal: ModalService,
    private readonly globalService: GlobalService,
    private readonly consecutiveService: ConsecutivosService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.selectedMes = moment().format('Y-MM');
    this.getUrlFilters();
    this.people$ = this.globalService.getAllPeople$;
    this.listarTotales(this.selectedMes);
    this.Graficar();
    this.Lista_Empleados();
    this.ListarDotaciones();
    this.getHeaderData();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
    const { firstDay, lastDay } = this.filtros;
    if (firstDay && lastDay) {
      this.formDateRange.patchValue({
        start: new Date(firstDay.replaceAll('-', '/')),
        end: new Date(lastDay.replaceAll('-', '/')),
      });
    }
  }

  private getHeaderData() {
    this.consecutiveService.getConsecutivo('dotations').subscribe({
      next: (res: any) => {
        this.headerData.Codigo = this.consecutiveService.construirConsecutivo(res.data) as any;
      },
    });
  }

  openConfirm(content: any, value: string) {
    this.tablestock.search(value);
    this._modal.open(content, 'xl');
    this.flagDotacionApp = value;
  }

  filtrar() {
    this.ListarDotaciones();
    this.listarTotales(null);
    this.Graficar();
  }

  listarTotales(cantMes) {
    this._dotation
      .getCuantityDispatched({
        ...this.transformDate(),
        person: this.person,
        persontwo: this.persontwo,
        cod: this.cod,
        type: this.type,
        delivery: this.delivery,
        art: this.art,
      })
      .subscribe({
        next: (r: any) => {
          this.TotalesMes = r.data.month.totalMes;
          this.SumaMes = r.data.month.totalCostoMes;

          this.CantidadTotal = r.data.year.totalAnual;
          this.Totales = r.data.year.totalCostoAnual;

          this.TotalesDotaciones = r.data.td.totalDotacion;
          this.totalEpp = r.data.te.totalEpp;
        },
      });
  }

  closeModal() {
    this._modal.close();
    this.ListarDotaciones();
    // this.flagDotacionApp = ''
  }

  public barChartOptions: any = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartLabels: any = ['Categorías'];

  public barChartType: ChartType = 'bar';

  public barChartLegend = true;

  public barChartData: ChartDataset[] = [];

  graphicData: any = {};

  Graficar() {
    // this._dotation.getDotationTotalByCategory({ cantMes: this.selectedMes }).subscribe((d: any) => {
    this._dotation
      .getDotationTotalByCategory({
        ...this.transformDate(),
        person: this.person,
        persontwo: this.persontwo,
        cod: this.cod,
        type: this.type,
        delivery: this.delivery,
        art: this.art,
      })
      .subscribe((d: any) => {
        const totals: any[] = d.data;

        if (totals) {
          this.barChartData = totals.reduce((acc, el) => {
            const daSet = { data: [el.value], label: [el.name] };
            return [...acc, daSet];
          }, []);
        }
      });
  }

  downloadDeliveries() {
    const params = '';
    this.downloading = true;
    const { firstDay, lastDay } = this.transformDate();
    this._dotation.downloadDeliveries(firstDay, lastDay, params).subscribe(
      (response: BlobPart) => {
        const blob = new Blob([response], { type: 'application/excel' });
        const link = document.createElement('a');
        const filename = 'reporte_inventario';
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

  ListarDotaciones() {
    const params = {
      ...this.pagination,
      ...this.filtros,
      ...this.transformDate(),
      person: this.person,
      persontwo: this.persontwo,
      cod: this.cod,
      type: this.type,
      delivery: this.delivery,
      art: this.art,
    };
    this.loading = true;
    this._dotation.getDotations(params).subscribe((r: any) => {
      this.Lista_Dotaciones = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  dateRangeChanged(event) {
    if (event.formatted != '') {
      this.filtros.fechaD = event.formatted;
      this.ListarDotaciones();
    } else {
      this.filtros.fechaD = '';
      this.ListarDotaciones();
    }
  }

  Lista_Empleados() {
    this._person.getPeopleIndex().subscribe((r: any) => {
      this.Empleados = r.data;
    });
  }

  anularDotacion(id) {
    const request = () => {
      this._dotation.setDotation({ id, data: { state: 'Anulada' } }).subscribe((r: any) => {
        if (r.code == 200) {
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            showCancel: false,
            text: 'Dotación actualizada',
            timer: 1000,
          });
          this.ListarDotaciones();
        } else {
          this._swal.show({
            icon: 'error',
            title: 'Operación denegada',
            showCancel: false,
            text: r.err,
          });
        }
      });
    };
    this._swal.swalLoading('Vas a cambiar el estado de la dotación', request);
  }

  aprobarDotacion(id) {
    const request = () => {
      this._dotation.approveDotation({ id, data: { state: 'Aprobado' } }).subscribe((r: any) => {
        if (r.code == 200) {
          this._swal.show({
            icon: 'success',
            title: 'Operación exitosa',
            showCancel: false,
            text: 'Dotación aprobada',
            timer: 1000,
          });
          this.ListarDotaciones();
        } else {
          this._swal.show({
            icon: 'error',
            title: 'Operación denegada',
            showCancel: false,
            text: r.err,
          });
        }
      });
    };
    this._swal.swalLoading('Vas a aprobar la dotación', request);
  }

  private transformDate() {
    const { start, end } = this.formDateRange.value;
    return {
      firstDay: this.datePipe.transform(start, 'yyyy-MM-dd'),
      lastDay: this.datePipe.transform(end, 'yyyy-MM-dd'),
    };
  }

  descargarPDF(id) {
    this._dotation.getPDF(id).subscribe((r: any) => {
      const blob = new Blob([r], { type: 'application/pdf' });
      const link = document.createElement('a');
      const filename = 'reporte_inventario';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
    });
  }
}
