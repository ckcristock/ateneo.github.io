import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';

import { ReportDetailsComponent } from '../report-details/report-details.component';
import { PayRollPaymentsService } from '../../pay-roll-payments.service';
import { DataSheetComponent } from '@shared/components/data-sheet/data-sheet.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-view-report',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DataSheetComponent,
    ViewMoreComponent,
    StandardModule,
    StatusBadgeComponent,
  ],
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.scss',
})
export class ViewReportComponent implements OnInit {
  reports = [];

  pagination = {
    length: 0,
    pageSize: 10,
    page: 1,
  };

  id = 0;

  totalReported = 0;

  totalSuccessful = 0;

  totalPending = 0;

  totalErrors = 0;

  loading = false;

  constructor(
    private readonly payrollPaymentsService: PayRollPaymentsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modalService: NgbModal,
  ) {
    this.id = +activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getDetailsDianReport();
  }

  getDetailsDianReport(): void {
    this.loading = true;
    this.payrollPaymentsService.getDetailsDianReport(this.id, { ...this.pagination }).subscribe({
      next: (res) => {
        const { total_error, total_pending, total_reported, total_success } = res['additionalData'];
        this.totalReported = total_reported;
        this.totalSuccessful = total_success;
        this.totalPending = total_pending;
        this.totalErrors = total_error;
        this.reports = res.data.data;
        this.pagination.length = res.data.total;
        this.loading = false;
      },
    });
  }

  openReportDetails(): void {
    this.modalService.open(ReportDetailsComponent, { size: 'lg' });
  }
}
