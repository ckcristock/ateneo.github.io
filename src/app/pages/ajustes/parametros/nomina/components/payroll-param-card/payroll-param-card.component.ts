import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Select } from '@shared/interfaces/global.interface';

import { ManagePayrollParamComponent } from '../manage-payroll-param/manage-payroll-param.component';
import { AutomaticSearchComponent } from '@shared/components/automatic-search/automatic-search.component';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { ActionEditComponent } from '@shared/components/standard-components/action-edit/action-edit.component';
import { ActionDeactivateComponent } from '@shared/components/standard-components/action-deactivate/action-deactivate.component';
import { ActionActivateComponent } from '@shared/components/standard-components/action-activate/action-activate.component';
import { AddButtonComponent } from '@shared/components/standard-components/add-button/add-button.component';
import { StatusBadgeComponent } from '@shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-payroll-param-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    AutomaticSearchComponent,
    StandardModule,
    ActionEditComponent,
    ActionDeactivateComponent,
    ActionActivateComponent,
    AddButtonComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './payroll-param-card.component.html',
  styleUrl: './payroll-param-card.component.scss',
})
export class PayrollParamCardComponent {
  @Input() titleCard = '';

  @Input() data = [];

  @Input('length') set changeLength(newLength: number) {
    this.pagination.length = newLength;
  }

  @Input() loading = false;

  @Output() changeState = new EventEmitter();

  @Output() edited = new EventEmitter();

  @Output() added = new EventEmitter();

  @Output() newRequest = new EventEmitter();

  readonly status: Select[] = [
    {
      text: 'Todos',
      value: '',
    },
    {
      text: 'Activo',
      value: 'activo',
    },
    {
      text: 'Inactivo',
      value: 'inactivo',
    },
  ];

  filters = {
    name: '',
    code: '',
    nit: '',
    status: '',
  };

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  constructor(private readonly modalService: NgbModal) {}

  openManagePayroll(isCreate: boolean, dataEdit?: any): void {
    const modalRef = this.modalService.open(ManagePayrollParamComponent, {
      centered: true,
    });
    if (isCreate)
      modalRef.componentInstance.titleModal = `Crear ${this.titleCard.toLocaleLowerCase()}`;
    else modalRef.componentInstance.titleModal = `Editar ${this.titleCard.toLocaleLowerCase()}`;
    if (dataEdit) modalRef.componentInstance.dataEdit = dataEdit;
    modalRef.componentInstance.sendData.subscribe({
      next: (res) => {
        if (isCreate) this.added.emit(res);
        else this.edited.emit({ ...res, id: dataEdit.id });
      },
    });
  }

  onChangeState(id: number, status: string): void {
    this.changeState.emit({
      id,
      status,
    });
  }

  sendNewRequest(): void {
    this.newRequest.emit({
      ...this.pagination,
      ...this.filters,
    });
  }
}
