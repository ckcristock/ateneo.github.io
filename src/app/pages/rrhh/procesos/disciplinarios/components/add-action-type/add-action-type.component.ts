import { Component } from '@angular/core';

import { Pagination } from '@shared/interfaces/global.interface';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ActionTypeService } from './action-type.service';
import { ReasonComponent } from '@shared/components/reason/reason.component';

@Component({
  selector: 'app-add-action-type',
  standalone: true,
  imports: [ReasonComponent],
  templateUrl: './add-action-type.component.html',
  styleUrl: './add-action-type.component.scss',
})
export class AddActionTypeComponent {
  actionsTypes = [];

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  loading = true;

  constructor(
    private readonly actionTypeService: ActionTypeService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getActionsTypes();
  }

  getActionsTypes(pagination?: Pagination) {
    if (pagination) this.pagination = pagination;
    this.loading = true;
    this.actionTypeService.getActionTypePaginate(this.pagination).subscribe({
      next: (res) => {
        this.loading = false;
        this.actionsTypes = res.data.data;
        this.pagination.length = res.data.total;
      },
    });
  }

  saveActionType(reason) {
    const data = reason.value;
    reason.reset();
    const request = () => {
      reason.markAsUntouched();
      this.actionTypeService.createActionType(data).subscribe({
        next: () => {
          this.swalService.show({
            icon: 'success',
            title: 'Guardado',
            showCancel: false,
            text: '',
            timer: 1000,
          });
          this.getActionsTypes();
        },
      });
    };
    this.swalService.swalLoading(`Crear tipo de actuación`, request);
  }

  onChangeState(data): void {
    const request = () => {
      this.actionTypeService.createActionType(data).subscribe({
        next: () => {
          this.swalService.show({
            icon: 'success',
            title: data.status === 'Inactivo' ? 'Actuación anulado!' : '¡Actuación activado!',
            showCancel: false,
            timer: 1000,
            text: `El actuación ha sido ${
              data.status === 'Inactivo' ? 'anulado' : 'activado'
            } con éxito.`,
          });
          this.getActionsTypes();
        },
      });
    };
    this.swalService.swalLoading(
      `Cambiar estado a ${(data.status as string).toLocaleLowerCase()}`,
      request,
    );
  }
}
