import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import moment from 'moment';
import { PayRollPaymentsService } from './pay-roll-payments.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { DecimalPipe } from '@angular/common';
import { StandardModule } from '@shared/components/standard-components/standard.module';
import { ActionViewComponent } from '@shared/components/standard-components/action-view/action-view.component';

@Component({
  selector: 'app-historial-pagos',
  templateUrl: './historial-pagos.component.html',
  styleUrls: ['./historial-pagos.component.scss'],
  standalone: true,
  imports: [RouterLink, DecimalPipe, StandardModule, ActionViewComponent],
})
export class HistorialPagosComponent implements OnInit {
  historialPagos: any[] = [];
  loading: boolean;
  pagination = {
    page: 1,
    pageSize: 10,
    length: 0,
  };
  filters: any = {
    date: '',
  };
  constructor(
    private _payrollPayments: PayRollPaymentsService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.getHistorialPagos();
  }

  getHistorialPagos() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filters,
    };
    this._payrollPayments.getPayrollHistory(params).subscribe((r: any) => {
      this.historialPagos = r.data.data;
      this.pagination.length = r.data.total;
      this.loading = false;
    });
  }

  async onDianReport(id: number): Promise<void> {
    try {
      await this.swalService.confirm('¡Se realizará el reporte a la DIAN!', {
        preConfirm: () => {
          return new Promise((resolve) => {
            this._payrollPayments.postDianReport({ payroll_payment_id: id }).subscribe({
              next: () => {
                this.swalService.show({
                  icon: 'success',
                  title: '¡Reporte realizado con éxito!',
                  timer: 3000,
                  showCancel: false,
                });
                this.getHistorialPagos();
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

  formatFechas({ inicio_periodo, fin_periodo }) {
    const inicioPeriodo = moment(inicio_periodo).format('DD/MM/YYYY');
    const finPeriodo = moment(fin_periodo).format('DD/MM/YYYY');
    return `${inicioPeriodo} - ${finPeriodo}`;
  }
}
