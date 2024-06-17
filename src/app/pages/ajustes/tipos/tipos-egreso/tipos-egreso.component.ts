import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TiposEgresoService } from './tipos-egreso.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { consts } from '../../../../core/utils/consts';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
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
  selector: 'app-tipos-egreso',
  templateUrl: './tipos-egreso.component.html',
  styleUrls: ['./tipos-egreso.component.scss'],
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
export class TiposEgresoComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  egresss: any[] = [];
  egress: any = {};
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtro: any = {
    name: '',
  };
  form: UntypedFormGroup;
  egressTypes = consts.Egresstypes;
  constructor(
    private _egressTypeService: TiposEgresoService,
    private _validators: ValidatorsService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
    private _modal: ModalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getEgressType();
    this.createForm();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtro = this.urlFiltersService.currentFilters;
  }

  openModal(content) {
    this._modal.open(content);
    this.form.reset();
    this.selected = 'Nuevo tipo de egreso';
  }

  getEgress(egress) {
    this.egress = { ...egress };
    this.selected = 'Actualizar tipo de egreso';
    this.form.patchValue({
      id: this.egress.id,
      name: this.egress.name,
      associated_account: this.egress.associated_account,
      type: this.egress.type,
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.egress.id],
      name: ['', this._validators.required],
      associated_account: ['', this._validators.required],
      type: ['', this._validators.required],
    });
  }

  getEgressType() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._egressTypeService.getEgresstype(params).subscribe((res: any) => {
      this.egresss = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  createEgressType() {
    this._egressTypeService.createEgressType(this.form.value).subscribe((res: any) => {
      this._modal.close();
      this.getEgressType();
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
      this._egressTypeService.createEgressType(data).subscribe((res) => {
        this.getEgressType();
        this._swal.activateOrInactivateSwalResponse(status, 'El tipo de egreso');
      });
    };
    this._swal.activateOrInactivateSwal(status, 'El tipo de egreso', request);
  }
}
