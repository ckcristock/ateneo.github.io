import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from './person.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '../../../../../shared/components/automatic-search/automatic-search.component';
import { ActionEditComponent } from '../../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { NgClass, UpperCasePipe, DecimalPipe } from '@angular/common';
import { LoadImageComponent } from '../../../../../shared/components/load-image/load-image.component';
import { TableComponent } from '../../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    LoadImageComponent,
    NgClass,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    AutomaticSearchComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    UpperCasePipe,
    DecimalPipe,
  ],
})
export class PersonsComponent implements OnInit {
  pagination = {
    pageSize: 20,
    page: 1,
    length: 0,
  };

  filtros: any = {
    name: '',
    identifier: '',
    company: '',
    status: '',
  };

  public loading = true;
  public persons: Array<any> = [];

  @Output()
  edit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _service: PersonService,
    private readonly router: Router,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getProfessionals();
    this.getUrlFilters();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  createOrUpdated = (id = null) => {
    this._service.id = id;
    this.router.navigate(['/ajustes/informacion-base/professionals/create']);
  };

  getProfessionals() {
    this.loading = true;
    let params = { ...this.pagination, ...this.filtros };

    this._service.getPeople(params).subscribe((res: any) => {
      this.persons = res.data.data;
      this.pagination.length = res.data.total;
      this.pagination.pageSize = res.data.per_page;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  suspend = () => {
    console.log('suspendiendo');
  };

  update = (id) => {
    this.edit.emit(id);
  };
}
