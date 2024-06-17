import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { ProvisionesService } from './provisiones.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgFor, UpperCasePipe, CurrencyPipe } from '@angular/common';
import { CardComponent } from '@shared/components/standard-components/card/card.component';

interface CardProvisions {
  price: number;
  icon: string;
  title: string;
}

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
  selector: 'app-provisiones',
  templateUrl: './provisiones.component.html',
  styleUrls: ['./provisiones.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgApexchartsModule,
    NotDataComponent,
    UpperCasePipe,
    CurrencyPipe,
    CardComponent,
  ],
})
export class ProvisionesComponent implements OnInit {
  @ViewChild(ChartComponent) chart: ChartComponent;

  provisions: CardProvisions[] = [
    {
      icon: 'fa-money-bill-wave',
      title: 'Cesantías',
      price: 0,
    },
    {
      icon: 'fa-file-invoice-dollar',
      title: 'Inter. Cesantías',
      price: 0,
    },
    {
      icon: 'fa-comments-dollar',
      title: 'Prima',
      price: 0,
    },
    {
      icon: 'fa-umbrella-beach',
      title: 'Vacaciones',
      price: 0,
    },
    {
      icon: 'fa-coins',
      title: 'Tot. Provisiones',
      price: 0,
    },
  ];

  chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      width: '400',
      type: 'pie',
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

  loading: boolean = true;

  constructor(private readonly provisionesService: ProvisionesService) {}

  ngOnInit(): void {
    this.getProvisions();
  }

  private getProvisions(): void {
    const totalIndex = this.provisions.length - 1;
    const chartData = this.provisions.slice(0, totalIndex);
    this.chartOptions.labels = chartData.map((pro) => pro.title);
    this.provisionesService.getProvisions().subscribe({
      next: ({ data }) => {
        const someCorrectValue = Object.values(data).some((value) => !!value);
        if (someCorrectValue) {
          this.chartOptions.series = [
            data.severance,
            data.severanceInterest,
            data.bonus,
            data.vacations,
          ];
          this.chartOptions.series.forEach((series, index) => {
            this.provisions[index].price = series;
          });
          this.provisions[totalIndex].price = data.total;
        }
        this.loading = false;
      },
    });
  }
}
