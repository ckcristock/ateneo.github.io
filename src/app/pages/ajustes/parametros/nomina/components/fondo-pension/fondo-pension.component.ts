import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FondoPensionService } from './fondo-pension.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { PayrollParamCardComponent } from '../payroll-param-card/payroll-param-card.component';

@Component({
  selector: 'app-fondo-pension',
  templateUrl: './fondo-pension.component.html',
  styleUrls: ['./fondo-pension.component.scss'],
  standalone: true,
  imports: [PayrollParamCardComponent],
})
export class FondoPensionComponent implements OnInit {
  pensions: any[] = [];

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
    private _fondoPensionService: FondoPensionService,
    private swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getPensionFunds();
  }

  getPensionFunds(params?: any) {
    if (params) this.filters = { ...params };
    this.loading = true;
    this._fondoPensionService.getPensionFunds(this.filters).subscribe((res: any) => {
      this.pensions = res.data.data;
      this.length = res.data.total;
      this.loading = false;
    });
  }

  activateOrInactivate(data) {
    const text = 'El fondo de pensión';
    const request = () => {
      this._fondoPensionService.createPensionFund(data).subscribe(() => {
        this.getPensionFunds();
        this.swalService.activateOrInactivateSwalResponse(data.status, text);
      });
    };
    this.swalService.activateOrInactivateSwal(data.status, text, request);
  }

  async createPensionFund(data: any): Promise<void> {
    try {
      await this.swalService.confirm(
        `Se ${data?.id ? 'actualizará' : 'creará'} un fondo de pensión`,
        {
          preConfirm: () => {
            return new Promise((resolve) => {
              this._fondoPensionService.createPensionFund(data).subscribe({
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
                  this.getPensionFunds();
                  this.swalService.show({
                    icon: 'success',
                    title: res.data,
                    text: `Se ha ${!data?.id ? 'creado' : 'actualizado'} el fondo con éxito.`,
                    timer: 2000,
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
