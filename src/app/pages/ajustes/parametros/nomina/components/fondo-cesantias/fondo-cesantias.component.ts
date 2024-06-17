import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FondoCesantiasService } from './fondo-cesantias.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { PayrollParamCardComponent } from '../payroll-param-card/payroll-param-card.component';

@Component({
  selector: 'app-fondo-cesantias',
  templateUrl: './fondo-cesantias.component.html',
  styleUrls: ['./fondo-cesantias.component.scss'],
  standalone: true,
  imports: [PayrollParamCardComponent],
})
export class FondoCesantiasComponent implements OnInit {
  severances: any[] = [];

  filters = {
    pageSize: 5,
    page: 1,
    name: '',
    code: '',
    nit: '',
  };

  length = 0;

  loading: boolean = false;

  constructor(
    private _fondoCensatiasService: FondoCesantiasService,
    private swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getSeveranceFunds();
  }

  getSeveranceFunds(params?: any) {
    if (params) this.filters = { ...params };
    this.loading = true;
    this._fondoCensatiasService.getSeveranceFunds(this.filters).subscribe((res: any) => {
      this.severances = res.data.data;
      this.length = res.data.total;
      this.loading = false;
    });
  }

  activateOrInactivate(data) {
    const text = 'El fondo de cesantías';
    const request = () => {
      this._fondoCensatiasService.createSeveranceFunds(data).subscribe(() => {
        this.getSeveranceFunds();
        this.swalService.activateOrInactivateSwalResponse(data.status, text);
      });
    };
    this.swalService.activateOrInactivateSwal(data.status, text, request);
  }

  async createSeveranceFunds(data: any): Promise<void> {
    try {
      await this.swalService.confirm(
        `Se ${data?.id ? 'actualizará' : 'creará'} un fondo de cesantia`,
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this._fondoCensatiasService.createSeveranceFunds(data).subscribe({
                next: (res: any) => {
                  if (res.code == 422 || res.code == 500) {
                    this.swalService.show({
                      title: 'Error',
                      icon: 'error',
                      text: res.err,
                      timer: null,
                      showCancel: false,
                    });
                    return;
                  }
                  this.getSeveranceFunds();
                  this.swalService.show({
                    icon: 'success',
                    title: res.data,
                    text: `Se ha ${!data?.id ? 'creado' : 'actualizado'} el fondo con éxito.`,
                    timer: 1000,
                    showCancel: false,
                  });
                  this.modalService.dismissAll();
                  resolve(true);
                },
                error: () => {
                  resolve(false);
                },
              });
            });
          },
          showLoaderOnConfirm: true,
        },
      );
    } catch (error) {
      this.swalService.hardError();
    }
  }
}
