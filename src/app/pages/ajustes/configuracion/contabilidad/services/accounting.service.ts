import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '@shared/interfaces/global.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountingService {
  private paginationDefaults = { page: 1, pageSize: 100, length: 0 };

  private paginationCategories: Pagination = this.paginationDefaults;
  private paginationSubcategories: Pagination = this.paginationDefaults;
  private paginationProducts: Pagination = this.paginationDefaults;
  configurableEntityTypeChanged: EventEmitter<string | undefined> = new EventEmitter();

  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.handlePagination();
  }

  handlePagination(): void {
    // const params = this.activatedRoute.snapshot.queryParams;
    this.activatedRoute.queryParamMap.subscribe({
      next: ({ params }: any) => {
        console.log('paramsIn services', params);
        const configurable_entity_type = params.configurable_entity_type;
        if (configurable_entity_type) {
          this.configurableEntityTypeChanged.emit(params);
        }
      },
    });
  }

  setPaginationCategories(pagination: Pagination) {
    this.paginationCategories = pagination;
    console.log('setcategories deisparada');
    console.log('this.paginationCategories', this.paginationCategories);
    console.log('this.paginationSubcategories', this.paginationSubcategories);
    console.log('this.paginationProducts', this.paginationProducts);
  }

  setPaginationSubcategories(pagination: Pagination) {
    this.paginationSubcategories = pagination;
    console.log('setSubcategories deisparada');
    console.log('this.paginationCategories', this.paginationCategories);
    console.log('this.paginationSubcategories', this.paginationSubcategories);
    console.log('this.paginationProducts', this.paginationProducts);
  }

  setPaginationProducts(pagination: Pagination) {
    this.paginationProducts = pagination;
    console.log('setProductos deisparada');
    console.log('this.paginationCategories', this.paginationCategories);
    console.log('this.paginationSubcategories', this.paginationSubcategories);
    console.log('this.paginationProducts', this.paginationProducts);
  }

  getPaginationCategories() {
    return { ...this.paginationCategories };
  }

  getPaginationSubcategories() {
    return { ...this.paginationSubcategories };
  }

  getPaginationProducts() {
    return { ...this.paginationProducts };
  }
}
