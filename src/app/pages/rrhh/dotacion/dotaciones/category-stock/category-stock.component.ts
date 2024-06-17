import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataset, ChartType } from 'chart.js';
import { DotacionService } from '../../dotacion.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgChartsModule } from 'ng2-charts';
import { TableStockComponent } from '../table-stock/table-stock.component';
import {
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-category-stock',
  templateUrl: './category-stock.component.html',
  styleUrls: ['./category-stock.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    TableStockComponent,
    NgbNavOutlet,
    NgChartsModule,
    NotDataComponent,
  ],
})
export class CategoryStockComponent implements OnInit {
  constructor(
    private _dotation: DotacionService,
    private _swal: SwalService,
  ) {}

  @ViewChild('tablestock') private tablestock;

  @Input('loading') loading;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll();
      this.matPanel = true;
    } else {
      this.accordion.closeAll();
      this.matPanel = false;
    }
  }
  nombre: string = '';
  donwloading = false;

  firstDay: any;
  lastDay: any;

  active = 1;

  ngOnInit(): void {
    this.loading = true;
    this.Graficar();
  }

  findName() {
    this.tablestock.getData(1, this.nombre);
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
      .getTotatInventary({
        // firstDay: this.firstDay,
        // lastDay: this.lastDay,
        // person: this.people_id,
        //  persontwo: this.people_id_two,
        //  cod: this.cod,
        //  type: this.type,
        //  delivery: this.delivery,
        //  art: this.art,
      })
      .subscribe((d: any) => {
        let totals: any[] = d.data;

        if (totals) {
          this.barChartData = totals.reduce((acc, el) => {
            let daSet = { data: [el.value], label: [el.name] };
            return [...acc, daSet];
          }, []);
        }
      });
  }

  DownloadInventoryDotation() {
    // let params = this.getParams();
    let fecha = new Date();
    let fecha2 = new Date();
    this.firstDay = new Date(fecha.setDate(fecha.getDate() - 30)).toISOString().split('T')[0];
    this.lastDay = new Date(fecha2.setDate(fecha2.getDate())).toISOString().split('T')[0];
    let params = '';
    this.donwloading = true;
    this._dotation.DownloadInventoryDotation(this.firstDay, this.lastDay, params).subscribe(
      (response: BlobPart) => {
        // this._dotation.downloadDotations().subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_inventario';
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
}
