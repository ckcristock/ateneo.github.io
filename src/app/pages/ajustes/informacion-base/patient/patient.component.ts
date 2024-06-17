import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
} from 'ng-apexcharts';

import { ImportPatientComponent } from './components/import-patient/import-patient.component';
import { EditPatientComponent } from './components/edit-patient/edit-patient.component';
import { ViewPatientComponent } from './components/view-patient/view-patient.component';
import { PatientService } from './patient.service';

import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { HeaderButtonComponent } from '@shared/components/standard-components/header-button/header-button.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
}

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatPaginatorModule,
    NgApexchartsModule,
    CardComponent,
    HeaderButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionViewComponent,
    ActionEditComponent,
    NotDataComponent,
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
})
export class PatientComponent implements OnInit {
  patients = [];

  regimen = [];

  levels = [];

  statisticsEps = [];

  statisticsData = [];

  chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      width: '400',
      type: 'donut',
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };

  filters: any = {
    identifier: '',
    name: '',
    eps: '',
    level_id: '',
    regimentype_id: '',
    state: '',
  };

  loading = true;

  loadingGraph = true;

  activeFilters: boolean = false;

  constructor(
    private readonly modalService: NgbModal,
    private readonly patientService: PatientService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getPatientChart();
    this.getUrlFilters();
    this.getPatients();
    this.getLevels();
    this.getRegimen();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  getPatients(): void {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filters,
    };
    this.patientService.getPatients(params).subscribe({
      next: (res) => {
        this.loading = false;
        this.patients = res.data.data;
        this.pagination.length = res.data.total;
      },
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  private getRegimen(): void {
    this.patientService.getRegimenType().subscribe({
      next: (res) => {
        this.regimen = res.data;
      },
    });
  }

  private getLevels(): void {
    this.patientService.getLevels().subscribe({
      next: (res) => {
        this.levels = res.data;
      },
    });
  }

  private getPatientChart(): void {
    this.patientService.getPatientsChart().subscribe({
      next: (res) => {
        this.loadingGraph = false;
        res.data.statistics.forEach((statis) => {
          this.chartOptions.series.push(statis.count);
          this.chartOptions.labels.push(statis.name);
        });
        this.statisticsEps = res.data.statistics_by_regimen.eps;
        this.statisticsData = res.data.statistics_by_regimen.data;
      },
    });
  }

  openImportPatient(): void {
    const modalRef = this.modalService.open(ImportPatientComponent, { centered: true, size: 'lg' });
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'request-import') this.getPatients();
      },
    });
  }

  openEditPatient(data: any): void {
    const modalRef = this.modalService.open(EditPatientComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.data = data;
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'request-edited') this.getPatients();
      },
    });
  }

  openViewPatient(data: any): void {
    const modalRef = this.modalService.open(ViewPatientComponent, { centered: true });
    modalRef.componentInstance.data = data;
  }
}
