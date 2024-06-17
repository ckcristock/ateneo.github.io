import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { setFilters } from '@shared/functions/url-filter.function';
import { Pagination } from '@shared/interfaces/global.interface';

@Injectable({
  providedIn: 'root',
})
export class UrlFiltersService {
  private pagination: Partial<Pagination> = null;

  private filters = null;

  activeFilters = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
  ) {
    this.handleParams();
  }

  private handleParams(): void {
    // const params = this.activatedRoute.snapshot.queryParams;
    this.activatedRoute.queryParamMap.subscribe({
      next: ({ params }: any) => {
        this.clearData();
        const paramSize = Object.keys(params).length;
        const { page, pageSize, ...paramsForm } = params;
        if (!paramSize) this.pagination = this.defaultPagination;
        else {
          this.pagination = {
            page: page,
            pageSize: pageSize,
          };
        }
        if (paramSize <= 2) return;
        this.activeFilters = true;
        Object.keys(paramsForm).forEach((key) => {
          if (!isNaN(+paramsForm[key])) paramsForm[key] = +paramsForm[key];
        });
        this.filters = { ...this.filters, ...paramsForm };
      },
    });
  }

  private clearData(): void {
    this.activeFilters = false;
    this.pagination = null;
    this.filters = null;
  }

  setUrlFilters(params: Object, accountingModule: boolean = false): void {
    if (!accountingModule) {
      delete params['length'];
    }
    const paramsurl = setFilters(params);
    console.log('paramsurl', paramsurl);
    this.location.replaceState(location.pathname, paramsurl.toString());
  }

  get currentPagination(): Pagination {
    return this.pagination
      ? ({ ...this.pagination, length: 0 } as Pagination)
      : this.defaultPagination;
  }

  get currentFilters(): Record<string, any> {
    return this.filters ? { ...this.filters } : {};
  }

  private get defaultPagination() {
    return {
      page: 1,
      pageSize: 100,
      length: 0,
    };
  }
}
