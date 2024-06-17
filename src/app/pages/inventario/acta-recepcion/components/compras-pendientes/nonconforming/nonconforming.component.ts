import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Pagination } from '@shared/interfaces/global.interface';

import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ReasonComponent } from '@shared/components/reason/reason.component';
import { ActaRecepcionService } from '../../../acta-recepcion.service';

@Component({
  selector: 'app-nonconforming',
  standalone: true,
  imports: [ReasonComponent],
  templateUrl: './nonconforming.component.html',
  styleUrl: './nonconforming.component.scss',
})
export class NonconformingComponent {
  nonconforming = [];

  addColumns = [
    {
      name: 'Código',
      key: 'Codigo',
    },
    {
      name: 'Tratamiento',
      key: 'Tratamiento',
    },
  ];

  pagination = {
    page: 1,
    pageSize: 5,
    length: 0,
  };

  loading = true;

  constructor(
    private readonly actaRecepcionService: ActaRecepcionService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getNonconforming();
  }

  getNonconforming(pagination?: Pagination) {
    if (pagination) this.pagination = pagination;
    this.loading = true;
    this.actaRecepcionService.getNonConformingPaginate(this.pagination).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.nonconforming = res.data.data.map((data) => {
          data.text = data.Nombre;
          data.value = data.Id_Causal_No_Conforme;
          data.status = data.status ? 'activo' : 'inactivo';
          return data;
        });
        this.pagination.length = res.data.total;
      },
    });
  }

  saveReason(reason: FormGroup) {
    const data = {
      Nombre: reason.value.name,
    };
    reason.reset();
    const request = () => {
      reason.markAsUntouched();
      this.actaRecepcionService.postNonconforming(data).subscribe({
        next: () => {
          this.swalService.show({
            icon: 'success',
            title: 'Guardado',
            showCancel: false,
            text: '',
            timer: 2000,
          });
          this.getNonconforming();
        },
      });
    };
    this.swalService.swalLoading('Se creará un nuevo no conforme', request);
  }

  onChangeStateReason(data): void {
    const body = {
      status: data.status === 'Activo',
    };
    const request = () => {
      this.actaRecepcionService.patchNonconforming(body, data.id).subscribe({
        next: () => {
          this.swalService.show({
            icon: 'success',
            title: data.status === 'Inactivo' ? 'No conforme anulado!' : '¡No conforme activado!',
            showCancel: false,
            timer: 2000,
            text:
              data.status === 'Inactivo'
                ? 'La no conformidad ha sido anulado con éxito.'
                : 'La no conformidad ha sido activado con éxito.',
          });
          this.getNonconforming();
        },
      });
    };
    this.swalService.swalLoading(
      `Cambiar estado a ${(data.status as string).toLocaleLowerCase()}`,
      request,
    );
  }
}
