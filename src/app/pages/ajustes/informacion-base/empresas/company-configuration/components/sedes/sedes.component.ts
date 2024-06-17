import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { SedesService } from './sedes.service';
import {
  NgbDropdown,
  NgbDropdownToggle,
  NgbDropdownMenu,
  NgbPagination,
} from '@ng-bootstrap/ng-bootstrap';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbPagination,
    NotDataComponent,
    UpperCasePipe,
    StandardModule,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
  ],
})
export class SedesComponent implements OnInit {
  @Input('company_id') company_id;
  pagination = {
    pageSize: 50,
    page: 1,
    length: 0,
  };
  filters: any = {
    name: '',
    company_id: '',
  };
  sedes: any[] = [];
  loading: boolean;

  constructor(
    private _sedes: SedesService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getLocations();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filters = this.urlFiltersService.currentFilters;
  }

  getLocations() {
    this.filters.company_id = this.company_id;
    let params = {
      ...this.pagination,
      ...this.filters,
    };
    this.loading = true;
    this._sedes.paginateLocations(params).subscribe((res: any) => {
      this.sedes = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }
}
