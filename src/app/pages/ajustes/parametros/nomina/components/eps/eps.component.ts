import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EpsService } from './eps.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { PayrollParamCardComponent } from '../payroll-param-card/payroll-param-card.component';

@Component({
  selector: 'app-eps',
  templateUrl: './eps.component.html',
  styleUrls: ['./eps.component.scss'],
  standalone: true,
  imports: [PayrollParamCardComponent],
})
export class EpsComponent implements OnInit {
  epsData = [];

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
    private epsService: EpsService,
    private swalService: SwalService,
    private readonly modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getAllEps();
  }

  getAllEps(params?: any) {
    if (params) this.filters = { ...params };
    this.loading = true;
    this.epsService.getPaginateEps(this.filters).subscribe((res: any) => {
      this.loading = false;
      this.epsData = res.data.data;
      this.length = res.data.total;
    });
  }

  anularOActivar(data) {
    const text = 'La EPS';
    const request = () => {
      this.epsService.saveNewEps(data).subscribe(() => {
        this.getAllEps();
        this.swalService.activateOrInactivateSwalResponse(data.status, text);
      });
    };
    this.swalService.activateOrInactivateSwal(data.status, text, request);
  }

  async createNewEps(data: any): Promise<void> {
    try {
      await this.swalService.confirm(`Se ${data?.id ? 'actualizará' : 'creará'} una EPS`, {
        preConfirm: () => {
          return new Promise((resolve) => {
            this.epsService.saveNewEps(data).subscribe({
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
                this.getAllEps();
                this.swalService.show({
                  title: res.data,
                  icon: 'success',
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
