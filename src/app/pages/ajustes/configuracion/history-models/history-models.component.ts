import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { RouterModule } from '@angular/router';
import { HistoryModelPaginate, HistoryModelsService } from './history-models.service';
import { Pagination } from '@shared/interfaces/global.interface';
import { pagination } from '@app/core/utils/consts';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { debounceTime } from 'rxjs';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';

@Component({
  selector: 'app-history-models',
  standalone: true,
  imports: [
    CommonModule,
    StandardModule,
    AddButtonComponent,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    AutomaticSearchComponent,
    ReactiveFormsModule,
    ActionViewComponent,
    NotDataComponent,
  ],
  templateUrl: './history-models.component.html',
  styleUrl: './history-models.component.scss',
})
export class HistoryModelsComponent implements OnInit {
  templates: HistoryModelPaginate[] = [];

  loading: boolean = false;

  pagination: Pagination = pagination;

  formFilter!: FormGroup;

  constructor(
    private readonly historyModelService: HistoryModelsService,
    private fb: FormBuilder,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    //this.initFormFilter();
    //this.getUrlFilters();
    //this.getTemplates();
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 10000);
  }

  private initFormFilter(): void {
    this.formFilter = this.fb.group({
      name: [''],
    });
    this.formFilter.valueChanges.pipe(debounceTime(500)).subscribe(() => this.getTemplates());
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    const { ...paramsForm } = this.urlFiltersService.currentFilters;
    this.formFilter.patchValue({ ...paramsForm });
  }

  getTemplates() {
    const params = {
      ...this.pagination,
      ...this.formFilter.value,
    };
    this.loading = true;
    this.historyModelService.templatesPaginate(params).subscribe({
      next: (resp) => {
        this.templates = resp.data.data;
        this.pagination.length = resp.data.total;
        this.loading = false;
      },
      error: () => {},
    });
    this.urlFiltersService.setUrlFilters(params);
  }
}
