import { Component, OnInit, ViewChild } from '@angular/core';
import { Response } from 'src/app/core/response.model';
import { showConfirm, successMessage } from 'src/app/core/utils/confirmMessage';
import { SpecialityModalComponent } from './speciality-modal/speciality-modal.component';
import { SpecialityService } from './speciality.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';

@Component({
  selector: 'app-speciality',
  templateUrl: './speciality.component.html',
  styleUrls: ['./speciality.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    AddButtonComponent,
    TableComponent,
    DropdownActionsComponent,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AutomaticSearchComponent,
    SpecialityModalComponent,
  ],
})
export class SpecialityComponent implements OnInit {
  specialities: Array<any> = [];
  loading: boolean = false;

  filtros: any = {
    name: '',
    code: '',
  };

  pagination = {
    pageSize: 25,
    page: 1,
    length: 0,
  };

  @ViewChild(SpecialityModalComponent) modal: SpecialityModalComponent;

  constructor(
    private _specialityService: SpecialityService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getSpecialties();
    this.getUrlFilters();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  getSpecialties() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };

    this.loading = true;
    this._specialityService.getAllPaginateSpeciality(params).subscribe((res: any) => {
      this.loading = false;
      this.specialities = res.data.data;
      this.pagination.length = res.data.total;
    });

    this.urlFiltersService.setUrlFilters(params);
  }

  openModal = () => {
    this.modal.speciality.id = 0;
    this.modal.openModal();
  };

  edit = (id: Number) => {
    this.modal.speciality.id = id;
    this.modal.openModal();
  };

  inactive = async (id: Number, status: string) => {
    showConfirm(status, 'Especialidad').then((result) => {
      if (result.isConfirmed)
        this._specialityService.ChangeSpeciality(id, status).subscribe((res: Response) => {
          this.getSpecialties();
          successMessage(null, res.data);
        });
    });
  };
}
