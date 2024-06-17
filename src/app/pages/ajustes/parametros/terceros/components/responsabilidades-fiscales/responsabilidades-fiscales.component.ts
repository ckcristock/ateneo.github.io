import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ResponsabilidadesFiscalesService } from './responsabilidades-fiscales.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatInputModule } from '@angular/material/input';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { CardComponent } from '@shared/components/standard-components/card/card.component';
import { DropdownActionsComponent } from '@shared/components/standard-components/dropdown-actions/dropdown-actions.component';
import { TableComponent } from '@shared/components/standard-components/table/table.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-responsabilidades-fiscales',
  templateUrl: './responsabilidades-fiscales.component.html',
  styleUrls: ['./responsabilidades-fiscales.component.scss'],
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
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    ModalComponent,
    ReactiveFormsModule,
    MatInputModule,
    StatusBadgeComponent,
  ],
})
export class ResponsabilidadesFiscalesComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private _responsabilidades: ResponsabilidadesFiscalesService,
    private _swal: SwalService,
    private modalService: ModalService,
  ) {}

  form: UntypedFormGroup;

  loading: boolean = false;
  fiscalR: any[] = [];
  fiscal: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  filters: any = {
    name: '',
    state: '',
  };

  ngOnInit(): void {
    this.createForm();
    this.getFiscalResponsibility();
  }

  openModal(content, titulo) {
    this.title = titulo;
    this.modalService.open(content);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.fiscal.id],
      code: [this.fiscal.code],
      name: ['', Validators.required],
    });
  }

  getFiscalResponsibility() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filters,
    };
    this._responsabilidades.getFiscalResponsibility(params).subscribe((r: any) => {
      this.fiscalR = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
  }

  getFiscal(fiscald) {
    this.fiscal = { ...fiscald };
    this.form.patchValue({
      id: this.fiscal.id,
      code: this.fiscal.code,
      name: this.fiscal.name,
    });
  }

  save() {
    this._responsabilidades
      .updateOrCreategetFiscalResponsibility(this.form.value)
      .subscribe((r: any) => {
        this.modalService.close();
        this.form.reset();
        this.getFiscalResponsibility();
        this._swal.show({
          icon: 'success',
          title: r.data,
          text: '',
          showCancel: false,
          timer: 1000,
        });
      });
  }

  activateOrInactivate(fiscal, state) {
    let data = { id: fiscal.id, state };
    const text = 'La responsabilidad fiscal';
    const request = () => {
      this._responsabilidades.updateOrCreategetFiscalResponsibility(data).subscribe((res) => {
        this.getFiscalResponsibility();
        this._swal.activateOrInactivateSwalResponse(state, text);
      });
    };
    this._swal.activateOrInactivateSwal(state, text, request);
  }
}
