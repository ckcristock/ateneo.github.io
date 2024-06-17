import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BancosService } from './bancos.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { PayrollParamCardComponent } from '../payroll-param-card/payroll-param-card.component';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.scss'],
  standalone: true,
  imports: [PayrollParamCardComponent],
})
export class BancosComponent implements OnInit {
  banks: any[] = [];

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
    private _bancosService: BancosService,
    private swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getBanks();
  }

  getBanks(params?: any) {
    if (params) this.filters = { ...params };
    this.loading = true;
    this._bancosService.getBanks(this.filters).subscribe((res: any) => {
      this.banks = res.data.data;
      this.length = res.data.total;
      this.loading = false;
    });
  }

  activateOrInactivate(data) {
    const text = 'El banco';
    const request = () => {
      this._bancosService.createBank(data).subscribe(() => {
        this.getBanks();
        this.swalService.activateOrInactivateSwalResponse(data.status, text);
      });
    };
    this.swalService.activateOrInactivateSwal(data.status, text, request);
  }

  async createBank(data: any): Promise<void> {
    try {
      await this.swalService.confirm(`Se ${data?.id ? 'actualizará' : 'creará'} un banco`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this._bancosService.createBank(data).subscribe({
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
                this.getBanks();
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
      });
    } catch (error) {
      this.swalService.hardError();
    }
  }
}
