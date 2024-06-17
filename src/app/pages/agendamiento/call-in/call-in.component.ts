import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { CallInService } from './call-in.service';

@Component({
  selector: 'undefined-call-in',
  templateUrl: './call-in.component.html',
  styleUrls: ['./call-in.component.css'],
  providers: [CallInService],
  standalone: true,
  imports: [DatePipe, CardComponent, TableComponent, AutomaticSearchComponent],
})
export class CallInComponent implements OnInit {
  calls: Array<any> = [];

  loading: boolean = false;

  filters: any = {
    identifier: '',
  };

  pagination = {
    pageSize: 25,
    page: 1,
    length: 0,
  };

  constructor(
    private callInService: CallInService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit() {
    this.getUrlFilters();
    this.searchIdentifier();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  searchIdentifier() {
    const params = {
      ...this.filters,
      ...this.pagination,
    };
    this.loading = true;
    this.callInService.getCalls(params).subscribe({
      next: (res: any) => {
        this.calls = res.data.data;
        this.pagination.length = res.data.total;
        this.loading = false;
      },
    });
    this.urlFiltersService.setUrlFilters(params);
  }
}
