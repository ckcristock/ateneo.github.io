import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ArlService } from './arl.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { PayrollParamCardComponent } from '../payroll-param-card/payroll-param-card.component';

@Component({
  selector: 'app-arl',
  templateUrl: './arl.component.html',
  styleUrls: ['./arl.component.scss'],
  standalone: true,
  imports: [PayrollParamCardComponent],
})
export class ArlComponent implements OnInit {
  arls: any[] = [];

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
    private _arlService: ArlService,
    private swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getArls();
  }

  getArls(params?: any) {
    if (params) this.filters = { ...params };
    this.loading = true;
    this._arlService.getArls(this.filters).subscribe((res: any) => {
      this.arls = res.data.data;
      this.length = res.data.total;
      this.loading = false;
    });
  }

  activateOrInactivate(data) {
    const text = 'La ARL';
    const request = () => {
      this._arlService.createArl(data).subscribe(() => {
        this.getArls();
        this.swalService.activateOrInactivateSwalResponse(data.status, text);
      });
    };
    this.swalService.activateOrInactivateSwal(data.status, text, request);
  }

  async createArl(data: any): Promise<void> {
    try {
      await this.swalService.confirm(`Se ${data?.id ? 'actualizará' : 'creará'} una ARL`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this._arlService.createArl(data).subscribe({
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
                this.getArls();
                this.swalService.show({
                  icon: 'success',
                  title: res.data,
                  text: 'Se ha agregado a la ARL con éxito.',
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
