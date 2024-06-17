import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposNovedadesService } from './tipos-novedades.service';
import { consts } from '../../../../core/utils/consts';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Pagination } from '@shared/interfaces/global.interface';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-tipos-novedades',
  templateUrl: './tipos-novedades.component.html',
  styleUrls: ['./tipos-novedades.component.scss'],
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
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    StatusBadgeComponent,
  ],
})
export class TiposNovedadesComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  form: UntypedFormGroup;
  novelties: any[] = [];
  public disabled = false;
  private novelty: any = {};
  pagination: Pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtros: any = {
    novelty: '',
  };
  modalities = consts.modalities;
  constructor(
    private _tiposNovedadesService: TiposNovedadesService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
    private _modal: ModalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getNovelties();
    this.createForm();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  openModal(content) {
    this.disabled = false;
    this._modal.open(content);
    this.form.reset();
    this.selected = 'Nuevo tipo de novedad';
  }

  getData(data) {
    this.disabled = false;
    this.novelty = { ...data };
    this.selected = 'Actualizar tipo de novedad';
    this.form.patchValue({
      id: this.novelty.id,
      concept: this.novelty.concept,
      novelty: this.novelty.novelty,
      modality: this.novelty.modality,
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.novelty.id],
      concept: [''],
      novelty: [''],
      modality: [''],
    });
  }

  getNovelties() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this._tiposNovedadesService.getNovelties(params).subscribe((res: any) => {
      this.novelties = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  createNovelty() {
    this.disabled = true;

    this._tiposNovedadesService.createNovelty(this.form.value).subscribe((res: any) => {
      this._modal.close();
      this.getNovelties();
      this._swal.show({
        icon: 'success',
        title: res.data,
        showCancel: false,
        text: '',
        timer: 1000,
      });
    });
  }

  activateOrInactivate(novelty, state) {
    let data = { id: novelty.id, state };
    const statusString = state ? 'activo' : 'inactivo';
    const request = () => {
      this._tiposNovedadesService.createNovelty(data).subscribe((res) => {
        this.getNovelties();
        this._swal.activateOrInactivateSwalResponse(statusString, 'El tipo de novedad');
      });
    };
    this._swal.activateOrInactivateSwal(statusString, 'El tipo de novedad', request);
  }
}
