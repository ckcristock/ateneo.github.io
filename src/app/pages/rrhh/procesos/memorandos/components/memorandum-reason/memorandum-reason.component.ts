import { Component, OnInit } from '@angular/core';

import { Pagination } from '@shared/interfaces/global.interface';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { MemorandosService } from '../../memorandos.service';
import { ReasonComponent } from '@shared/components/reason/reason.component';

@Component({
  selector: 'app-memorandum-reason',
  standalone: true,
  imports: [ReasonComponent],
  templateUrl: './memorandum-reason.component.html',
  styleUrls: ['./memorandum-reason.component.scss'],
})
export class MemorandumReasonComponent implements OnInit {
  types = [];

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  loading = true;

  constructor(
    private memorandosService: MemorandosService,
    private swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.getTypeMemorandum();
  }

  getTypeMemorandum(pagination?: Pagination) {
    if (pagination) this.pagination = pagination;
    this.loading = true;
    this.memorandosService.getTypesOfMemorandum(this.pagination).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.types = res.data.data;
        this.pagination.length = res.data.total;
      },
    });
  }

  saveReason(reason) {
    const request = () => {
      this.memorandosService.createNewMemorandumType(reason.value).subscribe({
        next: () => {
          this.swal.show({
            icon: 'success',
            title: 'Guardado',
            showCancel: false,
            text: '',
            timer: 1000,
          });
          this.getTypeMemorandum();
        },
      });
    };
    this.swal.swalLoading('Se creará un nuevo motivo', request);
  }

  onChangeStateReason(data): void {
    const request = () => {
      this.memorandosService.createNewMemorandumType(data).subscribe({
        next: () => {
          this.swal.show({
            icon: 'success',
            title: data.status === 'Inactivo' ? '¡Motivo anulado!' : '¡Motivo activado!',
            showCancel: false,
            timer: 1000,
            text:
              data.status === 'Inactivo'
                ? 'El motivo ha sido anulado con éxito.'
                : 'El motivo ha sido activado con éxito.',
          });
          this.getTypeMemorandum();
        },
      });
    };
    this.swal.swalLoading(
      `Cambiar estado a ${(data.status as string).toLocaleLowerCase()}`,
      request,
    );
  }
}
