import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaginatorService {
  constructor() {}

  handlePageEvent(event: PageEvent, pagination) {
    pagination.pageSize = event?.pageSize;
    pagination.page = event?.pageIndex + 1;
  }

  resetFiltros(formFilters) {
    for (const controlName in formFilters?.controls) {
      formFilters?.get(controlName).setValue('');
    }
  }

  SetFiltros(paginacion, pagination, formFilters) {
    let params = new HttpParams();
    params = params?.set('pag', paginacion);
    params = params?.set('pageSize', pagination?.pageSize);
    for (const controlName in formFilters?.controls) {
      const control = formFilters?.get(controlName);
      if (control?.value) {
        params = params?.set(controlName, control?.value);
      }
    }
    return params;
  }

  checkParams(pagination, params, nameLocalStorage, items = 100) {
    if (params?.params?.pageSize) {
      pagination.pageSize = params?.params?.pageSize;
    } else {
      pagination.pageSize = localStorage?.getItem(nameLocalStorage) || items;
    }
    if (params?.params?.pag) {
      pagination.page = params?.params?.pag;
    } else {
      pagination.page = 1;
    }
  }
}
