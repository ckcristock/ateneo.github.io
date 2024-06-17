import { Component, EventEmitter, OnInit } from '@angular/core';
import { ModalPaymentComponent } from 'src/app/components/modal-payment/modal-payment.component';
import { AppointmentService } from 'src/app/core/services/appointment.service';
import { NgIf, NgFor, NgClass, DecimalPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { StatsComponent } from '../../../components/stats/stats.component';
import { ModalPaymentComponent as ModalPaymentComponent_1 } from '../../../components/modal-payment/modal-payment.component';

@Component({
  selector: 'app-recaudos',
  templateUrl: './recaudos.component.html',
  styleUrls: ['./recaudos.component.scss'],
  providers: [ModalPaymentComponent],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    StatsComponent,
    NgIf,
    NgFor,
    NgClass,
    ModalPaymentComponent_1,
    DecimalPipe,
    DatePipe,
    CardComponent,
    TableComponent,
    ViewMoreComponent,
    AutomaticSearchComponent,
    UpperCasePipe,
  ],
})
export class RecaudosComponent implements OnInit {
  openModalRecaudo = new EventEmitter<any>();
  loading = false;
  citas: Array<any> = [];
  startDate = new Date().toISOString().slice(0, 10);
  filters: any = {
    patient: null,
    date: this.startDate,
  };
  pagination = {
    pageSize: 25,
    page: 1,
    length: 0,
  };

  public appointmentConfirm = 0;
  public appointmentCollection = 0;
  public appointmentCollectionAll = 0;

  constructor(
    private _appointment: AppointmentService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.activeObservable();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  /**
   * activeObservable
   */
  public activeObservable() {
    this.searchPatient();
    this.statistics();
  }

  public searchPatient() {
    this.loading = true;
    let params: any = Object.assign({}, this.pagination, this.filters);
    this._appointment.getAppointmentsPendding(params).subscribe((r: any) => {
      this.citas = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  public statistics() {
    this._appointment.getStatistics().subscribe((res: any) => {
      const data = res.data;
      this.appointmentConfirm = data.appointmentConfirm;
      this.appointmentCollection = data.appointmentCollection;
      this.appointmentCollectionAll = data.appointmentCollectionAll;
    });
  }

  recaudoCuota(item) {
    let modalDetalle = {
      citaDetail: item,
      Show: true,
    };

    this.openModalRecaudo.emit(modalDetalle);
  }
}
