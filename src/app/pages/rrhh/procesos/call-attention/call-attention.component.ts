import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateCallAttentionComponent } from './create-call-attention/create-call-attention.component';

import { MemorandosService } from '../memorandos/memorandos.service';
import { ProcessHeaderComponent } from '../components/process-header/process-header.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { ActionButtonComponent } from '@shared/components/standard-components/action-button/action-button.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { LoadImageComponent } from '@shared/components/load-image/load-image.component';
import { ViewMoreComponent } from '@shared/components/view-more/view-more.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-call-attention',
  standalone: true,
  imports: [
    ProcessHeaderComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionButtonComponent,
    LoadImageComponent,
    ViewMoreComponent,
    DatePipe,
  ],
  templateUrl: './call-attention.component.html',
  styleUrl: './call-attention.component.scss',
})
export class CallAttentionComponent implements OnInit {
  callAttentions = [];

  filters = {};

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  loading = true;

  loadingDownload = 0;

  constructor(
    private readonly memorandosService: MemorandosService,
    private readonly modalService: NgbModal,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getCallAttention();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  getCallAttention(): void {
    const params = {
      ...this.filters,
      ...this.pagination,
    };
    this.loading = true;
    this.memorandosService.getCallAttention(params).subscribe({
      next: (res) => {
        const response = res['data'];
        this.callAttentions = response['data'];
        this.pagination.length = response['total'];
        this.loading = false;
      },
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  openAddCallAttention(): void {
    const modalRef = this.modalService.open(CreateCallAttentionComponent);
    modalRef.dismissed.subscribe({
      next: (res) => {
        if (res === 'request-call-attention') this.getCallAttention();
      },
    });
  }

  downloadCallAttention(id: number): void {
    this.loadingDownload = id;
    this.memorandosService.downloadCallAttention(id).subscribe({
      next: (response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/pdf' });
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `llamado_atencion_${id}`;
        link.click();
        this.loadingDownload = 0;
      },
      error: () => {
        this.loadingDownload = 0;
      },
    });
  }
}
