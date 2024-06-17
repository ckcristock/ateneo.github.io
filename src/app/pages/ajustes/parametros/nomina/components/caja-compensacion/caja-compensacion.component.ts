import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CajaCompensacionService } from './caja-compensacion.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { PayrollParamCardComponent } from '../payroll-param-card/payroll-param-card.component';

@Component({
  selector: 'app-caja-compensacion',
  templateUrl: './caja-compensacion.component.html',
  styleUrls: ['./caja-compensacion.component.scss'],
  standalone: true,
  imports: [PayrollParamCardComponent],
})
export class CajaCompensacionComponent implements OnInit {
  compensations: any[] = [];

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
    private _compensationService: CajaCompensacionService,
    private swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getCompensationFound();
  }

  getCompensationFound(params?: any) {
    if (params) this.filters = { ...params };
    this.loading = true;
    this._compensationService.getCompensationFound(this.filters).subscribe((res: any) => {
      this.compensations = res.data.data;
      this.length = res.data.total;
      this.loading = false;
    });
  }

  activateOrInactivate(data) {
    const text = 'La caja de compensación';
    const request = () => {
      this._compensationService.newCompensationFound(data).subscribe(() => {
        this.getCompensationFound();
        this.swalService.activateOrInactivateSwalResponse(data.status, text);
      });
    };
    this.swalService.activateOrInactivateSwal(data.status, text, request);
  }

  async newCompensationFound(data: any): Promise<void> {
    try {
      await this.swalService.confirm(
        `Se ${data?.id ? 'actualizará' : 'creará'} una caja de compensación`,
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this._compensationService.newCompensationFound(data).subscribe({
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
                  this.getCompensationFound();
                  this.swalService.show({
                    icon: 'success',
                    title: res.data,
                    text: '',
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
