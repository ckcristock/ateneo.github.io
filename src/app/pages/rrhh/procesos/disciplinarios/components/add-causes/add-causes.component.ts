import { Component } from '@angular/core';

import { Pagination } from '@shared/interfaces/global.interface';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DisciplinariosService } from '../../disciplinarios.service';
import { FormGroup } from '@angular/forms';
import { ReasonComponent } from '@shared/components/reason/reason.component';

@Component({
  selector: 'app-add-causes',
  standalone: true,
  imports: [ReasonComponent],
  templateUrl: './add-causes.component.html',
  styleUrl: './add-causes.component.scss',
})
export class AddCausesComponent {
  causes = [];

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  loading = true;

  constructor(
    private readonly disciplinaryService: DisciplinariosService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getCauses();
  }

  getCauses(pagination?: Pagination) {
    if (pagination) this.pagination = pagination;
    this.loading = true;
    this.disciplinaryService.getClosureReasonPaginate(this.pagination).subscribe({
      next: (res) => {
        this.loading = false;
        this.causes = res.data.data;
        this.pagination.length = res.data.total;
      },
    });
  }

  saveReason(reason: FormGroup) {
    const data = reason.value;
    reason.reset();
    const request = () => {
      reason.markAsUntouched();
      this.disciplinaryService.createClosureReason(data).subscribe({
        next: () => {
          this.swalService.show({
            icon: 'success',
            title: 'Guardado',
            showCancel: false,
            text: '',
            timer: 1000,
          });
          this.getCauses();
        },
      });
    };
    this.swalService.swalLoading('Se creará un nuevo causal', request);
  }

  onChangeStateReason(data): void {
    const request = () => {
      this.disciplinaryService.createClosureReason(data).subscribe({
        next: () => {
          this.swalService.show({
            icon: 'success',
            title: data.status === 'Inactivo' ? 'Causal anulado!' : '¡Causal activado!',
            showCancel: false,
            timer: 1000,
            text:
              data.status === 'Inactivo'
                ? 'El causal ha sido anulado con éxito.'
                : 'El causal ha sido activado con éxito.',
          });
          this.getCauses();
        },
      });
    };
    this.swalService.swalLoading(
      `Cambiar estado a ${(data.status as string).toLocaleLowerCase()}`,
      request,
    );
  }
}
