import { Component, Input, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ElectronicPayrollsService } from '../electronic-payrolls.service';
import { PayrollStatusPipe } from '../../../../core/pipes/payroll-status.pipe';
import { NotDataComponent } from '@shared/components/standard-components/not-data/not-data.component';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { ModalBasicComponent } from '../../../../components/modal-basic/modal-basic.component';

@Component({
  selector: 'app-historico-nomina-electronica',
  templateUrl: './historico-nomina-electronica.component.html',
  styleUrls: ['./historico-nomina-electronica.component.scss'],
  standalone: true,
  imports: [
    ModalBasicComponent,
    NgIf,
    NgFor,
    NgClass,
    NotDataComponent,
    DatePipe,
    PayrollStatusPipe,
  ],
})
export class HistoricoNominaElectronicaComponent implements OnInit {
  @ViewChild('modal') modal;
  @Input('getData') getData: EventEmitter<any>;

  loading = false;
  id: number;
  data: any[] = [];

  constructor(private _electronicP: ElectronicPayrollsService) {}

  ngOnInit(): void {
    this.getData.subscribe((r) => {
      this.loading = true;
      this.id = r;
      this.getElectronicPayroll();
      this.show();
    });
  }

  show() {
    this.modal.show();
  }

  getElectronicPayroll() {
    this._electronicP.getElectronicPayroll(this.id).subscribe((r: any) => {
      this.data = r.data;
      this.loading = false;
    });
  }
}
