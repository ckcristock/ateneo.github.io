import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { consts } from '../../../../core/utils/consts';
import { TiposIngresoService } from './tipos-ingreso.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { UrlFiltersService } from '@shared/services/url-filters.service';
import { MatOptionModule } from '@angular/material/core';
import { UpperCasePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-tipos-ingreso',
  templateUrl: './tipos-ingreso.component.html',
  styleUrls: ['./tipos-ingreso.component.scss'],
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
    NotDataComponent,
    UpperCasePipe,
    StatusBadgeComponent,
  ],
})
export class TiposIngresoComponent implements OnInit {
  loading: boolean = false;
  selected: any;
  ingresss: any[] = [];
  ingress: any = {};
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };
  filtro: any = {
    name: '',
  };
  form: UntypedFormGroup;
  ingressTypes = consts.Ingresstypes;
  constructor(
    private _ingressTypeService: TiposIngresoService,
    private _validators: ValidatorsService,
    private fb: UntypedFormBuilder,
    private _swal: SwalService,
    private _modal: ModalService,
    readonly urlFiltersService: UrlFiltersService,
  ) {}

  ngOnInit(): void {
    this.getUrlFilters();
    this.getIngressType();
    this.createForm();
  }

  private getUrlFilters(): void {
    this.pagination = this.urlFiltersService.currentPagination;
    this.filtro = this.urlFiltersService.currentFilters;
  }

  openModal(content) {
    this._modal.open(content);
    this.form.reset();
    this.selected = 'Nuevo tipo de ingreso';
  }

  getIngress(egress) {
    this.ingress = { ...egress };
    this.selected = 'Actualizar tipo de ingreso';
    this.form.patchValue({
      id: this.ingress.id,
      name: this.ingress.name,
      associated_account: this.ingress.associated_account,
      type: this.ingress.type,
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.ingress.id],
      name: ['', this._validators.required],
      associated_account: ['', this._validators.required],
      type: ['', this._validators.required],
    });
  }

  getIngressType() {
    let params = {
      ...this.pagination,
      ...this.filtro,
    };
    this.loading = true;
    this._ingressTypeService.getIngressType(params).subscribe((res: any) => {
      this.ingresss = res.data.data;
      this.pagination.length = res.data.total;
      this.loading = false;
    });
    this.urlFiltersService.setUrlFilters(params);
  }

  createIngressType() {
    this._ingressTypeService.createIngressType(this.form.value).subscribe((res: any) => {
      this._modal.close();
      this.getIngressType();
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
    const text = 'El tipo de ingreso';
    const request = () => {
      this._ingressTypeService.createIngressType(data).subscribe((res) => {
        this.getIngressType();
        this._swal.activateOrInactivateSwalResponse(status, text);
      });
    };
    this._swal.activateOrInactivateSwal(status, text, request);
  }
}
