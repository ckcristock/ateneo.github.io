import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposRiesgoService } from './tipos-riesgo.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '../../../../shared/components/automatic-search/automatic-search.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '../../../../shared/components/standard-components/action-edit/action-edit.component';
import { DropdownActionsComponent } from '../../../../shared/components/standard-components/dropdown-actions/dropdown-actions.component';

import { TableComponent } from '../../../../shared/components/standard-components/table/table.component';
import { AddButtonComponent } from '../../../../shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';

@Component({
  selector: 'app-tipos-riesgo',
  templateUrl: './tipos-riesgo.component.html',
  styleUrls: ['./tipos-riesgo.component.scss'],
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
    NotDataComponent,
    StatusBadgeComponent,
  ],
})
export class TiposRiesgoComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  form: UntypedFormGroup;
  risks: any[] = [];
  private risk: any = {};
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtros: any = {
    risk_type: '',
    accounting_account: '',
  };
  constructor(
    private _tiposRiegoService: TiposRiesgoService,
    private fb: UntypedFormBuilder,
    private _validatorsService: ValidatorsService,
    private _swal: SwalService,
    private _modal: ModalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getRiskType();
    this.createForm();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtros = this.urlFiltersService.currentFilters;
  }

  openModal(content) {
    this._modal.open(content);
    this.form.reset();
    this.selected = 'Nuevo tipo de riesgo';
  }

  getData(data) {
    this.risk = { ...data };
    this.selected = 'Actualizar tipo de riesgo';
    this.form.patchValue({
      id: this.risk.id,
      risk_type: this.risk.risk_type,
      accounting_account: this.risk.accounting_account,
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.risk.id],
      risk_type: ['', this._validatorsService.required],
      accounting_account: ['', this._validatorsService.required],
    });
  }

  getRiskType() {
    let params = {
      ...this.pagination,
      ...this.filtros,
    };
    this.loading = true;
    this._tiposRiegoService.getRiskType(params).subscribe((res: any) => {
      this.risks = res.data.data;
      this.loading = false;
      this.pagination.length = res.data.total;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  createRisk() {
    this._tiposRiegoService.createRisk(this.form.value).subscribe((res: any) => {
      this._modal.close();
      this.getRiskType();
      this._swal.show({
        icon: 'success',
        title: res.data,
        showCancel: false,
        text: '',
        timer: 1000,
      });
    });
  }

  activateOrInactivate(novelty, status) {
    let data = { id: novelty.id, status };
    const request = () => {
      this._tiposRiegoService.createRisk(data).subscribe((res) => {
        this.getRiskType();
        this._swal.activateOrInactivateSwalResponse(status, 'El tipo de riesgo');
      });
    };
    this._swal.activateOrInactivateSwal(status, 'El tipo de riesgo', request);
  }
}
